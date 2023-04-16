
/**
 * Config management of the style of a Polygon 
 */
SimpleGIS.Control.Config.StylePolygon = class StylePolygon
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

  		let htmlColor = `<div class="field is-horizontal" title="Couleur des bordures du polygone">
								<div class="field-label is-normal">
									<label class="label">Couleur des bordures</label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<input class="input" type="color" id="conf-style-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}" value="${style.color ? style.color : ""}">
									</p>
							    </div>
							  </div>
							</div>`;

		let htmlWeight = `<div class="field is-horizontal" title="Taille des bordures du polygone">
								<div class="field-label is-normal">
									<label class="label">Taille des bordures</label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<input class="input" type="number" min="0" id="conf-style-weight${this.referenceId}${this.numberCustomStyle}${this.numberValue}" value="${style.weight ? style.weight : 1}">
									</p>
							    </div>
							  </div>
							</div>`;

		let htmlFillColor = `<div class="field is-horizontal" title="Couleur de remplissage du polygone">
								<div class="field-label is-normal">
									<label class="label">Couleur de remplissage </label>
								</div>
								<div class="field-body">
								    <div class="field">
								      <p class="control">
										<input class="input" type="color" id="conf-style-fill-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}" value="${style.fillColor ? style.fillColor : ""}">
									</p>
							    </div>
							  </div>
							</div>`;
		
		let htmlFillOpacity = `<div class="field is-horizontal" title="Opacité du remplissage du polygone">
								<div class="field-label is-normal">
									<label class="label">Opacité du remplissage</label>
								</div>
								<div class="field-body">
								    <div class="field">
								      	<p class="control">
											<input class="input" type="number" min="0" max="1" step=".1" id="conf-style-fill-opacity${this.referenceId}${this.numberCustomStyle}${this.numberValue}" value="${style.fillOpacity ? style.fillOpacity : 0.5}">
										</p>
							    	</div>
								    <div class="field">
								      <div class="config-style-display-polygon" id="conf-style-display${this.referenceId}${this.numberCustomStyle}${this.numberValue}"></div>
							   		</div>
							  </div>
							</div>`;


  		let htmlForm = `<form class="form"><fieldset class="fieldset"><legend> Style </legend>${htmlColor + htmlWeight + htmlFillColor + htmlFillOpacity}</fieldset></div>`;

  		configurationContentDiv.innerHTML = htmlForm;

  		this.updateDisplay(style.color, style.weight, style.fillColor, style.fillOpacity);

  		document.getElementById(`conf-style-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('change', event => {
  			this.updateDisplay(event.target.value, document.getElementById(`conf-style-weight${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-style-fill-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-style-fill-opacity${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value);
		});
		document.getElementById(`conf-style-weight${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('change', event => {
  			this.updateDisplay(document.getElementById(`conf-style-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, event.target.value, document.getElementById(`conf-style-fill-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-style-fill-opacity${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value);
		});
		document.getElementById(`conf-style-fill-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('change', event => {
  			this.updateDisplay(document.getElementById(`conf-style-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-style-weight${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, event.target.value, document.getElementById(`conf-style-fill-opacity${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value);
		});
		document.getElementById(`conf-style-fill-opacity${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).addEventListener('change', event => {
  			this.updateDisplay(document.getElementById(`conf-style-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-style-weight${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, document.getElementById(`conf-style-fill-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value, event.target.value);
		});
  	}

  	/**
  	 * Update the display icon design
	 * @param {string} - color - Border color 
	 * @param {string} - weight - Border number 
	 * @param {string} - fillColor - background color
	 * @param {string} - fillOpacity - background opacity
	 */
  	updateDisplay(color, weight, fillColor, fillOpacity) 
  	{
  		document.getElementById(`conf-style-display${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["border-color"] = color;
  		document.getElementById(`conf-style-display${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["border-width"] = weight + "px";
  		document.getElementById(`conf-style-display${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).style["background-color"] = fillColor + (fillOpacity * 100).toString(16);;
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
  		style.fillColor = document.getElementById(`conf-style-fill-color${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;
  		style.fillOpacity = document.getElementById(`conf-style-fill-opacity${this.referenceId}${this.numberCustomStyle}${this.numberValue}`).value;

  		return style;
  	}
}