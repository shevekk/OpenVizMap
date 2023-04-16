
if (typeof SimpleGIS.Control.Config == 'undefined') {
  SimpleGIS.Control.Config = {};
}

/*
 * Manage liste of element
 */ 
SimpleGIS.Control.Config.ListConfig = class ListConfig
{
	constructor()
	{

	}

	/*
  	 * Create a new block
  	 * @param {string} - reference
  	 * @param {string} - name
  	 * @param {string} - display - Value of the content display style prop
  	 * @param {string} - content - Sub content of the article
  	 */
	createBlock(reference, name, display, content)
	{
		return `<article class="message is-info" id="config-list-article|${reference}">
	  					<div class="message-header config-list-title" id="config-list-title|${reference}" style="cursor:pointer">
							  <p>
							  	<i class="fa-regular fa-square-caret-down" id="config-list-title-icon|${reference}"></i>
							  	<b id="config-list-title-text|${reference}">${name}</b>
							  </p>	
							  <button class="delete config-list-delete" id="config-list-delete|${reference}"></button>
						 </div>

						 <div class="message-body config-list-content" id="config-list-content|${reference}" style="flex-direction: column;display:${display}">
						 	${content}
					 </div>
					</article>`;
	}

	/*
	 * Init or re-init the events 
   * @param {function} - addFunction - Add function
	 */
	initEvents(addFunction)
	{
		let me = this;
		// Click en title event
		var titleDivs = document.getElementsByClassName("config-list-title");
		Array.from(titleDivs).forEach(function(element) {
    	me.titleClickEvent(element);
    });

    // Change title on name change
    let configListNames = document.getElementsByClassName("config-list-name");
		Array.from(configListNames).forEach(function(element) {
    	me.changeNameEvent(element);
    });
    
    // Manage delete
    let configListDelete = document.getElementsByClassName("config-list-delete");
		Array.from(configListDelete).forEach(function(element) {
    	me.deleteEvent(element);
    });

    // Manage button add block
    document.getElementById(`config-list-add`).addEventListener('click', event => {
    	let ref = "new" + Math.floor(Math.random() * 100000);

    	document.getElementById(`config-list-all-content`).insertAdjacentHTML("beforeEnd", this.addBlock(ref, "", {}, "flex"));

    	me.titleClickEvent(document.getElementById(`config-list-title|${ref}`));
    	me.deleteEvent(document.getElementById(`config-list-delete|${ref}`));

    	let elementName = null;
    	let listNamesElements = document.getElementsByClassName("config-list-name");
    	for(let i = 0; i < listNamesElements.length; i++) {
    		if(listNamesElements[i].id.includes(`|${ref}`)) {
    			elementName = listNamesElements[i];
    		}
    	}
    	me.changeNameEvent(elementName);

    	if(addFunction) {
    		addFunction(ref, this);
    	}
    });
	}

	/*
	 * Manage click on title element
   * @param {HTMLElement} - element - Title element
	 */
	titleClickEvent(element) {
		element.addEventListener('click', event => {
			event.preventDefault();
			let groupRef = event.target.id.split("|")[1];

				if(document.getElementById(`config-list-content|${groupRef}`)) 
				{
					if(document.getElementById(`config-list-content|${groupRef}`).style["display"] == "none") {
						document.getElementById(`config-list-content|${groupRef}`).style["display"] = "flex";
						document.getElementById(`config-list-title-icon|${groupRef}`).className = "fa-regular fa-square-caret-up";
					}
					else {
						document.getElementById(`config-list-content|${groupRef}`).style["display"] = "none";
						document.getElementById(`config-list-title-icon|${groupRef}`).className = "fa-regular fa-square-caret-down";
					}
				}
			});
  	}

  	/*
  	 * Manage click on delete element
     * @param {HTMLElement} - element - Delete element
  	 */
  	deleteEvent(element) 
  	{
  		element.addEventListener('click', event => {
      	event.preventDefault();

				let groupRef = event.target.id.split("|")[1];

				document.getElementById(`config-list-all-content`).removeChild(document.getElementById(`config-list-article|${groupRef}`));
			});
  	}

  	/*
  	 * Manage change name
     * @param {HTMLElement} - element - Name input element
  	 */
  	changeNameEvent(element)
  	{
		element.addEventListener('blur', event => {
			let groupRef = event.target.id.split("|")[1];
			document.getElementById(`config-list-title-text|${groupRef}`).innerHTML = event.target.value;
		});
  	}
}