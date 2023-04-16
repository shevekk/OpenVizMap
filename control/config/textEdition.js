


SimpleGIS.Control.Config.TextEdition = class TextEdition
{
	/**
	 * @param {Object} - configurationContentDiv - HTML element
	 * @param {Object} - fileContentConfigObj - Object of content
	 */
	constructor(configurationContentDiv, fileContentConfigObj) 
	{
		let fileContentConfigText = JSON.stringify(fileContentConfigObj, null, 2);

		configurationContentDiv.innerHTML = `<textArea class="textArea-configuration">${fileContentConfigText}</textArea>`;
	}

  /**
	 * Get the config object
	 */
	getContentConfigObj() 
	{
		let textArea = document.getElementsByClassName("textArea-configuration")[0];  
    let fileContentConfigObj = JSON.parse(textArea.value);

		return fileContentConfigObj;
	}
}