
/**
 * Config management of the style of a Point
 */
SimpleGIS.Control.Config.StylePoint = class StylePoint
{
	/**
	 * @param {Object} - configurationContentDiv - HTML element
	 * @param {Object} - style - Object of content
	 * @param {string} - reference
	 */
	constructor(configurationContentDiv, style, reference, numberCustomStyle, numberValue, legendName)
  {
		this.style = style;
		this.referenceId = `|${reference}`;
		this.arraySVG = [];
		this.numberCustomStyle = numberCustomStyle || numberCustomStyle==0 ? `|${numberCustomStyle}` : ``;
		this.numberValue = numberValue || numberValue==0 ? `|${numberValue}` : ``;
		legendName = legendName ? legendName : "Style";

		let htmlColor = `<div class="field is-horizontal" title="Couleur du marqueur">
							<div class="field-label is-normal">
								<label class="label">Couleur </label>
							</div>
							<div class="field-body">
							    <div class="field">
							      <p class="control">
									<input class="input" type="color" id="conf-default-marker-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}" placeholder="Couleur du marqueur" value="${style.color}">
								</p>
						    </div>
						  </div>
						</div>`; 

		let htmlBackgroundColor = `<div class="field is-horizontal" title="Couleur du fond du marqueur">
								<div class="field-label is-normal" style="flex:2">
									<label class="label">Couleur de fond </label>
								</div>
								<div class="field-body" style="flex:0.3">
								    <div class="field" >
								      <p class="control">
								      	<input type="checkbox" class="checkbox" id="conf-default-marker-backgroundColorEnable${this.referenceId}${this.numberCustomStyle}${this.numberValue}" checked>
									  </p>
							    	</div>
							    </div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<input class="input" type="color" id="conf-default-marker-backgroundColor${this.referenceId}${this.numberCustomStyle}${this.numberValue}" placeholder="Couleur du fond du marqueur" value="${style.backgroundColor}">
									</p>
							    </div>
							  </div>
							</div>`; 

		let htmlSize = `<div class="field is-horizontal" title="Taille du marqueur">
								<div class="field-label is-normal">
									<label class="label">Taille </label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<input class="input" type="number" id="conf-default-marker-size${this.referenceId}${this.numberCustomStyle}${this.numberValue}" placeholder="Taille du marqueur" value="${style.size}">
									</p>
							    </div>
							  </div>
							</div>`;

		let htmlType = `<div class="field is-horizontal" title="Type d'icône du marqueur">
								<div class="field-label is-normal">
									<label class="label">Type </label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<select class="select" id="conf-default-marker-type${this.referenceId}${this.numberCustomStyle}${this.numberValue}">
											<option value="svg">SVG</option>
											<option value="font">Font</option>
										</select>
									</p>
							    </div>
							  </div>
							</div>`;

		let htmlValeur = `<div class="field is-horizontal" title="Classe CSS de l'icône ou url de l'image svg">
								<div class="field-label is-normal">
									<label class="label">Valeur </label>
								</div>
								<div class="field-body" id="conf-default-marker-value-div${this.referenceId}${this.numberCustomStyle}${this.numberValue}" >
								    <div class="field">
								      <p class="control">
										<input class="input" type="text" id="conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}" placeholder="Classe CSS de l'icône" value="${style.icon ? style.icon.value : ""}">
										<a href="https://fontawesome.com/search?o=r&m=free&s=solid" target="_blank">FontAwesome</a> |
										<a href="https://remixicon.com/" target="_blank">Remix Icon</a> |
										<a href="https://atlasicons.vectopus.com/" target="_blank">Atlas Icons</a>
									</p>
								  </div>
							    </div>
							    <div class="field-body" id="conf-default-marker-value-list-div${this.referenceId}${this.numberCustomStyle}${this.numberValue}" >
								    <div class="field">
								      <p class="control">
								      <select class="select" id="conf-default-marker-value-list${this.referenceId}${this.numberCustomStyle}${this.numberValue}"></select>
									</p>
							    </div>
							  </div>
							</div>`;

		let htmlAnchorType = `<div class="field is-horizontal" title="Placement de l'icône du marqueur">
								<div class="field-label is-normal">
									<label class="label">Placement </label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<select class="select" id="conf-default-marker-placement${this.referenceId}${this.numberCustomStyle}${this.numberValue}">
											<option value="bottom">bottom</option>
											<option value="center">center</option>
										</select>
									  </p>
							       </div>
							       <div class="field">
								      <p class="control">
										<i class="" id="config-display-icon${this.referenceId}${this.numberCustomStyle}${this.numberValue}"></i>
										<img id="config-display-icon-img${this.referenceId}${this.numberCustomStyle}${this.numberValue}" class="config-display-icon-img" src="">
									  </p>
							       </div>
							  </div>
							</div>`;

  		let htmlForm = `<form class="form"><fieldset class="fieldset"><legend> ${legendName} </legend>${htmlColor + htmlBackgroundColor + htmlSize + htmlType + htmlValeur + htmlAnchorType}<div id="conf-default-stylePoint"></div></fieldset></div>`;

  		configurationContentDiv.innerHTML = htmlForm;

  		// Init values
  		if(!style.backgroundColor) {
  			document.getElementById(`conf-default-marker-backgroundColorEnable${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).checked = false;
  			document.getElementById(`conf-default-marker-backgroundColor${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).disabled = true;
  		}

  		document.getElementById(`conf-default-marker-type${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value = style.icon ? style.icon.type : "font";
  		document.getElementById(`conf-default-marker-placement${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value = style.icon ? style.icon.anchorType : "center";

  		// Events
  		document.getElementById(`conf-default-marker-backgroundColorEnable${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('click', event => {
			document.getElementById(`conf-default-marker-backgroundColor${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).disabled = !event.currentTarget.checked;
		});

		// Events of update the display icon design
		this.updateIconDisplay(style.icon ? style.icon.type : "font", style.icon ? style.icon.value : "", style.icon ? style.icon.value : "", style.color, style.backgroundColor, true);
		document.getElementById(`conf-default-marker-type${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('change', event => {
			let type = event.target.value;
  			this.updateIconDisplay(type, document.getElementById(`conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-value-list${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-backgroundColor${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-backgroundColorEnable${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).checked);
		});
		document.getElementById(`conf-default-marker-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('blur', event => {
  			this.updateIconDisplay(document.getElementById(`conf-default-marker-type${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-value-list${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, event.target.value, document.getElementById(`conf-default-marker-backgroundColor${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-backgroundColorEnable${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).checked);
		});
		document.getElementById(`conf-default-marker-backgroundColor${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('blur', event => {
  			this.updateIconDisplay(document.getElementById(`conf-default-marker-type${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-value-list${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, event.target.value, document.getElementById(`conf-default-marker-backgroundColorEnable${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).checked);
		});
		document.getElementById(`conf-default-marker-backgroundColorEnable${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('click', event => {

			if(event.target.checked == true) {
				if(document.getElementById(`conf-default-marker-type${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value == "font") {
					let value = document.getElementById(`conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;
					if(!value.includes("background-icon ")) {
						document.getElementById(`conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value = "background-icon " + value;
					}
				}
			}
			else {
				if(document.getElementById(`conf-default-marker-type${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value == "font") {
					let value = document.getElementById(`conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;
					if(value.includes("background-icon ")) {
						document.getElementById(`conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value = value.replace("background-icon ", "");
					}
				}
			}

			this.updateIconDisplay(document.getElementById(`conf-default-marker-type${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-value-list${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-backgroundColor${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, event.target.checked);
		});
		document.getElementById(`conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('blur', event => {
  			this.updateIconDisplay(document.getElementById(`conf-default-marker-type${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, event.target.value, document.getElementById(`conf-default-marker-value-list${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-backgroundColor${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-backgroundColorEnable${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).checked);
		});
		document.getElementById(`conf-default-marker-value-list${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('change', event => {
  			this.updateIconDisplay(document.getElementById(`conf-default-marker-type${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, event.target.value, document.getElementById(`conf-default-marker-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-backgroundColor${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-default-marker-backgroundColorEnable${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).checked);
		});
	}

	/*
	 * Set the array of SVG images urls to the select
	 * @param {array} - arraySVG - array of SVG images urls
	 */
	setArraySVG(arraySVG) 
	{
		let htmlSelectSvg = ``;

		for(let i = 0; i < arraySVG.length; i++) {
			htmlSelectSvg += `<option value="${arraySVG[i]}">${arraySVG[i]}</option>`;
		}

		document.getElementById(`conf-default-marker-value-list${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).innerHTML = htmlSelectSvg;

		if(this.style.icon && this.style.icon.type == "svg") {
			document.getElementById(`conf-default-marker-value-list${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value = this.style.icon.value;
		}
	}

	/**
	 * Update the display icon design
	 * @param {string} - type - 'font' or 'svg'
	 * @param {string} - value - CSS value
	 * @param {string} - valueSrc - src image link
	 * @param {string} - color - 
	 * @param {string} - backgroundColor - 
	 * @param {bool} - backgroundEnable - 
	 */
	updateIconDisplay(type, value, valueSrc,  color, backgroundColor, backgroundEnable) 
	{
  	if(type == "font") {
			document.getElementById(`conf-default-marker-value-list-div${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["display"] = "none";
			document.getElementById(`conf-default-marker-value-div${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["display"] = "inline-block";

			document.getElementById(`config-display-icon${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["display"] = "inline-block";
			document.getElementById(`config-display-icon-img${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["display"] = "none";

			document.getElementById(`config-display-icon${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["color"] = color;
			document.getElementById(`config-display-icon${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).className = `${value} config-display-icon`;

			if(backgroundEnable) {
				document.getElementById(`config-display-icon${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["background-color"] = backgroundColor;
  		}
  		else {
  			document.getElementById(`config-display-icon${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["background-color"] = null;
  		}
		}
		else {
			document.getElementById(`conf-default-marker-value-list-div${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["display"] = "inline-block";
			document.getElementById(`conf-default-marker-value-div${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["display"] = "none";

			document.getElementById(`config-display-icon${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["display"] = "none";
			document.getElementById(`config-display-icon-img${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["display"] = "inline-block";

			document.getElementById(`config-display-icon-img${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).src = window.location.href.split("?")[0] + "/" + valueSrc;

			document.getElementById(`config-display-icon-img${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["color"] = color;

			if(backgroundEnable) {
				document.getElementById(`config-display-icon-img${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["background-color"] = backgroundColor;
			}
			else {
				document.getElementById(`config-display-icon-img${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["background-color"] = null;
			}
		}
	}

	/**
	 * Get the config object
	 * @return {object} - style object
	 */
	getContentConfigObj() 
	{
		let style = {};

		style.color = document.getElementById(`conf-default-marker-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;

		if(!document.getElementById(`conf-default-marker-backgroundColor${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).disabled) {
			style.backgroundColor = document.getElementById(`conf-default-marker-backgroundColor${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;
		}
		if(document.getElementById(`conf-default-marker-size${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value) {
			style.size = document.getElementById(`conf-default-marker-size${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;
		}

		style.icon = {};
		style.icon.type = document.getElementById(`conf-default-marker-type${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;
		style.icon.anchorType = document.getElementById(`conf-default-marker-placement${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;

		if(style.icon.type == "font") {
			style.icon.value = document.getElementById(`conf-default-marker-value${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;
		}
		else {
			style.icon.value = document.getElementById(`conf-default-marker-value-list${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;
		}

		return style;
	}
}