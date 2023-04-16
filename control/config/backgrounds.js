/**
 * 
 */
SimpleGIS.Control.Config.Backgrounds = class Backgrounds extends SimpleGIS.Control.Config.ListConfig
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
		fileContentConfigObj.backgrounds.forEach(groupe => {
			htmlContent += this.addBlock(groupe.reference, groupe.name, groupe, "none");
		});
		let html = `<div class="page-form config-page-content"><div id='config-list-all-content'>${htmlContent}</div><button class="button is-success" style="margin-top:16px" id="config-list-add" title="Ajouter un fond de plan">Ajouter</button></div>`;

		configurationContentDiv.innerHTML = html;

		this.initEvents();
	}

 	/*
	 * Add a new block
	 * @param {string} - reference
	 * @param {string} - name
	 * @param {string} - object - Background object of data
	 * @param {string} - display - Value of the content display style prop
	 */
	addBlock(reference, name, object, display) 
	{
		let contentNoWrap = `<label class="radio"><input type="radio" name="editModeEnable|${reference}" id="conf-background-noWrap-yes|${reference}"> Oui</label>
			<label class="radio"><input type="radio" name="editModeEnable|${reference}" id="conf-background-noWrap-no|${reference}" checked> Non</label>`
		if(object.params && object.params.noWrap) {
			contentNoWrap = `<label class="radio"><input type="radio" name="editModeEnable|${reference}" id="conf-background-noWrap-yes|${reference}" checked> Oui</label>
			<label class="radio"><input type="radio" name="editModeEnable|${reference}" id="conf-background-noWrap-no|${reference}"> Non</label>`
		}

		let content = `<div class="field is-horizontal" title="Référence du fond de carte (identifiant qui doit être unique)">
						<div class="field-label is-normal">
							<label class="label">Référence </label>
						</div>
						<div class="field-body">
						    <div class="field">
						      <p class="control">
								<input class="input group-reference" id="config-background-reference|${reference}" type="text" placeholder="Classe CSS de l'icône du marqueur" value="${reference}">
							</p>
					    </div>
					  </div>
					</div>

					<div class="field is-horizontal" title="Nom du fond de carte">
						<div class="field-label is-normal">
							<label class="label">Nom </label>
						</div>
						<div class="field-body">
						    <div class="field">
						      <p class="control">
								<input class="input config-list-name" type="text" id="config-background-name|${reference}"  id="conf-default-marker-value" placeholder="Classe CSS de l'icône du marqueur" value="${name}">
							</p>
					    </div>
					  </div>
					</div>

					<div class="field is-horizontal" title="Type de fond de carte">
						<div class="field-label is-normal">
							<label class="label">Type </label>
						</div>
						<div class="field-body">
						    <div class="field">
						      <p class="control">
								<select class="select" id="config-background-type|${reference}">
									<option value="tile">tile</option>
								</select>
							</p>
					    </div>
					  </div>
					</div>

					<div class="field is-horizontal" title="L'url du fond de carte">
						<div class="field-label is-normal">
							<label class="label">URL </label>
						</div>
						<div class="field-body">
						    <div class="field">
						      <p class="control">
								<input class="input config-list-name" type="text" id="config-background-url|${reference}" id="conf-default-marker-value" placeholder="Classe CSS de l'icône du marqueur" value="${object.url ? object.url : ""}">
							 </p>
					    </div>
					  </div>
					</div>


					<div class="field is-horizontal" title="Fond de carte non dupliqué">
  					  <div class="field-label" style="flex:2"><label class="label">No Wrap</label></div>
  					  <div class="field-body">
  					  	<div class="field is-narrow">
  					  		<p class="control">
							  ${contentNoWrap}
							</p>
						 </div>
					  </div> 
					</div>

					<div class="field is-horizontal" title="Texte d'attribution du fond de plan">
						<div class="field-label is-normal">
							<label class="label">Attribution </label>
						</div>
						<div class="field-body">
						    <div class="field">
						      <p class="control">
								<input class="input config-list-name" type="text" id="config-background-attribution|${reference}"  id="conf-default-marker-value" placeholder="Texte d'attribution du fond de plan" value="${object.params ? object.params.attribution : ""}">
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

		let backgrounds = [];

		var groupsTitles = document.getElementsByClassName("config-list-title");
		Array.from(groupsTitles).forEach(function(element) {
			let baseRef = element.id.split("|")[1];

			let reference = document.getElementById(`config-background-reference|${baseRef}`).value;
			let name = document.getElementById(`config-background-name|${baseRef}`).value;

			let type = document.getElementById(`config-background-type|${baseRef}`).value;
			let url = document.getElementById(`config-background-url|${baseRef}`).value;

			let attribution = document.getElementById(`config-background-attribution|${baseRef}`).value;

			let noWrap = false;
			if(document.getElementById(`conf-background-noWrap-yes|${reference}`).checked) {
	  			noWrap = true;
	  		}

			if(!reference.includes("|"))
			{
				if(reference && name)
				{
					let params = {noWrap : noWrap, attribution : attribution};
					backgrounds.push({name : name, reference : reference, type : type, url : url, params : params})
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

		for(let i = 0; i < backgrounds.length; i++)
		{
			if(backgrounds.filter(sg => sg.reference == backgrounds[i].reference).length > 1 && valid)
			{
				alert(`La réference '${backgrounds[i].reference}' est liée à 2 bouton viz`);
				valid = false;
			}
		}

		if(!caractRefValid)
		{
			alert("Les champs références ne doivent pas contenir de caractère '|'");
		}

		if(valid) {
			this.fileContentConfigObj.backgrounds = backgrounds;
			return this.fileContentConfigObj;
		}
		else {
			return null;
		}
	}
}