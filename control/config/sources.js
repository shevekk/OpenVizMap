// sources.js

SimpleGIS.Control.Config.Sources = class Sources extends SimpleGIS.Control.Config.SourcesBase
{
  /**
   * @param {Object} - configurationContentDiv - HTML element
   * @param {Object} - fileContentConfigObj - Object of content
   * @param {string[]} - arraySVG - List of all svg url
   */
  constructor(configurationContentDiv, fileContentConfigObj, arraySVG) 
  {
    super(configurationContentDiv, fileContentConfigObj, arraySVG, "sources");
  }

  /**
   * Add a spetial part of the block
   * @param {string} - reference
   * @param {string} - name
   * @param {object} - object - The object content
   */
  addSpeBlock(reference, name, object)
  {
    return `<div class="field is-horizontal" title="Lien vers le fichier source geojson (chemin local ou url)">
            <div class="field-label is-normal">
              <label class="label">Fichier </label>
            </div>
            <div class="field-body">
                <div class="field">
                  <p class="control">
                <input class="input" type="text" id="config-source-fileUrl|${reference}" placeholder="Lien vers le fichier source geojson (chemin local ou url)" value="${object.sourceFile ? object.sourceFile : ""}">
              </p>
              </div>
            </div>
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

        let fileUrl = document.getElementById(`config-source-fileUrl|${baseRef}`).value;

        let source = me.fileContentConfigObj.sources.find(s => s.reference == document.getElementById(`config-source-reference|${baseRef}`).value);
        source.sourceFile = fileUrl;
      });
    }

    return newFileContentConfigObj;
  }
}