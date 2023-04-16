
/*
 * Control for display legend of a view
 */
SimpleGIS.Control.Legend = L.Control.extend({

  options: {
    position: 'bottomleft'
  },

  /*
   * Init the sources
   * @param {SimpleGIS.Data.DataSource[]} - dataSources - Source of all display values
   * @param {string} - description - Description of the viz
   */
  init(sources, description) 
  {
    this.div = L.DomUtil.create('div', 'leaflet-bar leaflet-control legend-control');

    // Title
    let controlTitleDiv = L.DomUtil.create('div', 'control-legend-title', this.div);

    let controlTitle = L.DomUtil.create('h2', 'legend-title-control', controlTitleDiv);
    controlTitle.innerHTML += "Legend";

    this.iconOpenAll = L.DomUtil.create('i', 'fa-regular fa-square-caret-down control-legend-hide', controlTitleDiv);
    this.iconOpenAll.title = "Ouvrir tous";

    this.iconChangeVisibility = L.DomUtil.create('i', 'fa-regular fa-square-minus control-legend-hide', controlTitleDiv);
    this.iconChangeVisibility.title = "Cacher le menu legende";

    this.contentDiv = L.DomUtil.create('div', 'control-legend-content', this.div);

    let descriptionViz = L.DomUtil.create('div', '', this.contentDiv);
    descriptionViz.innerHTML = `<i>${description.replaceAll("\n", "<br/>")}</i>`;

    // Content Legende
    let sourceDiv = [];
    for(let i = 0; i < sources.length; i++) {
      if(sources[i]) {
        sourceDiv.push(L.DomUtil.create('div', 'control-legend-layer', this.contentDiv));

        let titleLayerDiv = L.DomUtil.create('div', 'control-legend-layer-title', sourceDiv[sourceDiv.length - 1]);
        titleLayerDiv.title = `${sources[i].name} - ouvrir/fermer`;

        let divTitleIcon = L.DomUtil.create('i', 'fa-solid fa-angle-down', titleLayerDiv);

        let title = L.DomUtil.create('h3', '', titleLayerDiv);
        title.innerHTML = `${sources[i].name}`;

        // Content for layer
        let contentLayerDiv = L.DomUtil.create('div', 'control-legend-layer-content hide', sourceDiv[sourceDiv.length - 1]);

        if(sources[i].description) {
          let description = L.DomUtil.create('p', '', contentLayerDiv);
          description.innerHTML = `${sources[i].description.replaceAll("\n", "<br/>")}`;
        }

        // Add styles
        if(sources[i].style) {
          let defaultStyleDiv = L.DomUtil.create('div', 'control-legend-layer-style-line', contentLayerDiv);
          if(sources[i].type == "polyline") {     
            this.addStylePolyline(sources[i].style, defaultStyleDiv);
          }
          else if(sources[i].type == "polygon") {
            this.addStylePolygon(sources[i].style, defaultStyleDiv);
          }
          else if(sources[i].type == "point") {
            this.addStyleIcon(sources[i].style, defaultStyleDiv);
          }
        
          let descriptionStyle = L.DomUtil.create('p', 'control-legend-layer-style-description', defaultStyleDiv);
          descriptionStyle.innerHTML = "Style par defaut";
        }
        this.addCustomStyles(sources[i].style, sources[i].customStyles, sources[i].customPropVariables, contentLayerDiv, sources[i].type);

        L.DomEvent.on(titleLayerDiv, 'click', function(e) { this.hideLayerContent(e, divTitleIcon, contentLayerDiv); }, this);
      }
    }

    L.DomEvent.addListener(this.div, 'dblclick', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mousedown', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mouseup', L.DomEvent.stop);

    L.DomEvent.on(this.iconChangeVisibility, 'click', function(e) { this.changeVisibility(this.contentDiv, this.iconChangeVisibility, this.iconOpenAll) }, this);

    L.DomEvent.on(this.iconOpenAll, 'click', function(e) { this.openAllContentMenu(this.iconOpenAll); }, this);
  },

  /*
   * Update display style for polyline
   * @param {object} - styleParams - Params of display
   * @param {L.DomUtil} - styleDiv - Div of the style
   */
  addStylePolyline(styleParams, styleDiv) 
  {
    let styleCustom = L.DomUtil.create('div', 'control-legend-layer-polyline', styleDiv);
    if(styleParams.color) {
      styleCustom.style["background-color"] = styleParams.color;
    }
    else {
      styleDiv.style["display"] = "none";
    }
  },

  /*
   * Update display style for polygon
   * @param {object} - styleParams - Params of display
   * @param {L.DomUtil} - styleDiv - Div of the style
   */
  addStylePolygon(styleParams, styleDiv) 
  {
    let styleCustom = L.DomUtil.create('div', 'control-legend-layer-polygon', styleDiv);

    if(styleParams) {
      if(styleParams.fillColor) {
        if(styleParams.fillColor.startsWith("#") && styleParams.fillOpacity) {
          //styleCustom.style["backgroundColor"] = styleParams.fillColor + (parseInt(styleParams.fillOpacity) * 100).toString(16).toString("00");
          let opacity = (parseFloat(styleParams.fillOpacity) * 100).toString(16);
          opacity = opacity.length == 2 ? opacity : opacity + "0";
          styleCustom.style["backgroundColor"] = styleParams.fillColor + opacity;
        }
        else {
          styleCustom.style["backgroundColor"] = styleParams.fillColor;
        }
      }

      /*
      if(styleParams.weight) {
        styleCustom.style["borderWidth"] = styleCustom.weight + "px";
      }
      if(styleParams.color) {
        styleCustom.style["borderColor"] = styleCustom.color;
      }
      */
      if(styleParams.weight && styleParams.color) {
        styleCustom.style["border"] = styleParams.weight + "px solid " + styleParams.color;
      }

      if(!styleParams.color && !styleParams.fillColor) {
        styleDiv.style["display"] = "none";
      }
    }
  },

  /*
   * Update display style for icon (point)
   * @param {object} - styleParams - Params of display
   * @param {L.DomUtil} - styleDiv - Div of the style
   */
  addStyleIcon(styleParams, styleDiv) 
  {
    if(styleParams) {
      if(styleParams.icon) {
        if(styleParams.icon.type == "font") {
          let styleCustom = L.DomUtil.create('i', '', styleDiv);
          styleCustom.className = styleParams.icon.value;

          if(styleParams.color) {
            styleCustom.style["color"] = styleParams.color;
          }
          if(styleParams.backgroundColor) {
            styleCustom.style["background-color"] = styleParams.backgroundColor;
          }
        }
        else {
          let styleCustom = L.DomUtil.create('img', 'control-legend-layer-point', styleDiv);
          styleCustom.src = window.location.href.split("?")[0] + "/" + styleParams.icon.value;

          if(styleParams.color) {
            const colorObj = new LeafletColorIconColorObj(styleParams.color);
            const solver = new LeafletColorIconSolver(colorObj);
            const resultSolver = solver.solve();

            styleCustom.style = resultSolver.filter;
          }
        }
      }
    }
  },

  /*
   * Add the custom styles of a layer
   * @param {object} - defaultStyle - The default style params
   * @param {object} - customStyles - The custom style params
   * @param {object} - customPropVariables - The custom prop sources variables
   * @param {L.DomUtil} - contentLayerDiv - The content div of the layer
   * @param {string} - type - The type of source
   */
  addCustomStyles(defaultStyle, customStyles, customPropVariables, contentLayerDiv, type) 
  {
    if(customStyles) {
      customStyles.forEach((customStyle) => {
        if(customStyle.values) {
          customStyle.values.forEach((value) => {

            let condition = "=";
            if(value.condition) {
              condition = value.condition;
            }

            let customStyleDiv = L.DomUtil.create('div', `control-legend-layer-style-line`, contentLayerDiv);

            let style = Object.assign({}, Object.assign(defaultStyle, value.style));
            if(type == "polyline") {
              this.addStylePolyline(style, customStyleDiv);
            }
            else if(type == "polygon") {
              this.addStylePolygon(style, customStyleDiv);
            }
            else if(type == "point") {
              this.addStyleIcon(style, customStyleDiv);
            }

            let descriptionCustom = L.DomUtil.create('p', 'control-legend-layer-style-description', customStyleDiv);
            descriptionCustom.innerHTML = `<strong>${customStyle.prop}</strong> ${condition} ${value.value}`;
          });
        }
        else if(customStyle.type == "variable") {
          if(customPropVariables) {
            for(let i = 0; i < customPropVariables.length; i++) {
              let customStyleDiv = L.DomUtil.create('div', `control-legend-layer-style-line`, contentLayerDiv);
              
              if(type == "polyline") {
                this.addStylePolyline(customPropVariables[i].styleObj, customStyleDiv);
              }

              let descriptionCustom = L.DomUtil.create('p', 'control-legend-layer-style-description', customStyleDiv);
              descriptionCustom.innerHTML = `<strong>${customStyle.propStyle}</strong> = ${customPropVariables[i].valueProp}`;
            }
          }
        }
      });
    }
  },

  /*
   * Change visibility of the legend control content
   * @param {L.DomUtil} - contentDiv - The content of control div
   * @param {L.DomUtil} - iconChangeVisibility - Icon for change visibility
   * @param {L.DomUtil} - iconOpenAll - Icon for open/close all layer content
   */
  changeVisibility : function(contentDiv, iconChangeVisibility, iconOpenAll) 
  {
    if(contentDiv.style["display"] == "none")
    {
      contentDiv.style["display"] = "inline";
      this.div.style["background"] = "rgba(255, 255, 255, 1)";
      iconChangeVisibility.className = "fa-regular fa-square-minus control-legend-hide";
      iconOpenAll.style["display"] = "inline-block";
    }
    else
    {
      contentDiv.style["display"] = "none";
      this.div.style["background"] = "rgba(255, 255, 255, 0.5)";
      iconChangeVisibility.className = "fa-regular fa-square-plus control-legend-hide";
      iconOpenAll.style["display"] = "none";
    }
  },

  /*
   * Open/Close all layer content
   * @param {L.DomUtil} - iconOpenAll - Icon for open/close all layer content
   */
  openAllContentMenu: function(iconOpenAll) 
  {
    if(iconOpenAll.className.includes('fa-square-caret-down')) {
      iconOpenAll.className = "fa-regular fa-square-caret-up control-legend-hide";

      var elements = document.getElementsByClassName("control-legend-layer-content");
      for(let i = 0; i < elements.length; i++) {
        if(elements[i].className.includes("hide")) {
          elements[i].className = elements[i].className.replace(' hide','');
        }
      }

      var icons = this.div.getElementsByClassName("fa-angle-down");
      if(icons.length > 0) {
        do {
          icons[0].className = "fa-solid fa-angle-up";
        } while(icons.length > 0)
      }
    }
    else {
      iconOpenAll.className = "fa-regular fa-square-caret-down control-legend-hide";

      var elements = document.getElementsByClassName("control-legend-layer-content");
      for(let i = 0; i < elements.length; i++) {
        if(!elements[i].className.includes("hide")) {
          elements[i].className += ' hide';
        }
      }

      var icons = this.div.getElementsByClassName("fa-angle-up");
      if(icons.length > 0) {
        do {
          icons[0].className = "fa-solid fa-angle-down";
        } while(icons.length > 0)
      }
    }
  },

  /*
   * Hide a content of a layer style
   * @params {Event} - e - Html event
   * @params {L.DomUtil} - titleIconDiv - Icon of the title
   * @params {L.DomUtil} - contentDiv - Content of the group div
   */
  hideLayerContent : function(e, titleIconDiv, contentDiv) 
  {
    if(!contentDiv.className.includes("hide"))
    {
      contentDiv.className = contentDiv.className + " hide";
      titleIconDiv.className = "fa-solid fa-angle-down";
    }
    else
    {
      contentDiv.className = contentDiv.className.replace(' hide','');
      titleIconDiv.className = "fa-solid fa-angle-up";
    }
  },

  /*
   * Hide the legend control
   */
  hide : function()
  {
    this.div.style["display"] = "none";
  },

  /*
   * Add control to the map and init html
   * @params {L.Map} - map
   */
  onAdd: function(map) 
  {
    this.map = map;

    return this.div;
  },

  /*
   * Remove control
   * @params {L.Map} - map
   */
  onRemove: function(map)
  {
  }
});