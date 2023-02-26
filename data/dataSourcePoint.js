/*
 * Point source management
 */
SimpleGIS.Data.DataSourcePoint = class DataSource extends SimpleGIS.Data.DataSource
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
    super(name, reference, 'point', dataFile, description, style, customStyles, group, popupParams, autoload);
  }

  /*
   * Set style of layer of type point
   * @params {SimpleGIS.Data.DefaultParams} - defaultParams - Default param of the map
   */
  setLayerStyle(defaultParams)
  {
    let me = this;
    me.layer = L.geoJSON(me.geoJson, {
      pointToLayer: function (feature, latlng) {

        let persoStyle = {};
        persoStyle["color"] = "#000000";
        persoStyle["iconValue"] = "fa-sharp fa-solid fa-location-dot";
        persoStyle["typeIcon"] = "font";
        persoStyle["size"] = 25;
        persoStyle["anchorType"] = ""; // center, bottom
        persoStyle["backgroundColor"] = null;

        // Design from default params
        if(defaultParams && defaultParams.marker) {
          me.updateStyle(persoStyle, defaultParams.marker);
        }

        // Design from style params
        if(me.style) {
          me.updateStyle(persoStyle, me.style);
        }
        else {
          me.style = defaultParams.marker;
        }

        // Design from customStyles params
        if(me.customStyles) {
          for(let i = 0; i < me.customStyles.length; i++) {
            if(!me.customStyles[i].type || me.customStyles[i].type != "variable") {
              for(let j = 0; j < me.customStyles[i].values.length; j++) {
              
                if(me.checkCondition(feature.properties[me.customStyles[i].prop], me.customStyles[i].values[j])) {
                  me.updateStyle(persoStyle, me.customStyles[i].values[j].style);
                }
              }
            }
            else if(me.customStyles[i].type == "variable") {
              let valueProp = null;
              if(me.customStyles[i].valueType == "number") {
                valueProp = me.convertStrToNumber(me.customStyles[i].value.replace("${0}", feature.properties[me.customStyles[i].prop]));
              }
              else {
                valueProp = me.customStyles[i].value.replace("${0}", feature.properties[me.customStyles[i].prop]);
              }

              if(valueProp && me.customStyles[i].propStyle == "size")
              {
                persoStyle["size"] = valueProp;
              }
              else if(valueProp && me.customStyles[i].propStyle == "iconValue")
              {
                persoStyle["iconValue"] = valueProp;
              }
              else if(valueProp && me.customStyles[i].propStyle == "color")
              {
                persoStyle["color"] = valueProp;
              }
              else if(valueProp && me.customStyles[i].propStyle == "backgroundColor")
              {
                persoStyle["backgroundColor"] = valueProp;
              }

              // Init customPropVariables for legend
              if(!me.customStyles[i].propStyle == "size" && !me.customPropVariables.find(cpv => cpv.valueProp == valueProp)) {
                me.customPropVariables.push({valueProp, styleObj});
              }
            }
          }
        }

        // Apply Style
        let anchor = [persoStyle["size"]/2, persoStyle["size"]/2];
        let popupAnchor = [0, 0];
        if(persoStyle["anchorType"] == "center") {
          anchor = [persoStyle["size"]/2, persoStyle["size"]/2];
          popupAnchor = [0, 0];
        }
        else if(persoStyle["anchorType"] == "bottom") {
          anchor = [persoStyle["size"]/2, persoStyle["size"]];
          popupAnchor = [0, -persoStyle["size"]/2];
        }

        let icon = me.findIcon(persoStyle["typeIcon"], persoStyle["size"], anchor, popupAnchor, persoStyle["iconValue"], persoStyle["color"], persoStyle["backgroundColor"]);
        if(icon == null) {
          icon = me.addIcon(persoStyle["typeIcon"], persoStyle["size"], anchor, popupAnchor, persoStyle["iconValue"], persoStyle["color"], persoStyle["backgroundColor"]);
        }

        return L.marker(latlng, {icon: icon});
      }
    });
  }

  /*
   * @param {object} - persoStyle - The apply style
   * @param {object} - styleParams - The style in param files
   */
  updateStyle(persoStyle, styleParams)
  {
    if(styleParams.color) {
      persoStyle["color"] = styleParams.color;
    }
    if(styleParams.backgroundColor) {
      persoStyle["backgroundColor"] = styleParams.backgroundColor;
    }
    if(styleParams.icon) {
      if(styleParams.icon.value) {
        persoStyle["iconValue"] = styleParams.icon.value;
      }
      if(styleParams.icon.anchorType) {
        persoStyle["anchorType"] = styleParams.icon.anchorType;
      }
      if(styleParams.icon.type) {
        persoStyle["typeIcon"] = styleParams.icon.type;
      }
    }
    if(styleParams.size) {
      persoStyle["size"] = styleParams.size;
    }

    return persoStyle;
  }

  /*
   * Check if an icon exist for is data source
   * @params {string} - typeIcon - Type of the icon ("font" or "svg")
   * @params {number} - size - Size of the icon 
   * @params {number[]} - anchor - Ancrage
   * @params {number[]} - popupAnchor - Ancrage de la popup
   * @params {string} - iconValue - Value of the icon (class or url)
   * @params {string} - color - The icon color
   * @params {string} - backgroundColor - The icon background color
   * @return {L.divIcon} - The icon or null
   */
  findIcon(typeIcon, size, anchor, popupAnchor, iconValue, color, backgroundColor) 
  {
    let icon = null;

    if(typeIcon == "font") {
      let html = `<i class="${iconValue}" style="font-size: ${size}px;color:${color};background-color:${backgroundColor}"></i>`;
      icon = this.icons.find(i => i.options.iconSize[0] == size && i.options.iconAnchor[0] == anchor[0] && i.options.iconAnchor[1] == anchor[1] && i.options.popupAnchor[0] == popupAnchor[0] && i.options.popupAnchor[1] == popupAnchor[1] && i.options.html == html);
    }
    else {
      icon = this.icons.find(i => i.options.iconSize == size && i.options.popupAnchor[0] == popupAnchor[0]  && i.options.popupAnchor[1] == popupAnchor[1] && i.options.iconUrl == iconValue && i.options.color == color);
    }

    return icon;
  }

  /*
   * Create a new icon and add to array
   * @params {string} - typeIcon - Type of the icon ("font" or "svg")
   * @params {number} - size - Size of the icon 
   * @params {number[]} - anchor - Ancrage
   * @params {number[]} - popupAnchor - Ancrage de la popup
   * @params {string} - iconValue - Value of the icon (class or url)
   * @params {string} - color - The icon color
   * @params {string} - backgroundColor - The icon background color (for font icon)
   * @return {L.divIcon} - The new icon
   */
  addIcon(typeIcon, size, anchor, popupAnchor, iconValue, color, backgroundColor) 
  {
    let icon = null;
    if(typeIcon == "font") {
      icon = L.divIcon({
        iconSize : [size, size],
        iconAnchor: anchor,
        popupAnchor: popupAnchor,
        html: `<i class="${iconValue}" style="font-size: ${size}px;color:${color};background-color:${backgroundColor}"></i>`,
        className: 'myDivIcon'
      });
    }
    else {
      icon = L.colorIcon({
        iconSize : size,
        popupAnchor : popupAnchor,
        iconUrl: window.location.href.split("?")[0] + "/" + iconValue,
        color: color
      });
    }

    this.icons.push(icon);
    return icon;
  }
}
 