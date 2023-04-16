
/**
 * Config boutonViz 
 */
SimpleGIS.Control.Config.BoutonsViz = class BoutonsViz extends SimpleGIS.Control.Config.ListConfig
{
	/**
	 * @param {Object} - configurationContentDiv - HTML element
	 * @param {Object} - fileContentConfigObj - Object of content
	 * @param {string[]} - arraySVG - Array of SVG images urls
	 */
	constructor(configurationContentDiv, fileContentConfigObj, arraySVG) 
  {
		super();
		this.arraySVG = arraySVG;
		this.fileContentConfigObj = fileContentConfigObj;

		// Create HTML
		let htmlContent = ``;
		fileContentConfigObj.buttonViz.forEach(boutonViz => {
			htmlContent += this.addBlock(boutonViz.reference, boutonViz.name, boutonViz, "none");
		});
		let html = `<div class="page-form config-page-content"><div id='config-list-all-content'>${htmlContent}</div><button class="button is-success" style="margin-top:16px" id="config-list-add" title="Ajouter un nouveau bouton de visualisation">Ajouter</button></div>`;

		configurationContentDiv.innerHTML = html;

		let me = this;

		me.initEvents(me.manageEventsOnAdd);

		me.reInitDeleteSourcesEvents();
		me.reInitDeleteSourcesOSMEvents();

		me.setArraySVG(fileContentConfigObj.buttonViz);
		fileContentConfigObj.buttonViz.forEach(boutonViz => {
    	let reference = boutonViz.reference;

    	this.updateIconDisplay(boutonViz.icon.type, boutonViz.icon.value, boutonViz.icon.value, reference);
		});

		me.reInitEventsSourcesAndIcons();
	}

	/*
	 * Function call if add 
   * @param {string} - reference - 
   * @param {string} - scope - 
	 */
	manageEventsOnAdd(reference, scope)
	{
		scope.reInitEventsSourcesAndIcons();
	}

	/*
	 * Reinit events - sources and sources OSM list + icons events
	 */
	reInitEventsSourcesAndIcons()
	{
  	let me = this;

  	// Manage button add source select
		let configAddSource = document.getElementsByClassName("config-buttonViz-add-source");
		Array.from(configAddSource).forEach(function(element) {
      	element.addEventListener('click', event => {
	    	event.preventDefault();

	    	let reference = event.target.id.split("|")[1];
	    	let number = 20 + Math.floor(Math.random() * 100000);

	    	let content = me.addSourceSelect(reference, "", number);
	    	let div = document.createElement('DIV');
	      div.innerHTML += content;
	      document.getElementById(`config-buttonViz-sources-content|${reference}`).appendChild(div.firstChild);

	    	// Manage delete the new
	    	me.reInitDeleteSourcesEvents();
	    });
    });

	    // Manage button add sourceOSM select
		let configAddSourceOSM = document.getElementsByClassName("config-buttonViz-add-sourceOSM");
		Array.from(configAddSourceOSM).forEach(function(element) {
	      	element.addEventListener('click', event => {
		    	event.preventDefault();

		    	let reference = event.target.id.split("|")[1];
		    	let number = 20 + Math.floor(Math.random() * 100000);

		    	let content = me.addSourceOSMSelect(reference, "", number);
		    	let div = document.createElement('DIV');
		      div.innerHTML += content;
	      	document.getElementById(`config-buttonViz-sourcesOSM-content|${reference}`).appendChild(div.firstChild);

		    	// Manage delete the new
		    	me.reInitDeleteSourcesOSMEvents();
		  });
	  });

    let htmlSelectSvg = ``;
		for(let i = 0; i < this.arraySVG.length; i++) {
			htmlSelectSvg += `<option value="${this.arraySVG[i]}">${this.arraySVG[i]}</option>`;
		}

    let configIconImg = document.getElementsByClassName("config-display-icon-img");
		Array.from(configIconImg).forEach(function(element) {
			let reference = element.id.split("|")[1];

			me.updateIconDisplay(document.getElementById("config-buttonViz-style-type|"+reference).value, document.getElementById("config-buttonViz-style-value|"+reference).value, document.getElementById("config-buttonViz-style-value-list|"+reference).value, reference);
			me.manageEventsIcons(reference);

			if(!document.getElementById("config-buttonViz-style-value-list|"+reference).innerHTML) {
				document.getElementById("config-buttonViz-style-value-list|"+reference).innerHTML = htmlSelectSvg;
			}
		});
	}

	/*
	 * Manage all events for update icon
   * @param {string} - reference - 
	 */
	manageEventsIcons(reference)
	{
		document.getElementById("config-buttonViz-style-type|"+reference).addEventListener('change', event => {
			this.updateIconDisplay(event.target.value, document.getElementById("config-buttonViz-style-value|"+reference).value, document.getElementById("config-buttonViz-style-value-list|"+reference).value, reference);
		});
		document.getElementById("config-buttonViz-style-value|"+reference).addEventListener('change', event => {
			this.updateIconDisplay(document.getElementById("config-buttonViz-style-type|"+reference).value, event.target.value, "", reference);
		});
		document.getElementById("config-buttonViz-style-value-list|"+reference).addEventListener('change', event => {
			this.updateIconDisplay(document.getElementById("config-buttonViz-style-type|"+reference).value, "", event.target.value, reference);
		});
	}

	/*
	 * Set the array of SVG images urls to the select
	 * @param {SimpleGIS.Data.ButtonViz[]} - boutonsViz - array of all button for update images list
	 */
	setArraySVG(boutonsViz) 
	{
		let htmlSelectSvg = ``;
		for(let i = 0; i < this.arraySVG.length; i++) {
			htmlSelectSvg += `<option value="${this.arraySVG[i]}">${this.arraySVG[i]}</option>`;
		}

		boutonsViz.forEach(boutonViz => {
			document.getElementById("config-buttonViz-style-value-list|"+boutonViz.reference).innerHTML = htmlSelectSvg;

			if(boutonViz.icon.type == "svg") {
				document.getElementById("config-buttonViz-style-value-list|"+boutonViz.reference).value = boutonViz.icon.value;
			}
		});
	}

	/*
	 * ReInit all event of delete sources
	 */
	reInitDeleteSourcesEvents()
	{
		let me = this;
		// Manage delete sources
    let configListDelete = document.getElementsByClassName("config-boutonViz-source-delete");
		Array.from(configListDelete).forEach(function(element) {
    	element.addEventListener('click', event => {
	      		event.preventDefault();

				me.deleteSource(event, false);
			});
  	});
	}

	/*
	 * ReInit all event of delete sources OSM
	 */
	reInitDeleteSourcesOSMEvents()
	{
		let me = this;
		// Manage delete sources
    let configListDelete = document.getElementsByClassName("config-boutonViz-sourcesOSM-delete");
		Array.from(configListDelete).forEach(function(element) {
      element.addEventListener('click', event => {
      	event.preventDefault();

				me.deleteSource(event, true);
			});
    });
	}

	/*
	 * Delete a source select
	 * @param {object} - event
	 * @param {bool} - isOSMSource
	 */
	deleteSource(event, isOSMSource)
	{
		let reference = event.target.id.split("|")[1];
		let number = event.target.id.split("|")[2];

		if(isOSMSource) {
			document.getElementById(`config-buttonViz-sourcesOSM-content|${reference}`).removeChild(document.getElementById(`config-boutonViz-sourceOSM|${reference}|${number}`));
		}
		else {
			document.getElementById(`config-buttonViz-sources-content|${reference}`).removeChild(document.getElementById(`config-boutonViz-source|${reference}|${number}`));
		}
	}

	/*
	 * Create a select HTML content for source
	 * @param {string} - reference
	 * @param {string} - selectedSourceRef
	 * @param {number} - i - number of the element
	 */
	addSourceSelect(reference, selectedSourceRef, i)
	{
  	let htmlSourcesReference = ``;
		this.fileContentConfigObj.sources.forEach(source => htmlSourcesReference += selectedSourceRef == source.reference ? `<option value="${source.reference}" selected>${source.name}</option>` : `<option value="${source.reference}">${source.name}</option>`);

		return `<div class="field" id="config-boutonViz-source|${reference}|${i}">
			      <p class="control" style="flex-direction:row; display: flex;justify-content: center;align-items: center;">
					<select class="select conf-boutonViz-sources|${reference}" id="conf-boutonViz-sources|${reference}|${i}" >${htmlSourcesReference}</select>
					<button class="delete config-boutonViz-source-delete" id="config-boutonViz-source-delete|${reference}|${i}" style="margin-left:5px;"></button>
				  </p>
		    	</div>`;
  }

	/*
	 * Create a select HTML content for source OpenStreetMap
	 * @param {string} - reference
	 * @param {string} - selectedSourceRef
	 * @param {number} - i - number of the element
	 */
	addSourceOSMSelect(reference, selectedSourceRef, i)
	{
		let htmlSourcesReference = ``;
		this.fileContentConfigObj.sourcesOSM.forEach(source => htmlSourcesReference += selectedSourceRef == source.reference ? `<option value="${source.reference}" selected>${source.name}</option>` : `<option value="${source.reference}">${source.name}</option>`);

		return `<div class="field" id="config-boutonViz-sourceOSM|${reference}|${i}">
				      <p class="control" style="flex-direction:row; display: flex;justify-content: center;align-items: center;">
						<select class="select conf-boutonViz-sourcesOSM|${reference}" id="conf-boutonViz-sourceOSM|${reference}|${i}" >${htmlSourcesReference}</select>
						<button class="delete config-boutonViz-sourcesOSM-delete" id="config-boutonViz-sourceOSM-delete|${reference}|${i}" style="margin-left:5px;"></button>
					  </p>
		    	</div>`;
	}

	/*
	 * Add a new block - create content of the article
	 * @param {string} - reference
	 * @param {string} - name
	 * @param {object} - object - Content of the object
	 * @param {string} - display - Value of the content display style prop
	 */
	addBlock(reference, name, object, display) 
	{
  		let contentSources = ``;
  		for(let i = 0; object.sources && i < object.sources.length; i++) {
			contentSources += this.addSourceSelect(reference, object.sources[i], i);
  		}

  		let contentSourcesOSM = ``;
  		for(let i = 0; object.sourcesOSM && i < object.sourcesOSM.length; i++) {
  			contentSourcesOSM += this.addSourceOSMSelect(reference, object.sourcesOSM[i], i);
  		}

  		// Set type option
  		let typeIconOptions = `<option value="font" selected>Font</option><option value="svg">SVG</option>`;
  		if(object.icon && object.icon.type == "svg") {
  			typeIconOptions = `<option value="font">Font</option><option value="svg" selected>SVG</option>`;
  		}

  		let content = `<div class="field is-horizontal" title="Référence du bouton de visualisation">
							<div class="field-label is-normal">
								<label class="label">Référence </label>
							</div>
							<div class="field-body">
							    <div class="field">
							      <p class="control">
									<input class="input group-reference" id="config-buttonViz-reference|${reference}" type="text" placeholder="Référence du bouton de visualisation" value="${reference}">
								</p>
						    </div>
						  </div>
						</div>

						<div class="field is-horizontal" title="Nom du bouton de visualisation">
							<div class="field-label is-normal">
								<label class="label">Nom </label>
							</div>
							<div class="field-body">
							    <div class="field">
							      <p class="control">
									<input class="input config-list-name" type="text" id="config-buttonViz-name|${reference}"  id="conf-default-marker-value" placeholder="Nom du bouton de visualisation" value="${name}">
								</p>
						    </div>
						  </div>
						</div>

						<div class="field is-horizontal" title="Description de la visualisation">
							<div class="field-label is-normal">
								<label class="label">Description </label>
							</div>
							<div class="field-body">
							    <div class="field">
							      <p class="control">
									<textarea class="textarea" id="config-buttonViz-description|${reference}" placeholder="Description de la visualisation">${object.description ? object.description : ""}</textarea>
								</p>
						    </div>
						  </div>
						</div>

						<form class="form" style="margin-bottom: 10px;">
							<fieldset class="fieldset"><legend>Style du bouton</legend>
								<div class="field is-horizontal" title="Type d'icône du bouton">
									<div class="field-label is-normal">
										<label class="label">Type </label>
									</div>
									<div class="field-body">
									    <div class="field">
									      <p class="control">
											<select class="select" id="config-buttonViz-style-type|${reference}">
												${typeIconOptions}
											</select>
										</p>
								    </div>
								    <div class="field">
								      <p class="control">
										<i class="" id="config-display-icon|${reference}"></i>
										<img id="config-display-icon-img|${reference}" class="config-display-icon-img" src="">
									  </p>
							       </div>
								  </div>
								</div>

								<div class="field is-horizontal" title="Classe CSS de l'icône ou url de l'image si SVG">
									<div class="field-label is-normal">
										<label class="label">Valeur </label>
									</div>

									<div class="field-body" id="config-buttonViz-style-value-div|${reference}" >
									    <div class="field">
									      <p class="control">
											<input class="input" type="text" id="config-buttonViz-style-value|${reference}" placeholder="Classe CSS de l'icône du bouton" value="${object && object.icon && object.icon.value ? object.icon.value : ""}">
											<a href="https://fontawesome.com/search?o=r&m=free&s=solid" target="_blank" title="Lien vers les sites d'icônes inclus dans le projet">FontAwesome</a> |
											<a href="https://remixicon.com/" target="_blank" title="Lien vers les sites d'icônes inclus dans le projet">Remix Icon</a> |
											<a href="https://atlasicons.vectopus.com/" target="_blank" title="Lien vers les sites d'icônes inclus dans le projet">Atlas Icons</a>
										</p>
									  </div>
								    </div>
								    <div class="field-body" id="config-buttonViz-style-value-list-div|${reference}" >
									    <div class="field">
									      <p class="control">
									      <select class="select" id="config-buttonViz-style-value-list|${reference}"></select>
										</p>
								    </div>
								</div>
							</fieldset>
						</form>

						<div class="field is-horizontal" title="Liste des sources chargés au clic sur le bouton">
							<div class="field-label is-normal" style="flex:1">
								<label class="label">Sources</label>
							</div>
							<div class="field-body" style="flex-direction: column;" id="config-buttonViz-sources|${reference}">
								<div id="config-buttonViz-sources-content|${reference}">
							    	${contentSources}
							    </div>
							    <button class="button is-success config-buttonViz-add-source" style="margin-top:4px" id="config-buttonViz-add-source|${reference}">Ajouter une source</button>
						  	</div>
						</div>

						<div class="field is-horizontal" title="Liste des sources OpenStreetMap chargés au clic sur le bouton">
							<div class="field-label is-normal" style="flex:1">
								<label class="label">Sources OSM</label>
							</div>
							<div class="field-body" style="flex-direction: column;">
								<div id="config-buttonViz-sourcesOSM-content|${reference}">
							    	${contentSourcesOSM}
							    </div>
							    <button class="button is-success config-buttonViz-add-sourceOSM" style="margin-top:4px" id="config-buttonViz-add-sourceOSM|${reference}">Ajouter une source OpenStreetMap</button>
						  	</div>
						</div>
						`;

		return this.createBlock(reference, name, display, content);
  }

	/**
	 * Update the display icon design
	 * @param {string} - type - 'font' or 'svg'
	 * @param {string} - value - CSS value
	 * @param {string} - valueSrc - src image link
	 */
	updateIconDisplay(type, value, valueSrc, reference) 
	{
  	if(type == "font") {
  		document.getElementById("config-buttonViz-style-value-list-div|" + reference).style["display"] = "none";
			document.getElementById("config-buttonViz-style-value-div|"+reference).style["display"] = "inline-block";

  		document.getElementById("config-display-icon|"+reference).style["display"] = "inline-block";
			document.getElementById("config-display-icon-img|"+reference).style["display"] = "none";

			document.getElementById("config-display-icon|"+reference).className = `${value} config-display-icon`;
		}
		else {
			document.getElementById("config-buttonViz-style-value-list-div|"+reference).style["display"] = "inline-block";
			document.getElementById("config-buttonViz-style-value-div|"+reference).style["display"] = "none";

			document.getElementById("config-display-icon|"+reference).style["display"] = "none";
			document.getElementById("config-display-icon-img|"+reference).style["display"] = "inline-block";

			document.getElementById("config-display-icon-img|"+reference).src = window.location.href.split("?")[0] + "/" + valueSrc;
		}
	}

  /**
	 * Get the config object
	 */
	getContentConfigObj() 
	{
		let valid = true;
		let caractRefValid = true;

		let sourcesBoutonVizObj = [];

		var groupsTitles = document.getElementsByClassName("config-list-title");
		Array.from(groupsTitles).forEach(function(element) {
			let baseRef = element.id.split("|")[1];

			let reference = document.getElementById(`config-buttonViz-reference|${baseRef}`).value;
			let name = document.getElementById(`config-buttonViz-name|${baseRef}`).value;
			let description = document.getElementById(`config-buttonViz-description|${baseRef}`).value;

			let iconType = document.getElementById(`config-buttonViz-style-type|${baseRef}`).value;
			let iconValue = document.getElementById(`config-buttonViz-style-value|${baseRef}`).value;

	  		if(iconType == "svg") {
	  			iconValue = document.getElementById(`config-buttonViz-style-value-list|${baseRef}`).value;
	  		}

			let sourcesRefs = [];
			let configBoutonVizSources = document.getElementsByClassName(`conf-boutonViz-sources|${baseRef}`);
			Array.from(configBoutonVizSources).forEach(function(element) {
				sourcesRefs.push(element.value);
		    });

		    let sourcesOSMRefs = [];
			let configBoutonVizSourcesOSM = document.getElementsByClassName(`conf-boutonViz-sourcesOSM|${baseRef}`);
			Array.from(configBoutonVizSourcesOSM).forEach(function(element) {
				sourcesOSMRefs.push(element.value);
		    });

			if(!reference.includes("|"))
			{
				if(reference && name)
				{
					let icon = {type : iconType, value : iconValue};
					sourcesBoutonVizObj.push({name : name, reference : reference, description : description, icon : icon, sources : sourcesRefs, sourcesOSM : sourcesOSMRefs})
				}
				else 
				{
					valid = false;
				}
			}
			else 
			{
				valid = false;
				caractRefValid = false;
			}
		});

		for(let i = 0; i < sourcesBoutonVizObj.length; i++)
		{
			if(sourcesBoutonVizObj.filter(sg => sg.reference == sourcesBoutonVizObj[i].reference).length > 1 && valid)
			{
				alert(`La réference '${sourcesBoutonVizObj[i].reference}' est liée à 2 bouton viz`);
				valid = false;
			}
		}

		if(!caractRefValid)
		{
			alert("Les champs références ne doivent pas contenir de caractère '|'");
		}

		if(valid) {
			this.fileContentConfigObj.buttonViz = sourcesBoutonVizObj;
			return this.fileContentConfigObj;
		}
		else {
			return null;
		}
	}
}