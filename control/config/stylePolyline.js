
/**
 * Config management of the style of a Polyline 
 */
SimpleGIS.Control.Config.StylePolyline = class StylePolyline
{
	/**
	 * @param {Object} - configurationContentDiv - HTML element
	 * @param {Object} - style - Object of content
	 * @param {string} - reference
	 */
	constructor(configurationContentDiv, style, reference, numberCustomStyle, numberValue)
	{
  		this.style = style;
  		this.referenceId = `|${reference}`;
  		this.arraySVG = [];
  		this.numberCustomStyle = numberCustomStyle || numberCustomStyle==0 ? `|${numberCustomStyle}` : ``;
  		this.numberValue = numberValue || numberValue==0 ? `|${numberValue}` : ``;

  		let htmlColor = `<div class="field is-horizontal" title="Couleur de la ligne">
								<div class="field-label is-normal">
									<label class="label">Couleur</label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<input class="input" type="color" id="conf-style-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}" value="${style.color ? style.color : ""}">
									</p>
							    </div>
							  </div>
							</div>`;

		let htmlWeight = `<div class="field is-horizontal" title="Taille de la ligne">
								<div class="field-label is-normal">
									<label class="label">Taille</label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<input class="input" type="number" min="0" id="conf-style-weight${this.referenceId}${this.numberCustomStyle}${this.numberValue}" value="${style.weight ? style.weight : 1}">
									</p>
							    </div>
							    <div class="field">
							      <div class="config-style-display-polyline" id="conf-style-display${this.referenceId}${this.numberCustomStyle}${this.numberValue}"></div>
						   		</div>
							  </div>
							</div>`;

  		let htmlForm = `<form class="form"><fieldset class="fieldset"><legend> Style </legend>${htmlColor + htmlWeight}</fieldset></div>`;

  		configurationContentDiv.innerHTML = htmlForm;

  		this.updateDisplay(style.color, style.weight);

			document.getElementById(`conf-style-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('change', event => {
			this.updateDisplay(event.target.value, document.getElementById(`conf-style-weight${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value);
		});
			document.getElementById(`conf-style-weight${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('change', event => {
  		this.updateDisplay(document.getElementById(`conf-style-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, event.target.value);
		});
	}

  	/**
  	 * Update the display icon design
	 * @param {string} - color - Border color 
	 * @param {string} - weight - Border number 
	 */
  	updateDisplay(color, weight) 
  	{
  		document.getElementById(`conf-style-display${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["height"] = weight + "px";
  		document.getElementById(`conf-style-display${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["background-color"] = color;
  	}

  	/**
  	 * Get the config object
  	 * @return {object} - style object
  	 */
  	getContentConfigObj()
  	{
  		let style = {};
  		style.color = document.getElementById(`conf-style-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;
  		style.weight = document.getElementById(`conf-style-weight${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;

  		return style;
  	}
}