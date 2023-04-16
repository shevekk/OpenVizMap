
SimpleGIS.Control.Config.Groupes = class Groupes extends SimpleGIS.Control.Config.ListConfig
{
	/**
	 * @param {Object} - configurationContentDiv - HTML element
	 * @param {Object} - fileContentConfigObj - Object of content
	 */
	constructor(configurationContentDiv, fileContentConfigObj) 
  	{
  		super();

  		this.fileContentConfigObj = fileContentConfigObj;

  		// Create HTML
  		let htmlContent = ``;
  		fileContentConfigObj.sourcesGroups.forEach(groupe => {
  			htmlContent += this.addBlock(groupe.reference, groupe.name, groupe, "none");
  		});
  		let html = `<div class="page-form config-page-content"><div id='config-list-all-content'>${htmlContent}</div><button class="button is-success" style="margin-top:16px" id="config-list-add">Ajouter un groupe</button></div>`;

		configurationContentDiv.innerHTML = html;

		this.initEvents();
  	}

  	/*
  	 * Add a new block
  	 * @param {string} - reference
  	 * @param {string} - name
  	 * @param {string} - display - Value of the content display style prop
  	 */
  	addBlock(reference, name, object, display) 
  	{
  		let content = `<div class="field is-horizontal" title="Référence du groupe">
							<div class="field-label is-normal">
								<label class="label">Référence </label>
							</div>
							<div class="field-body">
							    <div class="field">
							      <p class="control">
									<input class="input group-reference" id="group-reference-input|${reference}" type="text" placeholder="Référence du groupe" value="${reference}">
								</p>
						    </div>
						  </div>
						</div>

						<div class="field is-horizontal" title="Nom du groupe">
							<div class="field-label is-normal">
								<label class="label">Nom </label>
							</div>
							<div class="field-body">
							    <div class="field">
							      <p class="control">
									<input class="input config-list-name" type="text" id="group-name-input|${reference}"  id="conf-default-marker-value" placeholder="Nom du groupe" value="${name}">
								</p>
						    </div>
						  </div>
						</div>`;

		return this.createBlock(reference, name, display, content) 
  	}

  	/**
	 * Get the config object
	 */
	getContentConfigObj() 
	{
		let valid = true;
		let caractRefValid = true;

		let sourcesGroupsObj = [];

		var groupsTitles = document.getElementsByClassName("config-list-title");
		Array.from(groupsTitles).forEach(function(element) {
			let groupRef = element.id.split("|")[1];

			let reference = document.getElementById(`group-reference-input|${groupRef}`).value;
			let name = document.getElementById(`group-name-input|${groupRef}`).value;

			if(!reference.includes("|"))
			{
				if(reference && name)
				{
					sourcesGroupsObj.push({name : name, reference : reference})
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

		for(let i = 0; i < sourcesGroupsObj.length; i++)
		{
			if(sourcesGroupsObj.filter(sg => sg.reference == sourcesGroupsObj[i].reference).length > 1 && valid)
			{
				alert(`La réference '${sourcesGroupsObj[i].reference}' est liée à 2 groupes`);
				valid = false;
			}
		}

		if(!caractRefValid) {
			alert("Les champs références ne doivent pas contenir de caractère '|'");
		}

		if(valid) {
			this.fileContentConfigObj.sourcesGroups = sourcesGroupsObj;
  			return this.fileContentConfigObj;
  		}
  		else {
  			return null;
  		}
	}
}