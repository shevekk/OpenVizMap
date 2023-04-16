
/**
 * Config management of the Params
 */

SimpleGIS.Control.Config.Params = class Params
{
	/**
	 * @param {Object} - configurationContentDiv - HTML element
	 * @param {Object} - fileContentConfigObj - Object of content
	 */
	constructor(configurationContentDiv, fileContentConfigObj, mapManager) 
  	{
  		this.fileContentConfigObj = fileContentConfigObj;
 
  		let htmlEditModeEnabled = `<div class="field is-horizontal" title="La mode édition est-il activé par défaut ? (si oui pas de possibilité d'éditer la visualisation)">
  					  <div class="field-label" style="flex:2"><label class="label">Activer le mode édition </label></div>
  					  <div class="field-body">
  					  	<div class="field is-narrow">
  					  		<p class="control">
							  <label class="radio"><input type="radio" name="editModeEnable" id="conf-editModeEnable-yes"> Oui</label>
							  <label class="radio"><input type="radio" name="editModeEnable" id="conf-editModeEnable-no"> Non</label>
							</p>
						 </div>
					  </div> 
					</div>`;

		let htmlEditZoomDefault = `<div class="field is-horizontal" title="Zoom au chargement de la carte">
								<div class="field-label is-normal">
									<label class="label">Zoom </label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<input class="input" type="number" id="conf-default-zoom" placeholder="Zoom au chargement de la carte" value="${fileContentConfigObj.params.default.zoom}">
									</p>
							    </div>
							  </div>
							  <div class="field-body">
								    <div class="field">
								      <p class="control">
										<button class="button is-dark" id="conf-default-zoom-button" title="Récupérer zoom actuel">Récupérer zoom actuel</button>
									</p>
							    </div>
							  </div>
							</div>`; 

		let htmlPositionDefault = `<div class="field is-horizontal" title="Position au chargement de la carte">
								<div class="field-label is-normal" style="flex:1">
									<label class="label">Position </label>
								</div>
								<div class="field-body" style="flex:2">
								    <div class="field">
								      <p class="control">
										<input class="input" type="number" id="conf-default-position-long" placeholder="Longitude au chargement de la carte" title="Longitude au chargement de la carte" value="${fileContentConfigObj.params.default.position[0]}">
									</p>
								  </div>
							    </div>
							    <div class="field-body" style="flex:2">
								    <div class="field">
								      <p class="control">
										<input class="input" type="number" id="conf-default-position-lat" placeholder="Lattitude au chargement de la carte" title="Lattitude au chargement de la carte" value="${fileContentConfigObj.params.default.position[1]}">
									</p>
							    </div>
							  </div>
							  <div class="field-body" style="flex:1">
								    <div class="field">
								      <p class="control">
										<button class="button is-dark" id="conf-default-position-button" title="Récupérer la position">Récupérer la position</button>
									</p>
							    </div>
							  </div>
							</div>`; 

		let htmlFullScreenDefault = `<div class="field is-horizontal" title="Le bouton de plein écran est-il visible">
  					  <div class="field-label" style="flex:2"><label class="label">Bouton plein écran visible </label></div>
  					  <div class="field-body">
  					  	<div class="field is-narrow">
  					  		<p class="control">
							  <label class="radio"><input type="radio" name="fullscreenControl" id="conf-fullscreenControl-yes"> Oui</label>
							  <label class="radio"><input type="radio" name="fullscreenControl" id="conf-fullscreenControl-no"> Non</label>
							</p>
						</div>
					  </div> 
					</div>`;


		let htmlVizReference = `<div class="field is-horizontal" title="Réference du bouton de visualisation par défaut">
								<div class="field-label is-normal" style="flex:2">
									<label class="label">Réference du bouton de visualisation par défaut</label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<select class="select" id="conf-default-marker-vizReference"></select>
									</p>
							    </div>
							  </div>
							</div>`;

		let htmlForm = `<form class="form"><fieldset class="fieldset"><legend> Paramètres de base </legend>${htmlEditZoomDefault + htmlPositionDefault + htmlFullScreenDefault + htmlVizReference}<div id="conf-default-stylePoint"></div></fieldset></form>`;

		let htmlDescription = this.getDescriptionForm();

		configurationContentDiv.innerHTML = `<div class="page-form config-page-content">${htmlEditModeEnabled + htmlForm + htmlDescription}</div>`;

		this.stylePointDefaut = new SimpleGIS.Control.Config.StylePoint(document.getElementById("conf-default-stylePoint"), fileContentConfigObj.params.default.marker, null, null, null, "Style par défaut des marqueurs"); 

		// Init the vizReference value
		htmlVizReference = ``;
		fileContentConfigObj.buttonViz.forEach(bViz => htmlVizReference += `<option value="${bViz.reference}">${bViz.name}</option>`);
		document.getElementById("conf-default-marker-vizReference").innerHTML = htmlVizReference;
		document.getElementById("conf-default-marker-vizReference").value = fileContentConfigObj.params.default.vizReference;

		// Init values
		if(fileContentConfigObj.params.editModeEnable) {
			document.getElementById("conf-editModeEnable-yes").checked = true;
		}
		else {
			document.getElementById("conf-editModeEnable-no").checked = true;
		}

		if(fileContentConfigObj.params.default.fullscreenControl) {
			document.getElementById("conf-fullscreenControl-yes").checked = true;
		}
		else {
			document.getElementById("conf-fullscreenControl-no").checked = true;
		}

		// 
		document.getElementById("conf-default-zoom-button").addEventListener('click', event => {
			event.preventDefault();
  			document.getElementById("conf-default-zoom").value = mapManager.map.getZoom();
		});
		document.getElementById("conf-default-position-button").addEventListener('click', event => {
			event.preventDefault();
  			document.getElementById("conf-default-position-long").value = mapManager.map.getCenter().lat;
  			document.getElementById("conf-default-position-lat").value = mapManager.map.getCenter().lng;
		});

		// Get all svg in list
		this.arraySVG = [];
		fetch('scripts/list_svg.php', {
			method: 'GET'
		})
		.then((response) => {
			const reader = response.body.getReader();
			reader.read().then(({ done, value }) => {
				let contentJson = "";
				let text = new Uint8Array(value).reduce(function (data, byte) {
				    contentJson += String.fromCharCode(byte);
				}, '');
				this.arraySVG = JSON.parse(contentJson);

				this.stylePointDefaut.setArraySVG(this.arraySVG);
			});
		});
  	}

  	/**
  	 * Creation du formulaire de la description
  	 */
  	getDescriptionForm() 
  	{
  		let htmlTitle = `<div class="field is-horizontal" title="Titre de la description de la carte">
								<div class="field-label is-normal">
									<label class="label">Titre </label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<input class="input" type="text" id="conf-default-description-title" placeholder="Titre de la description de la carte" value="${this.fileContentConfigObj.params.description.title}">
									</p>
							    </div>
							  </div>
							</div>`; 

		let htmlContent = `<div class="field is-horizontal" title="Contenu de la description de la carte">
								<div class="field-label is-normal">
									<label class="label">Contenu </label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<textarea class="textarea" id="conf-default-description-html" placeholder="Contenu de la description de la carte">${this.fileContentConfigObj.params.description.html}</textarea>
									</p>
							    </div>
							  </div>
							</div>`; 

		let htmlCreator = `<div class="field is-horizontal" title="Nom du créateur de la carte afficher dans la description">
								<div class="field-label is-normal">
									<label class="label">Créateur </label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<input class="input" type="text" id="conf-default-description-creator" placeholder="Nom du créateur de la carte afficher dans la description" value="${this.fileContentConfigObj.params.description.creator}">
									</p>
							    </div>
							  </div>
							</div>`; 


		let htmlCreatorWebsite = `<div class="field is-horizontal" title="Lien vers le site du créateur de la carte afficher dans la descriptio">
								<div class="field-label is-normal" style="flex:1.5">
									<label class="label">Site du créateur </label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<input class="input" type="text" id="conf-default-description-creatorWebsite" placeholder="Lien vers le site du créateur de la carte afficher dans la description" value="${this.fileContentConfigObj.params.description.creatorWebsite}">
									</p>
							    </div>
							  </div>
							</div>`; 

		let htmlForm = `<form class="form"><fieldset class="fieldset"><legend> Description de la carte </legend>${htmlTitle + htmlContent + htmlCreator + htmlCreatorWebsite}</fieldset></form>`;

		return htmlForm;
  	}

  	/**
  	 * Get the config object
  	 */
  	getContentConfigObj() {

  		//let newFileContentConfigObj = this.fileContentConfigObj;

  		let valid = true;

  		if(document.getElementById("conf-editModeEnable-yes").checked) {
  			this.fileContentConfigObj.params.editModeEnable = true;
  		}
  		else {
  			this.fileContentConfigObj.params.editModeEnable = false;
  		}

  		this.fileContentConfigObj.params.default.zoom = document.getElementById("conf-default-zoom").value;
  		this.fileContentConfigObj.params.default.position[0] = document.getElementById("conf-default-position-long").value;
  		this.fileContentConfigObj.params.default.position[1] = document.getElementById("conf-default-position-lat").value;

  		if(document.getElementById("conf-fullscreenControl-yes").checked) {
  			this.fileContentConfigObj.params.default.fullscreenControl = true;
  		}
  		else {
  			this.fileContentConfigObj.params.default.fullscreenControl = false;
  		}

  		this.fileContentConfigObj.params.default.vizReference = document.getElementById("conf-default-marker-vizReference").value;
  		this.fileContentConfigObj.params.default.marker = this.stylePointDefaut.getContentConfigObj();

  		// Add description
  		this.fileContentConfigObj.params.description.title = document.getElementById("conf-default-description-title").value;
  		this.fileContentConfigObj.params.description.html = document.getElementById("conf-default-description-html").value;
  		this.fileContentConfigObj.params.description.creator = document.getElementById("conf-default-description-creator").value;
  		this.fileContentConfigObj.params.description.creatorWebsite = document.getElementById("conf-default-description-creatorWebsite").value;

  		if(!this.fileContentConfigObj.params.default.zoom || !this.fileContentConfigObj.params.default.position[0] || !this.fileContentConfigObj.params.default.position[1] 
  			|| !this.fileContentConfigObj.params.description.title || !this.fileContentConfigObj.params.description.html || !this.fileContentConfigObj.params.description.creator 
  			|| !this.fileContentConfigObj.params.description.creatorWebsite || !this.fileContentConfigObj.params.default.marker.color || !this.fileContentConfigObj.params.default.marker.size
  			|| !this.fileContentConfigObj.params.default.marker.icon.value) 
  		{
  			valid = false;
  		}

  		if(valid) {
  			return this.fileContentConfigObj;
  		}
  		else {
  			return null;
  		}
  	}
}