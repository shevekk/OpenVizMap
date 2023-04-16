// sourceOSM.js

SimpleGIS.Control.Config.SourcesOSM = class SourcesOSM extends SimpleGIS.Control.Config.SourcesBase
{
  /**
   * @param {Object} - configurationContentDiv - HTML element
   * @param {Object} - fileContentConfigObj - Object of content
   * @param {string[]} - arraySVG - List of all svg url
   */
  constructor(configurationContentDiv, fileContentConfigObj, arraySVG) 
  {
    super(configurationContentDiv, fileContentConfigObj, arraySVG, "sourcesOSM");

    let me = this;

    // Manage button add filter line
		let configAddSourceOSM = document.getElementsByClassName("config-source-filters-add");
		Array.from(configAddSourceOSM).forEach(function(element) {
      me.manageAddFilter(element);
    });

		// Manage button delete filter line
    let configListFilterDelete = document.getElementsByClassName("config-source-filter-delete");
		Array.from(configListFilterDelete).forEach(function(element) {
			me.deleteFilter(element);
		});
  }

  /**
   * Manage event of add filter
   * @param {string} - element - The HTML element of add button
   */
  manageAddFilter(element)
  {
  	element.addEventListener('click', event => {
    	event.preventDefault();

    	let reference = event.target.id.split("|")[1];
    	let number = 20 + Math.floor(Math.random() * 100000);

    	let div = document.createElement('DIV');
    	div.innerHTML += this.addSourceLine(reference, "", number);
    	document.getElementById(`config-source-filters|${reference}`).appendChild(div.firstChild);

    	// Manage delete the new
    	this.deleteFilter(document.getElementById(`config-source-filter-delete|${reference}|${number}`));
    });
  }

  /**
	 * Delete a filter line
	 * @param {string} - element - The HTML element of delete button
	 */
  deleteFilter(element) {
  	let reference = element.id.split("|")[1];
		let number = element.id.split("|")[2];

		element.addEventListener('click', event => {
  		document.getElementById(`config-source-filters|${reference}`).removeChild(document.getElementById(`conf-source-filter-div|${reference}|${number}`));
  	});
  }

  /**
	 * Function call if add 
   * @param {string} - reference - 
   * @param {string} - scope - 
	 */
	manageEventsOnAdd(reference, scope)
	{
		scope.manageAddFilter(document.getElementById(`config-source-filters-add|${reference}`));
		scope.initStyle(reference, "point", {});
	}

	/**
   * Add a spetial part of the block
   * @param {string} - reference
   * @param {string} - name
   * @param {object} - object - The object content
   */
  addSpeBlock(reference, name, object)
  {
  	let contentFilters = ``;
		for(let i = 0; object.content && i < object.content.length; i++) {
			contentFilters += this.addSourceLine(reference, object.content[i], i);
		}

    return `<div class="field is-horizontal" title="Code de la ville sur OpenStreetMap">
	            <div class="field-label is-normal">
	              <label class="label">Code de la ville</label>
	            </div>
	            <div class="field-body">
	              <div class="field">
	                <p class="control">
	                	<input class="input" type="text" id="config-source-city|${reference}" placeholder="Code de la ville sur OpenStreetMap" value="${object.city ? object.city : ""}">
	              	</p>
	              </div>
	            </div>
	          </div>

	          <div class="field is-horizontal" title="Liste des filtres pour le chargement des données">
							<div class="field-label is-normal" style="flex:1">
								<label class="label">Filtres</label>
							</div>
							<div class="field-body" style="flex-direction: column;">
								<div class="field" id="config-source-filters|${reference}">
							    	${contentFilters}
							  </div>
							  <button class="button is-success config-source-filters-add" style="margin-top:4px" id="config-source-filters-add|${reference}">Ajouter un filtre</button>
						  </div>
						</div>`;
  }

  /**
	 * Create a select HTML content line for source
	 * @param {string} - reference
	 * @param {string} - content - The text content
	 * @param {number} - i - number of the element
	 */
	addSourceLine(reference, content, i)
	{
		return `<div class="field" id="conf-source-filter-div|${reference}|${i}" title="">
							<p class="control config-source-filter-line">
								<input type="text" class="input conf-source-filter|${reference}" id="conf-source-filter|${reference}|${i}" value="${content}" />
								<button class="delete config-source-filter-delete" id="config-source-filter-delete|${reference}|${i}" style="margin-left:5px;"></button>
							</p>
						</div>`;
	}

  /**
   * Get the config object
   * @return {object} - The fileContentConfigObj
   */
  getContentConfigObj()
  {
  	let me = this;

    let newFileContentConfigObj = this.getContentConfigObjBase();

    if(newFileContentConfigObj) {
      let groupsTitles = document.getElementsByClassName("config-list-title");
      Array.from(groupsTitles).forEach(function(element) {
        let baseRef = element.id.split("|")[1];

        let city = document.getElementById(`config-source-city|${baseRef}`).value;

        let filters = [];
  			let configFilters = document.getElementsByClassName(`conf-source-filter|${baseRef}`);
  			Array.from(configFilters).forEach(function(element) {
  				filters.push(element.value.replaceAll(`"`, `'`));
  		  });

        let source = me.fileContentConfigObj.sourcesOSM.find(s => s.reference == document.getElementById(`config-source-reference|${baseRef}`).value);
        source.city = city;
        source.content = filters;
      });
    }

    return newFileContentConfigObj;
  }
}