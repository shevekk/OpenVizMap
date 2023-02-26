/*
 * Source management
 */
SimpleGIS.Data.DataSource = class DataSource
{
  /*
   * @param {string} - name - Name of the file
   * @param {string} - reference - Reference of the file
   * @param {string} - type - The type of file (point, polygon, polyline)
   * @param {string} - dataFile - Url of the data file
   * @param {string} - description - Description of the source
   * @param {string} - style - Style of the layer
   * @param {string} - customStyles - Custom style of the layer from prop
   * @param {string} - group - Reference of the group
   * @param {Object} - popupParams - Params of the popup
   * @param {string} - autoload - True if the file is load at the launch of the application 
   * @property {L.geoJSON} - geoJson - The geojson content of the file
   * @property {L.Layer} - layer - Layer create this geojson data
   * @property {L.divIcon} - icons - List of stored icons
   * @property {bool} - loaded - True if already loaded
   */
  constructor(name, reference, type, dataFile, description, style, customStyles, group, popupParams, autoload) 
  {
  	this.name = name;
    this.reference = reference;
  	this.type = type;
  	this.dataFile = dataFile;
    this.description = description;
    this.style = style;
    this.customStyles = customStyles;
    this.popupParams = popupParams;
  	this.autoload = autoload;
    this.group = group;
    this.geoJson = null;
    this.layer = null;
    this.icons = [];
    this.customPropVariables = [];

    this.loaded = false;
  }

  /*
   * Load geojson file and create the layer
   * @param {SimpleGIS.Data.DefaultParams} - defaultParams - Default param of the map
   */
  loadGeoJson(defaultParams)
  {
    let me = this;

    return new Promise((resolve, reject) => {

    if(this.loaded) {
      resolve(this.geoJson);
    }

    fetch(this.dataFile)
      .then((response) => response.json())
      .then((geoJson) => {

        // Remove empty geometries of geojson
        for(let i = 0; i < geoJson.features.length; i++) {
          if(Object.entries(geoJson.features[i].geometry).length == 0) {
            geoJson.features.splice(i,1);
            i--;
          }
        }

        this.geoJson = geoJson;
        this.layer = L.geoJSON(geoJson);

        me.setLayerStyle(defaultParams);

        me.initLayerPopUpFromProps();

        this.loaded = true;

        resolve(geoJson);
      });
    });
  }

  /*
   * Manage display of props in pop-up
   */
  initLayerPopUpFromProps() 
  {
    let me = this;
    
    me.layer.eachLayer(function (subLayer) {
      
      let text = "<p style='font-size: 10px;'>";

      if(me.popupParams) {
        for(let i = 0; i < me.popupParams.props.length; i++) {
          if(subLayer.feature.properties[me.popupParams.props[i]]) {

            if(me.popupParams.bolds.includes(me.popupParams.props[i])) {
              text += "<strong>";
            }
            if(me.popupParams.italics.includes(me.popupParams.props[i])) {
              text += "<i>";
            }

            text += me.popupParams.props[i] + " : " + subLayer.feature.properties[me.popupParams.props[i]] + "<br/>";

            if(me.popupParams.italics.includes(me.popupParams.props[i])) {
              text += "</i>";
            }
            if(me.popupParams.bolds.includes(me.popupParams.props[i])) {
              text += "</strong>";
            }
          }
        }
      }
      else {
        Object.keys(subLayer.feature.properties).forEach(key => {
            text += key + " : " + subLayer.feature.properties[key] + "<br/>";
        });
      }

      text += "</p>"
      
      subLayer.bindPopup(text);
    });
  }

  /*
   * Check if a condition is correct
   * @params {string/number} - layerProperties - The value of a layer prop
   * @params {Object} - condition - The custom display condition
   * @return {bool}
   */
  checkCondition(layerProperties, condition)
  {
    let conditionValid = false;

    if(condition.condition && layerProperties) {
      if(condition.condition == "=")
      {
        if(isNaN(condition.value) && layerProperties.toLowerCase() == condition.value.toLowerCase()) {
          conditionValid = true;
        }
        else if(layerProperties == condition.value) {
          conditionValid = true;
        }
      }
      else if(condition.condition == "!=")
      {
        if(isNaN(condition.value) && layerProperties.toLowerCase() != condition.value.toLowerCase()) {
          conditionValid = true;
        }
        else if(layerProperties != condition.value) {
          conditionValid = true;
        }
      }
      else if(condition.condition == ">")
      {
        if(layerProperties > condition.value) {
          conditionValid = true;
        }
      }
      else if(condition.condition == ">=")
      {
        if(layerProperties >= condition.value) {
          conditionValid = true;
        }
      }
      else if(condition.condition == "<")
      {
        if(layerProperties < condition.value) {
          conditionValid = true;
        }
      }
      else if(condition.condition == "<=")
      {
        if(layerProperties <= condition.value) {
          conditionValid = true;
        }
      }
      else if(condition.condition.toLowerCase() == "include")
      {
        if(layerProperties && layerProperties.include(condition.value)) {
          conditionValid = true;
        }
      }
    }
    else {
      if(layerProperties && layerProperties.toLowerCase() == condition.value.toLowerCase()) {
        conditionValid = true;
      }
    }

    return conditionValid;
  }

  /*
   * Convert a string with calc to a number result
   * @params {string} - str - The calc string
   * @return {number} - The calc result
   */
  convertStrToNumber(str) 
  {
    return new Function('return ' + str)();
  }
}