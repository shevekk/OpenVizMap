/*
 * Polygon source management
 */
SimpleGIS.Data.DataSourcePolygon = class DataSourcePolygon extends SimpleGIS.Data.DataSource
{
  /*
   * @param {string} - name - Name of the file
   * @param {string} - reference - Reference of the file
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
   */
  constructor(name, reference, dataFile, description, style, customStyles, group, popupParams, autoload)
  {
    super(name, reference, 'polygon', dataFile, description, style, customStyles, group, popupParams, autoload);
  }

  /*
   * Set style of layer of type polygon
   */
  setLayerStyle()
  {
    let me = this;

    me.layer.eachLayer(function (subLayer) {
      if(me.style) {
        subLayer.setStyle(me.style);
      }

      // Design from customStyles params
      if(me.customStyles) {
        for(let i = 0; i < me.customStyles.length; i++) {
          if(!me.customStyles[i].type || me.customStyles[i].type != "variable") {
            for(let j = 0; j < me.customStyles[i].values.length; j++) {
              if(me.checkCondition(subLayer.feature.properties[me.customStyles[i].prop], me.customStyles[i].values[j])) {
                subLayer.setStyle(me.customStyles[i].values[j].style);
              }
            }
          }
          else if(me.customStyles[i].type == "variable") {
            let valueProp = null;
            if(me.customStyles[i].valueType == "number") {
              valueProp = me.convertStrToNumber(me.customStyles[i].value.replace("${0}", subLayer.feature.properties[me.customStyles[i].prop]));
            }
            else {
              valueProp = me.customStyles[i].value.replace("${0}", subLayer.feature.properties[me.customStyles[i].prop]);
            }

            let styleObj = {};
            if(valueProp && me.customStyles[i].propStyle) {
              styleObj[me.customStyles[i].propStyle] = valueProp;
              subLayer.setStyle(styleObj);
            }

            // Init customPropVariables for legend
            if(!me.customPropVariables.find(cpv => cpv.valueProp == valueProp)) {
              me.customPropVariables.push({valueProp, styleObj});
            }
          }
        }
      }
    });
  }
}

//Object.setPrototypeOf(SimpleGIS.Data.DataSourcePolygon.prototype, SimpleGIS.Data.DataSource);