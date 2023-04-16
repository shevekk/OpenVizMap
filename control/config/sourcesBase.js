// sources.js

SimpleGIS.Control.Config.SourcesBase = class SourcesBase extends SimpleGIS.Control.Config.ListConfig
{
  /**
   * @param {Object} - configurationContentDiv - HTML element
   * @param {Object} - fileContentConfigObj - Object of content
   * @param {string[]} - arraySVG - List of all svg url
   * @param {string} - objName - Name of the fileContentConfigObj object
   */
  constructor(configurationContentDiv, fileContentConfigObj, arraySVG, objName) 
{
    super();

    let me = this;

    this.fileContentConfigObj = fileContentConfigObj;
    this.arraySVG = arraySVG;
    this.objName = objName;

    // Create HTML
    let htmlContent = ``;
    fileContentConfigObj[objName].forEach(source => {
      htmlContent += this.addBlock(source.reference, source.name, source, "none");
    });
    let html = `<div class="page-form config-page-content"><div id='config-list-all-content'>${htmlContent}</div><button class="button is-success" id="config-list-add">Ajouter une source</button></div>`;

    configurationContentDiv.innerHTML = html;

    this.styles = {};
    this.stylesCustomValueStyle = {};

    fileContentConfigObj[objName].forEach(source => {
      this.initStyle(source.reference, source.type, source.style);
    });

    // Manage customStyle values events
    let customStyleValuesDiv = document.getElementsByClassName("config-source-customStyle-value-nav");
    Array.from(customStyleValuesDiv).forEach(function(element) {
      me.manageEventsCustomStyleValue(element, document.getElementById(`config-source-customStyle-value|${element.id.split("|")[1]}|${element.id.split("|")[2]}|${element.id.split("|")[3]}`));
    });

    // Manage customStyle events
    let customStyleNavDiv = document.getElementsByClassName("config-source-customStyle-nav");
    Array.from(customStyleNavDiv).forEach(function(element) {
      me.manageEventsCustomStyle(element, document.getElementById(`config-source-customStyle-prop|${element.id.split("|")[1]}|${element.id.split("|")[2]}`));
    });

    // 
    fileContentConfigObj[objName].forEach(source => {
      let reference = source.reference;

      for(let i = 0; source.customStyles && i < source.customStyles.length; i++)
      {
        for(let j = 0; source.customStyles[i].values && j < source.customStyles[i].values.length; j++)
        {
          me.initCustomStyleValueStyle(reference, i, j, source.type, source.customStyles[i].values[j].style);
        }
      }
    });

    // Change type of styles
    let customStyleTypes = document.getElementsByClassName("config-source-customStyle-type");
    Array.from(customStyleTypes).forEach(function(element) {
      me.manageChangeTypeCustomStyle(element);
    });

    // Manage customStyle value delete
    let configCustomStyleValueDelete = document.getElementsByClassName("config-customStyle-value-delete");
    Array.from(configCustomStyleValueDelete).forEach(function(element) {
      me.deleteCustomStyleValue(element);
    });

    // Manage customStyle delete
    let configCustomStyleDelete = document.getElementsByClassName("config-customStyle-delete");
    Array.from(configCustomStyleDelete).forEach(function(element) {
      me.deleteCustomStyle(element);
    });

    // Manage button add customStyle value
    let configCustomStyleValueAdd = document.getElementsByClassName("config-source-customStyle-value-nav-add");
    Array.from(configCustomStyleValueAdd).forEach(function(element) {
      me.addCustomStyleValue(element);
    });

    // Manage customStyle add
    let configCustomStyleAdd = document.getElementsByClassName("config-source-customStyle-nav-add");
    Array.from(configCustomStyleAdd).forEach(function(element) {
      me.addCustomStyle(element);
    });

    // PopUp manage add button clic
    let configAddPopUpProp = document.getElementsByClassName("config-source-popup-props-add");
    Array.from(configAddPopUpProp).forEach(function(element) {
      me.manageAddPopUpProp(element);
    });

    // PopUp manage enable button clic
    let configPopUpEnable = document.getElementsByClassName("config-source-popup-enable");
    Array.from(configPopUpEnable).forEach(function(element) {
      me.manageEnablePopUp(element);
    });

    // PopUp manage delete property
    let configdPopUpPropsDelete = document.getElementsByClassName("config-source-popup-props-delete");
    Array.from(configdPopUpPropsDelete).forEach(function(element) {
      me.manageDeletePopUpProp(element);
    });

    this.initEvents(me.manageEventsOnAdd);
  }

  /**
   * Function call if add 
   * @param {string} - reference - 
   * @param {Class} - scope - 
   */
  manageEventsOnAdd(reference, scope)
  {
    scope.initStyle(reference, "point", {});
    scope.addCustomStyle(document.getElementById(`config-source-customStyle-nav-add|${reference}`));
    scope.manageEnablePopUp(document.getElementById(`config-source-popup-enable|${reference}`));
    scope.manageAddPopUpProp(document.getElementById(`config-source-popup-props-add|${reference}`));
  }

  /**
   * Init style div content and manage change of type
   * @param {string} - reference - 
   * @param {string} - type - Type of style
   * @param {object} - style - The style config object content
   */
  initStyle(reference, type, style)
  {
    if(type == "point") {
      style = style && Object.keys(style).length !== 0 ? style : this.fileContentConfigObj.params.default.marker;
      this.styles[reference] = new SimpleGIS.Control.Config.StylePoint(document.getElementById(`config-style-div|${reference}`), style, reference);
      this.styles[reference].setArraySVG(this.arraySVG);
    }
    else if(type == "polyline") {
      this.styles[reference] = new SimpleGIS.Control.Config.StylePolyline(document.getElementById(`config-style-div|${reference}`), style, reference);
    }
    else if(type == "polygon") {
      this.styles[reference] = new SimpleGIS.Control.Config.StylePolygon(document.getElementById(`config-style-div|${reference}`), style, reference);
    }

    // Manage change of style type
    document.getElementById(`config-source-type|${reference}`).addEventListener('change', event => {
      if(event.target.value == "point") {
        style = style && Object.keys(style).length !== 0 ? style : this.fileContentConfigObj.params.default.marker;
        this.styles[reference] = new SimpleGIS.Control.Config.StylePoint(document.getElementById(`config-style-div|${reference}`), style, reference);
        this.styles[reference].setArraySVG(this.arraySVG);
      }
      else if(event.target.value == "polyline") {
        this.styles[reference] = new SimpleGIS.Control.Config.StylePolyline(document.getElementById(`config-style-div|${reference}`), style, reference);
      }
      else if(event.target.value == "polygon") {
        this.styles[reference] = new SimpleGIS.Control.Config.StylePolygon(document.getElementById(`config-style-div|${reference}`), style, reference);
      }
    });
  }

  /**
   * Init style of a customStyle value div content and manage change of type
   * @param {string} - reference - 
   * @param {number} - numberCustomStyle - 
   * @param {number} - numberValue - Number of a customStyle Value
   * @param {string} - type - Type of style
   * @param {object} - style - The style config object content
   */
  initCustomStyleValueStyle(reference, numberCustomStyle, numberValue, type, style)
  {
    if(!this.stylesCustomValueStyle[reference]) {
      this.stylesCustomValueStyle[reference] = {};
    }
    if(!this.stylesCustomValueStyle[reference][numberCustomStyle]) {
        this.stylesCustomValueStyle[reference][numberCustomStyle] = {};
    }

    style = style && Object.keys(style).length !== 0 ? style : this.styles[reference].getContentConfigObj();

    if(type == "point") {
      style = style && Object.keys(style).length !== 0 ? style : this.fileContentConfigObj.params.default.marker;
      this.stylesCustomValueStyle[reference][numberCustomStyle][numberValue] = new SimpleGIS.Control.Config.StylePoint(document.getElementById(`config-customStyle-value-style-div|${reference}|${numberCustomStyle}|${numberValue}`), style, reference, numberCustomStyle, numberValue);
      this.stylesCustomValueStyle[reference][numberCustomStyle][numberValue].setArraySVG(this.arraySVG);
    }
    else if(type == "polyline") {
      this.stylesCustomValueStyle[reference][numberCustomStyle][numberValue] = new SimpleGIS.Control.Config.StylePolyline(document.getElementById(`config-customStyle-value-style-div|${reference}|${numberCustomStyle}|${numberValue}`), style, reference, numberCustomStyle, numberValue);
    }
    else if(type == "polygon") {
      this.stylesCustomValueStyle[reference][numberCustomStyle][numberValue] = new SimpleGIS.Control.Config.StylePolygon(document.getElementById(`config-customStyle-value-style-div|${reference}|${numberCustomStyle}|${numberValue}`), style, reference, numberCustomStyle, numberValue);
    }

    // Manage change of style type
    document.getElementById(`config-source-type|${reference}`).addEventListener('change', event => {
      if(event.target.value == "point") {  
        this.stylesCustomValueStyle[reference][numberCustomStyle][numberValue] = new SimpleGIS.Control.Config.StylePoint(document.getElementById(`config-customStyle-value-style-div|${reference}|${numberCustomStyle}|${numberValue}`), style, reference, numberCustomStyle, numberValue);
        this.stylesCustomValueStyle[reference][numberCustomStyle][numberValue].setArraySVG(this.arraySVG);
      }
      else if(event.target.value == "polyline") {
        style = style && Object.keys(style).length !== 0 ? style : this.fileContentConfigObj.params.default.marker;
        this.stylesCustomValueStyle[reference][numberCustomStyle][numberValue] = new SimpleGIS.Control.Config.StylePolyline(document.getElementById(`config-customStyle-value-style-div|${reference}|${numberCustomStyle}|${numberValue}`), style, reference, numberCustomStyle, numberValue);
      }
      else if(event.target.value == "polygon") {
        this.stylesCustomValueStyle[reference][numberCustomStyle][numberValue] = new SimpleGIS.Control.Config.StylePolygon(document.getElementById(`config-customStyle-value-style-div|${reference}|${numberCustomStyle}|${numberValue}`), style, reference, numberCustomStyle, numberValue);
      }
    });
  }

  /**
   * Add a new block
   * @param {string} - reference
   * @param {string} - name
   * @param {object} - object - The object content
   * @param {string} - display - Value of the content display style prop
   */
  addBlock(reference, name, object, display) 
  {
    let typeOptions = `<option value="point" ${object && object.type && object.type=="point" ? "selected" : ""}>Point</option>
              <option value="polyline" ${object && object.type && object.type=="polyline" ? "selected" : ""}>Polyline</option>
              <option value="polygon" ${object && object.type && object.type=="polygon" ? "selected" : ""}>Polygon</option>`;

    let contentAutoload = `<label class="radio"><input type="radio" name="config-source-autoload|${reference}" id="config-source-autoload-yes|${reference}" ${object && object.autoload ? "checked" : ""}> Oui</label>
      <label class="radio"><input type="radio" name="config-source-autoload|${reference}" id="config-source-autoload-no|${reference}" ${object && !object.autoload ? "checked" : ""}> Non</label>`;

    let typeGroup = `<option value="" ${!object || !object.group || object.group=="" ? "selected" : ""}>[Aucun]</option>`;
    this.fileContentConfigObj.sourcesGroups.forEach(group => typeGroup += `<option value="${group.reference}" ${object && object.group && object.group==group.reference ? "selected" : ""}>${group.name}</option>`);

    //
    let contentPopUpProps = ``;
    let contentDescriptionBolds = ``;
    let contentDescriptionItalics = ``;

    for(let i = 0; object.popup && object.popup.props && i < object.popup.props.length; i++) {
      contentPopUpProps += this.addSourceContentPopUpProps(reference, object.popup.props[i], i, object.popup);
    }

    let content = `<div class="field is-horizontal" title="Référence de la source">
            <div class="field-label is-normal">
              <label class="label">Référence </label>
            </div>
            <div class="field-body">
                <div class="field">
                  <p class="control">
                <input class="input group-reference" id="config-source-reference|${reference}" type="text" placeholder="Référence de la source" value="${reference}">
              </p>
              </div>
            </div>
          </div>

          <div class="field is-horizontal" title="Nom de la source">
            <div class="field-label is-normal">
              <label class="label">Nom </label>
            </div>
            <div class="field-body">
                <div class="field">
                  <p class="control">
                <input class="input config-list-name" type="text" id="config-source-name|${reference}"  placeholder="Nom de la source" value="${name}">
              </p>
              </div>
            </div>
          </div>

          <div class="field is-horizontal" title="Type de la source">
            <div class="field-label is-normal">
              <label class="label">Type</label>
            </div>
            <div class="field-body">
                <div class="field">
                  <p class="control">
                <select class="select" id="config-source-type|${reference}">
                  ${typeOptions}
                </select>
              </p>
              </div>
              </div>
          </div>`;

          content += this.addSpeBlock(reference, name, object);

          content += `<div class="field is-horizontal" title="Description de la source (affichée dans la légende)">
            <div class="field-label is-normal">
              <label class="label">Description </label>
            </div>
            <div class="field-body">
                <div class="field">
                  <p class="control">
                <textarea class="textarea" id="config-source-description|${reference}" placeholder="Description de la source (affichée dans la légende)">${object.description ? object.description : ""}</textarea>
              </p>
              </div>
            </div>
          </div>

          <div class="field is-horizontal" title="Chargement de la source au chargement de la carte">
              <div class="field-label" style="flex:2"><label class="label">Autoload</label></div>
              <div class="field-body">
                <div class="field is-narrow">
                  <p class="control">
                ${contentAutoload}
              </p>
             </div>
            </div> 
          </div>

          <div class="field is-horizontal" title="Groupe liée à la source">
            <div class="field-label is-normal">
              <label class="label">Groupe </label>
            </div>
            <div class="field-body">
                <div class="field">
                  <p class="control">
                <select class="select" id="config-source-group|${reference}">
                  ${typeGroup}
                </select>
              </p>
              </div>
              </div>
          </div>

          <fieldset class="fieldset" id="config-source-popup-fieldset|${reference}" title="">
            <legend> Personnalisation de la pop-up </legend>

            <div class="field is-horizontal" title="Liste des propriétés de la pop-up" id="config-source-popup-div|${reference}">
              <div class="field-label is-normal" style="flex:1">
                <label class="label">Propriétés</label>
              </div>
              <div class="field-body" style="flex-direction: column;">
                <div><input class="config-source-popup-enable" type="checkbox" class="checkbox" id="config-source-popup-enable|${reference}" ${object.popup && object.popup.props && object.popup.props.length > 0 ? "checked" : ""} title="Active/désactive la sélection de propriété de la pop-up"><label class="config-source-popup-enable-label" for="config-source-popup-enable|${reference}">Activé</label></div>
                <div class="field" id="config-source-popup-props|${reference}">
                    ${contentPopUpProps}
                </div>
                <button class="button is-success config-source-popup-props-add" style="margin-top:4px" id="config-source-popup-props-add|${reference}" ${object.popup && object.popup.props && object.popup.props.length > 0 ? "" : "disabled"} title="Ajout d'une propriété à la pop-up">Ajouter une propriété</button>
              </div>
            </div>
          </fieldset>

          <div id="config-style-div|${reference}"></div><br/>`;

      // Custom styles
      content += `<label class="label">Styles personnalisés :</label>`;
      let navbarItemCustomStyle = ``;
      for(let i = 0; object.customStyles && i < object.customStyles.length; i++)
      {
        let className = i == 0 ? "navbar-item navbar-item-selected" : "navbar-item";
        navbarItemCustomStyle += `<a class="${className} config-source-customStyle-nav config-source-customStyle-nav|${reference}" id="config-source-customStyle-nav|${reference}|${i}"><div id="config-source-customStyle-nav-text|${reference}|${i}">${object.customStyles[i].prop}</div><button class="delete config-customStyle-delete" id="config-source-customStyle-nav-del|${reference}|${i}"></button></a>`;
      }

      navbarItemCustomStyle += `<a class="navbar-item config-source-customStyle-nav-add" id="config-source-customStyle-nav-add|${reference}" title="Ajout d'un style personalisé">
              <i class="fa-solid fa-plus"></i>
            </a>`

      let contentCustomStyle = "";
      for(let i = 0; object.customStyles && i < object.customStyles.length; i++)
      {
        contentCustomStyle += this.addBlockCustomStyle(object.customStyles[i], i, reference, i == 0 ? "flex" : "none");
      }

      content += `<nav class="navbar is-info" role="navigation">
                    <div class="navbar-menu" style="flex-shrink:1">
                      <div class="navbar-start" class="navbar-start config-source-customStyle-navbar" id="config-source-customStyle-content-nav|${reference}">
                        ${navbarItemCustomStyle}
                      </div>
                    </div>
                  </nav>
                  <div class="config-source-customStyle-content-div" id="config-source-customStyle-content-div|${reference}">${contentCustomStyle}</div>`;

    return this.createBlock(reference, name, display, content);
  }

  /**
   * Create a HTML pop-up propertie line for source
   * @param {string} - reference
   * @param {string} - content - The text content
   * @param {number} - i - Number of the element
   * @param {object} - popupParams - all pop-up param for the source
   */
  addSourceContentPopUpProps(reference, content, i, popupParams)
  {
    let isBold = popupParams.bolds && popupParams.bolds.includes(content);
    let isItalic = popupParams.italics && popupParams.italics.includes(content);

    return `<div class="field" id="conf-source-popup-props-div|${reference}|${i}">
              <p class="control config-source-popup-props-line">
                <input type="text" class="input conf-source-popup-input|${reference} conf-source-popup-props|${reference}" id="conf-source-popup-props|${reference}|${i}" value="${content}" placeholder="Nom de la propriété" />
                <button class="delete conf-source-popup-input|${reference} config-source-popup-props-delete config-source-popup-props-delete|${reference}" id="config-source-popup-props-delete|${reference}|${i}" style="margin-left:5px;"></button>
                <input class="conf-source-popup-input|${reference} config-source-popup-bold" type="checkbox" class="checkbox" id="config-source-popup-bold|${reference}|${i}" ${isBold ? "checked" : ""}><label class="config-source-popup-bold-label" for="config-source-popup-bold|${reference}|${i}">Gras</label>
                <input class="conf-source-popup-input|${reference} config-source-popup-italic" type="checkbox" class="checkbox" id="config-source-popup-italic|${reference}|${i}" ${isItalic ? "checked" : ""}><label class="config-source-popup-italic-label" for="config-source-popup-italic|${reference}|${i}">Italique</label>
              </p>
            </div>`;
  }

  /**
   * Add a new customStyle block
   * @param {object} - customStyle - customStyle object
   * @param {number} - number - number of the customStyle
   * @param {string} - reference
   * @param {string} - display - Value of the content display style prop
   */
  addBlockCustomStyle(customStyle, number, reference, display) 
  {
    let typeCustomStyle = `<option value="prop" ${!customStyle || !customStyle.type || customStyle.type=="prop" ? "selected" : ""}>Propriétés</option>`;
    typeCustomStyle += `<option value="variable" ${customStyle && customStyle.type && customStyle.type=="variable" ? "selected" : ""}>Variable</option>`;

    let content = `<div style="display:${display};flex-direction: column" id="config-source-customStyle-div|${reference}|${number}" class="config-source-customStyle-div config-source-customStyle-div|${reference}"> 
      <div class="field is-horizontal" title="Type de style personnalisé">
        <div class="field-label is-normal">
          <label class="label">Type</label>
        </div>
        <div class="field-body">
            <div class="field">
              <p class="control">
            <select class="select config-source-customStyle-type" id="config-source-customStyle-type|${reference}|${number}">
              ${typeCustomStyle}
            </select>
          </p>
          </div>
          </div>
      </div>

      <div class="field is-horizontal" title="Propriété cible">
        <div class="field-label is-normal">
          <label class="label">Propriété</label>
        </div>
        <div class="field-body">
            <div class="field">
              <p class="control">
                <input class="input" type="text" id="config-source-customStyle-prop|${reference}|${number}" placeholder="Propriété cible" value="${customStyle.prop ? customStyle.prop : ""}">
              </p>
          </div>
        </div>
      </div>

      <div id="config-source-customStyle-div-content|${reference}|${number}" class="config-source-customStyle-div-content">
    `
    if(customStyle.type && customStyle.type == "variable") {
      content += this.addBlockCustomStyleVariable(customStyle, number, reference);
    }
    else {
      content += this.addBlockCustomStyleProp(customStyle, number, reference);
    }

    content += `</div></div>`;

    return content;
  }

  /**
   * Add a new customStyle block variable part
   * @param {object} - customStyle - customStyle object
   * @param {number} - number - number of the customStyle
   * @param {string} - reference
   */
  addBlockCustomStyleVariable(customStyle, number, reference) 
  {
    let propStyle = `<option value="color" ${!customStyle || !customStyle.propStyle || customStyle.propStyle=="color" ? "selected" : ""}>Couleur</option>
                    <option value="weight" ${!customStyle || !customStyle.propStyle || customStyle.propStyle=="weight" ? "selected" : ""}>Taille des bordures ou de la ligne</option>
                    <option value="size" ${!customStyle || !customStyle.propStyle || customStyle.propStyle=="size" ? "selected" : ""}>Taille (si point)</option>
                    <option value="fillColor" ${!customStyle || !customStyle.propStyle || customStyle.propStyle=="fillColor" ? "selected" : ""}>Couleur de remplissage (si polygone)</option>
                    <option value="fillOpacity" ${!customStyle || !customStyle.propStyle || customStyle.propStyle=="fillOpacity" ? "selected" : ""}>Opacité du remplissage (si polygone)</option>`;

    let propValueType = `<option value="text" ${!customStyle || !customStyle.type || customStyle.valueType=="text" ? "selected" : ""}>Texte</option>
                        <option value="number" ${!customStyle || !customStyle.type || customStyle.valueType=="number" ? "selected" : ""}>Nombre</option>`;

    let content = `
      <div class="field is-horizontal" title="Propriété de style qui sera modifié">
        <div class="field-label is-normal">
          <label class="label">Propriété de style</label>
        </div>
        <div class="field-body">
            <div class="field">
              <p class="control">
                <select class="select" id="config-source-customStyle-propStyle|${reference}|${number}">
                  ${propStyle}
                </select>
              </p>
            </div>
          </div>
        </div>

        <div class="field is-horizontal" title="Valeur de la propriété, le \${0}\ sera remplacée par la valeur de la propriété de l'élément">
          <div class="field-label is-normal">
            <label class="label">Valeur</label>
          </div>
          <div class="field-body">
              <div class="field">
                <p class="control">
                  <input class="input" type="text" id="config-source-customStyle-propValue|${reference}|${number}" placeholder="Valeur de la propriété, le \${0}\ sera remplacée par la valeur de la propriété" value="${customStyle.value ? customStyle.value : ""}">
                </p>
            </div>
          </div>
        </div>

        <div class="field is-horizontal" title="">
        <div class="field-label is-normal">
          <label class="label">Type de valeur</label>
        </div>
        <div class="field-body">
            <div class="field">
              <p class="control">
                <select class="select" id="config-source-customStyle-valueType|${reference}|${number}">
                  ${propValueType}
                </select>
              </p>
            </div>
          </div>
        </div>`;

    return content;
  }

  /**
   * Add a new customStyle block property part
   * @param {object} - customStyle - customStyle object
   * @param {number} - number - number of the customStyle
   * @param {string} - reference
   */
  addBlockCustomStyleProp(customStyle, number, reference) 
  {
    let content = ``;

    let navbarItemValues = ``;
    let valuesContent = ``;
    for(let i = 0; customStyle.values && i < customStyle.values.length; i++)
    {
      let className = i == 0 ? "navbar-item navbar-item-selected" : "navbar-item";
      navbarItemValues += `<a class="${className} config-source-customStyle-value-nav config-source-customStyle-value-nav|${reference}" id="config-source-customStyle-value-nav|${reference}|${number}|${i}"><div id="config-source-customStyle-value-nav-text|${reference}|${number}|${i}">${customStyle.values[i].value}</div><button class="delete config-customStyle-value-delete" id="config-source-customStyle-value-nav-del|${reference}|${number}|${i}"></button></a>`;
      valuesContent += this.addBlockCustomStyleValue(customStyle.values[i], number, i, reference, i == 0 ? "flex" : "none");
    }

    navbarItemValues += `<a class="navbar-item config-source-customStyle-value-nav-add" id="config-source-customStyle-value-nav-add|${reference}|${number}" title="Ajout d'une valeur">
              <i class="fa-solid fa-plus"></i>
            </a>`

    content += `<nav class="navbar is-info" role="navigation">
            <div class="navbar-menu" style="flex-shrink:1">
              <div class="navbar-start config-source-customStyle-value-navbar" id="config-source-customStyle-value-content-nav|${reference}|${number}">
                ${navbarItemValues}
              </div>
            </div>
          </nav>
          <div id="config-source-customStyle-value-content-div|${reference}|${number}" class="config-source-customStyle-value-content-div">${valuesContent}</div>`;

    return content;
  }

  /**
   * Add a new button for add a CustomStyle Value
   * @param {string} - reference - 
   * @param {number} - number - Number of customStyle 
   */
  addButtonAddCustomStyleValue(reference, number)
  {
    let navElement = document.createElement("a");
    navElement.className = "navbar-item config-source-customStyle-value-nav-add";
    navElement.id = `config-source-customStyle-value-nav-add|${reference}|${number}`;
    navElement.title = "Ajout d'une valeur"
    navElement.innerHTML = `<i class="fa-solid fa-plus"></i>`;
    return navElement;
  }

  /**
   * Add a new button for add a CustomStyle
   * @param {string} - reference - 
   */
  addButtonAddCustomStyle(reference)
  {
    let navElement = document.createElement("a");
    navElement.className = "navbar-item config-source-customStyle-nav-add";
    navElement.id = `config-source-customStyle-nav-add|${reference}`;
    navElement.title = "Ajout d'un style personalisé"
    navElement.innerHTML = `<i class="fa-solid fa-plus"></i>`;
    return navElement;
  }

  /**
   * Add a new button for add a CustomStyle
   * @param {object} - customStyleValue - CustomStyle Value config object
   * @param {number} - numberCustomStyle - 
   * @param {number} - number - number of CustomStyle Value
   * @param {string} - reference - 
   * @param {string} - display - Value of the content display style prop
   */
  addBlockCustomStyleValue(customStyleValue, numberCustomStyle, number, reference, display) 
  {
    let content = ``;

    let conditionOptions = `<option value="=" ${!customStyleValue || !customStyleValue.condition || customStyleValue.condition=="=" ? "selected" : ""}>=</option>`;
    conditionOptions += `<option value="!=" ${customStyleValue && customStyleValue.condition && customStyleValue.condition=="!=" ? "selected" : ""}>!=</option>`;
    conditionOptions += `<option value="<" ${customStyleValue && customStyleValue.condition && customStyleValue.condition=="<" ? "selected" : ""}><</option>`;
    conditionOptions += `<option value="<=" ${customStyleValue && customStyleValue.condition && customStyleValue.condition=="<=" ? "selected" : ""}><=</option>`;
    conditionOptions += `<option value=">=" ${customStyleValue && customStyleValue.condition && customStyleValue.condition==">=" ? "selected" : ""}>>=</option>`;
    conditionOptions += `<option value=">" ${customStyleValue && customStyleValue.condition && customStyleValue.condition==">" ? "selected" : ""}>></option>`;
    conditionOptions += `<option value="include" ${customStyleValue && customStyleValue.condition && customStyleValue.condition=="include" ? "selected" : ""}>include</option>`;

    content += `<div style="display:${display};flex-direction: column" id="config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${number}" class="config-source-customStyle-value-div config-source-customStyle-value-div|${reference}|${numberCustomStyle}">
      <div class="field is-horizontal" title="Valeur de la condition">
      <div class="field-label is-normal">
        <label class="label">Valeur</label>
      </div>
      <div class="field-body">
          <div class="field">
            <p class="control">
              <input class="input" type="text" id="config-source-customStyle-value|${reference}|${numberCustomStyle}|${number}" placeholder="Valeur cible" value="${customStyleValue.value ? customStyleValue.value : ""}">
            </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal" title="Type de condition">
      <div class="field-label is-normal">
        <label class="label">Condition</label>
      </div>
      <div class="field-body">
          <div class="field">
            <p class="control">
          <select class="select" id="config-source-customStyle-value-condition|${reference}|${numberCustomStyle}|${number}">
            ${conditionOptions}
          </select>
        </p>
        </div>
        </div>
    </div>

    <div id="config-customStyle-value-style-div|${reference}|${numberCustomStyle}|${number}"></div>

    </div>`;

    return content;
  }

  /**
   * Manage click on delete a customStyle value
   * @param {HTMLElement} - element - Delete element
   */
  deleteCustomStyle(element) 
  {
    element.addEventListener('click', event => {
      event.preventDefault();

      let reference = event.target.id.split("|")[1];
      let number = event.target.id.split("|")[2];

      // Change selection que si select 
      if(document.getElementById(`config-source-customStyle-div|${reference}|${number}`) && document.getElementById(`config-source-customStyle-div|${reference}|${number}`).style["display"] != "none") {
        let selectedOther = false;
        for(let i = 0; !selectedOther && i < 100020; i++) {
          if(document.getElementById(`config-source-customStyle-div|${reference}|${i}`) && document.getElementById(`config-source-customStyle-div|${reference}|${i}`).style["display"] == "none") {
            document.getElementById(`config-source-customStyle-div|${reference}|${i}`).style["display"] = "flex";
            document.getElementById(`config-source-customStyle-nav|${reference}|${i}`).className = "navbar-item navbar-item-selected";
            selectedOther = true;
          }
        }
      }
      
      document.getElementById(`config-source-customStyle-content-div|${reference}`).removeChild(document.getElementById(`config-source-customStyle-div|${reference}|${number}`));
      document.getElementById(`config-source-customStyle-nav|${reference}|${number}`).style["display"] = "none";
    });
  }

  /**
   * Manage click on delete a customStyle value
   * @param {HTMLElement} - element - Delete element
   */
  deleteCustomStyleValue(element) 
  {
    element.addEventListener('click', event => {
      event.preventDefault();

      let reference = event.target.id.split("|")[1];
      let numberCustomStyle = event.target.id.split("|")[2];
      let number = event.target.id.split("|")[3];

      // Change selection que si select 
      if(document.getElementById(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${number}`) && document.getElementById(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${number}`).style["display"] != "none") {
        let selectedOther = false;
        for(let i = 0; !selectedOther && i < 100020; i++) {
          if(document.getElementById(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${i}`) && document.getElementById(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${i}`).style["display"] == "none") {
            document.getElementById(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${i}`).style["display"] = "flex";
            document.getElementById(`config-source-customStyle-value-nav|${reference}|${numberCustomStyle}|${i}`).className = "navbar-item navbar-item-selected";
            selectedOther = true;
          }
        }
      }
      
      document.getElementById(`config-source-customStyle-value-content-div|${reference}|${numberCustomStyle}`).removeChild(document.getElementById(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${number}`));
      document.getElementById(`config-source-customStyle-value-nav|${reference}|${numberCustomStyle}|${number}`).style["display"] = "none";
    });
  }

  /**
   * Manage event of add a new CustomStyle Block
   * @param {HTMLElement} - element - CustomStyle add HTML element
   */
  addCustomStyle(element)
  {
    element.addEventListener('click', event => {
      event.preventDefault();

      let reference = element.id.split("|")[1];
      let number = 20 + Math.floor(Math.random() * 100000);

      let configCustomStyleDivs = document.getElementsByClassName(`config-source-customStyle-div|${reference}`);
      Array.from(configCustomStyleDivs).forEach(function(element) {
        element.style["display"] = "none";
      });
      let configCustomStyleNavs = document.getElementsByClassName(`config-source-customStyle-nav|${reference}`);
      Array.from(configCustomStyleNavs).forEach(function(element) {
        element.className = "navbar-item";
      });

      // Change selection que si select 
      let selectedOther = false;
      for(let i = 0; !selectedOther && i < 100020; i++) {
        if(document.getElementById(`config-source-customStyle-div|${reference}|${i}`) && document.getElementById(`config-source-customStyle-div|${reference}|${i}`).style["display"] != "none") {
          document.getElementById(`config-source-customStyle-div|${reference}|${i}`).style["display"] = "none";
          document.getElementById(`config-source-customStyle-nav|${reference}|${i}`).className = `navbar-item config-source-customStyle-nav config-source-customStyle-nav|${reference}`;
          selectedOther = true;
        }
      }

      document.getElementById(`config-source-customStyle-content-nav|${reference}`).removeChild(document.getElementById(`config-source-customStyle-nav-add|${reference}`));

      let navElement = document.createElement("a");
      navElement.className = `navbar-item navbar-item-selected config-source-customStyle-nav config-source-customStyle-nav|${reference}`;
      navElement.id = `config-source-customStyle-nav|${reference}|${number}`;
      navElement.innerHTML = `<div id="config-source-customStyle-nav-text|${reference}|${number}"></div><button class="delete config-customStyle-delete" id="config-source-customStyle-nav-del|${reference}|${number}"></button>`;
      document.getElementById(`config-source-customStyle-content-nav|${reference}`).appendChild(navElement);

      document.getElementById(`config-source-customStyle-content-nav|${reference}`).appendChild(this.addButtonAddCustomStyle(reference));

      let content = this.addBlockCustomStyle({}, number, reference, "flex"); //this.addBlockCustomStyle({}, numberCustomStyle, number, reference, "flex");
      let div = document.createElement('DIV');
      div.innerHTML += content;
      document.getElementById(`config-source-customStyle-content-div|${reference}`).appendChild(div.firstChild);

      // Manage events
      this.addCustomStyle(document.getElementById(`config-source-customStyle-nav-add|${reference}`));
      this.deleteCustomStyle(document.getElementById(`config-source-customStyle-nav-del|${reference}|${number}`));
      this.manageEventsCustomStyle(document.getElementById(`config-source-customStyle-nav|${reference}|${number}`), document.getElementById(`config-source-customStyle-prop|${reference}|${number}`));
      this.manageChangeTypeCustomStyle(document.getElementById(`config-source-customStyle-type|${reference}|${number}`));
      this.addCustomStyleValue(document.getElementById(`config-source-customStyle-value-nav-add|${reference}|${number}`));
    });
  }

  /**
   * Manage event of add a new CustomStyle Value Block
   * @param {HTMLElement} - element - CustomStyle Value add HTML element
   */
  addCustomStyleValue(element)
  {
    element.addEventListener('click', event => {
      event.preventDefault();

      let reference = element.id.split("|")[1];
      let numberCustomStyle = element.id.split("|")[2];
      let number = 20 + Math.floor(Math.random() * 100000);

      let configCustomStyleValueDivs = document.getElementsByClassName(`config-source-customStyle-value-div|${reference}`);
      Array.from(configCustomStyleValueDivs).forEach(function(element) {
        element.style["display"] = "none";
      });
      let configCustomStyleValueNavs = document.getElementsByClassName(`config-source-customStyle-value-nav|${reference}`);
      Array.from(configCustomStyleValueNavs).forEach(function(element) {
        element.className = `navbar-item config-source-customStyle-nav config-source-customStyle-nav|${reference}`;
      });

      // Change selection que si select 
      let selectedOther = false;
      for(let i = 0; !selectedOther && i < 100020; i++) {
        if(document.getElementById(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${i}`) && document.getElementById(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${i}`).style["display"] != "none") {
          document.getElementById(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${i}`).style["display"] = "none";
          document.getElementById(`config-source-customStyle-value-nav|${reference}|${numberCustomStyle}|${i}`).className = `navbar-item config-source-customStyle-value-nav config-source-customStyle-value-nav|${reference}`;
          selectedOther = true;
        }
      }

      document.getElementById(`config-source-customStyle-value-content-nav|${reference}|${numberCustomStyle}`).removeChild(document.getElementById(`config-source-customStyle-value-nav-add|${reference}|${numberCustomStyle}`));

      let navElement = document.createElement("a");
      navElement.className = `navbar-item navbar-item-selected config-source-customStyle-value-nav config-source-customStyle-value-nav|${reference}`;
      navElement.id = `config-source-customStyle-value-nav|${reference}|${numberCustomStyle}|${number}`;
      navElement.innerHTML = `<div id="config-source-customStyle-value-nav-text|${reference}|${numberCustomStyle}|${number}"></div><button class="delete config-customStyle-value-delete" id="config-source-customStyle-value-nav-del|${reference}|${numberCustomStyle}|${number}"></button>`;
      document.getElementById(`config-source-customStyle-value-content-nav|${reference}|${numberCustomStyle}`).appendChild(navElement);

      document.getElementById(`config-source-customStyle-value-content-nav|${reference}|${numberCustomStyle}`).appendChild(this.addButtonAddCustomStyleValue(reference, numberCustomStyle));

      let content = this.addBlockCustomStyleValue({}, numberCustomStyle, number, reference, "flex");
      let div = document.createElement('DIV');
      div.innerHTML += content;
      document.getElementById(`config-source-customStyle-value-content-div|${reference}|${numberCustomStyle}`).appendChild(div.firstChild);

      // Manage events
      this.addCustomStyleValue(document.getElementById(`config-source-customStyle-value-nav-add|${reference}|${numberCustomStyle}`));
      this.deleteCustomStyleValue(document.getElementById(`config-source-customStyle-value-nav-del|${reference}|${numberCustomStyle}|${number}`));
      // config-source-customStyle-value-nav-add|${reference}|${numberCustomStyle}
      this.manageEventsCustomStyleValue(document.getElementById(`config-source-customStyle-value-nav|${reference}|${numberCustomStyle}|${number}`), document.getElementById(`config-source-customStyle-value|${reference}|${numberCustomStyle}|${number}`));

      // TO DO : Verif
      this.initCustomStyleValueStyle(reference, numberCustomStyle, number, document.getElementById(`config-source-type|${reference}`).value, {});
    });
  }

  /**
   * Manage event change nav and change prop of a customStyle
   * @param {HTMLElement} - elementNav - CustomStyle nav button HTML element
   * @param {HTMLElement} - elementProp - CustomStyle property input HTML element
   */
  manageEventsCustomStyle(elementNav, elementProp)
  {
    elementNav.addEventListener('click', event => {
      event.preventDefault();
      let reference = event.target.id.split("|")[1];
      let numberCustomStyle = event.target.id.split("|")[2];

      // Hide all
      if(document.getElementById(`config-source-customStyle-div|${reference}|${numberCustomStyle}`)) 
      {
        let configCustomStyleValueDivs = document.getElementsByClassName(`config-source-customStyle-div|${reference}`);
        Array.from(configCustomStyleValueDivs).forEach(function(element) {
          element.style["display"] = "none";
        });
        let configCustomStyleValueNavs = document.getElementsByClassName(`config-source-customStyle-nav|${reference}`);
        Array.from(configCustomStyleValueNavs).forEach(function(element) {
          element.className = `navbar-item config-source-customStyle-nav config-source-customStyle-nav|${reference}`;
        });

        // Show selected
        document.getElementById(`config-source-customStyle-div|${reference}|${numberCustomStyle}`).style["display"] = "flex";
        document.getElementById(`config-source-customStyle-nav|${reference}|${numberCustomStyle}`).className = `navbar-item navbar-item-selected config-source-customStyle-nav config-source-customStyle-nav|${reference}`;
      }
    });

    elementProp.addEventListener('change', event => {
      event.preventDefault();

      let reference = event.target.id.split("|")[1];
      let numberCustomStyle = event.target.id.split("|")[2];

      document.getElementById(`config-source-customStyle-nav-text|${reference}|${numberCustomStyle}`).innerHTML = event.target.value;
    });
  }

  /**
   * Manage event change nav and change prop of a customStyle value
   * @param {HTMLElement} - elementNav - CustomStyle value nav button HTML element
   * @param {HTMLElement} - elementValeur - CustomStyle value input HTML element
   */
  manageEventsCustomStyleValue(elementNav, elementValue)
  {
    elementNav.addEventListener('click', event => {
      event.preventDefault();
      let reference = event.target.id.split("|")[1];
      let numberCustomStyle = event.target.id.split("|")[2];
      let numberCustomStyleValues = event.target.id.split("|")[3];

      // Hide all
      if(document.getElementById(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${numberCustomStyleValues}`)) 
      {
        let configCustomStyleValueDivs = document.getElementsByClassName(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}`);
        Array.from(configCustomStyleValueDivs).forEach(function(element) {
          element.style["display"] = "none";
        });
        let configCustomStyleValueNavs = document.getElementsByClassName(`config-source-customStyle-value-nav|${reference}`);
        Array.from(configCustomStyleValueNavs).forEach(function(element) {
          element.className = `navbar-item config-source-customStyle-value-nav config-source-customStyle-value-nav|${reference}`;
        });

        // Show selected
        document.getElementById(`config-source-customStyle-value-div|${reference}|${numberCustomStyle}|${numberCustomStyleValues}`).style["display"] = "flex";
        document.getElementById(`config-source-customStyle-value-nav|${reference}|${numberCustomStyle}|${numberCustomStyleValues}`).className = `navbar-item navbar-item-selected config-source-customStyle-value-nav config-source-customStyle-value-nav|${reference}`;
      }
    });

    elementValue.addEventListener('change', event => {
      event.preventDefault();

      let reference = event.target.id.split("|")[1];
      let numberCustomStyle = event.target.id.split("|")[2];
      let numberCustomStyleValues = event.target.id.split("|")[3];

      document.getElementById(`config-source-customStyle-value-nav-text|${reference}|${numberCustomStyle}|${numberCustomStyleValues}`).innerHTML = event.target.value;
    });
  }

  /**
   * Manage event change type of a customStyle
   * @param {HTMLElement} - element - CustomStyle value nav button HTML element
   */
  manageChangeTypeCustomStyle(element)
  {
    element.addEventListener('change', event => {
      event.preventDefault();
      let reference = event.target.id.split("|")[1];
      let number = event.target.id.split("|")[2];

      let content = ``;
      if(event.target.value && event.target.value == "variable") {
        content += this.addBlockCustomStyleVariable({}, number, reference);
        document.getElementById(`config-source-customStyle-div-content|${reference}|${number}`).innerHTML = content;
      }
      else {
        content += this.addBlockCustomStyleProp({}, number, reference);
        document.getElementById(`config-source-customStyle-div-content|${reference}|${number}`).innerHTML = content;
        this.addCustomStyleValue(document.getElementById(`config-source-customStyle-value-nav-add|${reference}|${number}`));
      }
    });
  }

  /**
   * PopUp manage enable button clic
   * @param {HTMLElement} - element - Checkbox for enable popup params
   */
  manageEnablePopUp(element) 
  {  
    element.addEventListener('change', event => {
      event.preventDefault();
      let reference = event.target.id.split("|")[1];

      document.getElementById(`config-source-popup-props-add|${reference}`).disabled = !event.target.checked;

      let customStyleTypes = document.getElementsByClassName(`conf-source-popup-input|${reference}`);
      Array.from(customStyleTypes).forEach(function(element) {
        element.disabled  = !event.target.checked;
      });

      if(event.target.checked) {
        document.getElementById(`config-source-popup-fieldset|${reference}`).style["backgroundColor"] = null;
      }
      else {
        document.getElementById(`config-source-popup-fieldset|${reference}`).style["backgroundColor"] = "#F2F2F2";
      }
    });
  }

  /**
   * PopUp manage add button clic
   * @param {HTMLElement} - element - Add button
   */
  manageAddPopUpProp(element) 
  {
    element.addEventListener('click', event => {
      event.preventDefault();

      let reference = event.target.id.split("|")[1];
      let number = 20 + Math.floor(Math.random() * 100000);

      let content = this.addSourceContentPopUpProps(reference, "", number, {})
      let div = document.createElement('DIV');
      div.innerHTML += content;
      document.getElementById(`config-source-popup-props|${reference}`).appendChild(div.firstChild);

      this.manageDeletePopUpProp(document.getElementById(`config-source-popup-props-delete|${reference}|${number}`)) 
    });
  }

  /**
   * PopUp manage delete property
   * @param {HTMLElement} - element - Delete button
   */
  manageDeletePopUpProp(element) 
  {
    element.addEventListener('click', event => {
      event.preventDefault();

      let reference = event.target.id.split("|")[1];
      let number = event.target.id.split("|")[2];

      document.getElementById(`config-source-popup-props|${reference}`).removeChild(document.getElementById(`conf-source-popup-props-div|${reference}|${number}`));
    });
  }

  /**
   * Get the config object
   * @return {object} - The fileContentConfigObj
   */
  getContentConfigObjBase()
  {
    let valid = true;
    let caractRefValid = true;

    let me = this;
    let sources = [];

    let groupsTitles = document.getElementsByClassName("config-list-title");
    Array.from(groupsTitles).forEach(function(element) {
      let baseRef = element.id.split("|")[1];

      let reference = document.getElementById(`config-source-reference|${baseRef}`).value;
      let name = document.getElementById(`config-source-name|${baseRef}`).value;

      let type = document.getElementById(`config-source-type|${baseRef}`).value;
      let description = document.getElementById(`config-source-description|${baseRef}`).value;
      let group = document.getElementById(`config-source-group|${baseRef}`).value;

      let style = me.styles[baseRef].getContentConfigObj();

      let autoload = false;
      if(document.getElementById(`config-source-autoload-yes|${baseRef}`).checked) {
        autoload = true;
      }

      // PopUp get values
      let popUpEnable = document.getElementById(`config-source-popup-enable|${baseRef}`).checked;
      let popup = null;
      if(popUpEnable) {
        popup = {props : [], bolds : [], italics : []};
        let popUpInputs = document.getElementsByClassName(`conf-source-popup-props|${reference}`);
        Array.from(popUpInputs).forEach(function(popUpInput) {
          let idPopUpProp = popUpInput.id.split("|")[2];

          popup.props.push(popUpInput.value);

          if(document.getElementById(`config-source-popup-bold|${baseRef}|${idPopUpProp}`).checked) {
            popup.bolds.push(popUpInput.value);
          }
          if(document.getElementById(`config-source-popup-italic|${baseRef}|${idPopUpProp}`).checked) {
            popup.italics.push(popUpInput.value);
          }
        });
      }

      // Get custom styles values
      let customStyles = [];
      let customStyleDivs = document.getElementsByClassName(`config-source-customStyle-div|${reference}`);
      Array.from(customStyleDivs).forEach(function(customStyleDiv) {
        let idCustomStyle = customStyleDiv.id.split("|")[2];
        // 
        let type = document.getElementById(`config-source-customStyle-type|${baseRef}|${idCustomStyle}`).value;
        let prop = document.getElementById(`config-source-customStyle-prop|${baseRef}|${idCustomStyle}`).value;

        if(type == "variable") {
          let propStyle = document.getElementById(`config-source-customStyle-propStyle|${baseRef}|${idCustomStyle}`).value;
          let value = document.getElementById(`config-source-customStyle-propValue|${baseRef}|${idCustomStyle}`).value; 
          let valueType = document.getElementById(`config-source-customStyle-valueType|${baseRef}|${idCustomStyle}`).value;

          customStyles.push({type : type, prop : prop, propStyle : propStyle, value : value, valueType : valueType});
        }
        else {
          // Prop type 
          let customDivValues = [];
          let customStyleDivsValues = document.getElementsByClassName(`config-source-customStyle-value-div|${reference}|${idCustomStyle}`);
          Array.from(customStyleDivsValues).forEach(function(customStyleDivsValue) {
            let idCustomStyleValue = customStyleDivsValue.id.split("|")[3];

            let value = document.getElementById(`config-source-customStyle-value|${baseRef}|${idCustomStyle}|${idCustomStyleValue}`).value; 
            let condition = document.getElementById(`config-source-customStyle-value-condition|${baseRef}|${idCustomStyle}|${idCustomStyleValue}`).value; 

            let styleValue = me.stylesCustomValueStyle[reference][idCustomStyle][idCustomStyleValue].getContentConfigObj();

            customDivValues.push({value : value, condition : condition, style : styleValue});
          });

          customStyles.push({type : type, prop : prop, values : customDivValues});
        }
      });

      if(!reference.includes("|"))
      {
        if(reference && name)
        {
          sources.push({name : name, reference : reference, type : type, description : description, group : group, autoload : autoload, style : style, customStyles : customStyles, popup : popup});
        }
        else 
        {
          valid = false;
          alert(`Un ou des champs noms et/ou références ne sont pas renseignées`);
        }
      }
      else 
      {
        valid = false;
        caractRefValid = false;
      }
    });

    for(let i = 0; i < sources.length; i++)
    {
      if(sources.filter(sg => sg.reference == sources[i].reference).length > 1 && valid)
      {
        alert(`La réference '${sources[i].reference}' est liée à 2 sources`);
        valid = false;
      }
    }

    if(!caractRefValid)
    {
      alert("Les champs références ne doivent pas contenir de caractère '|'");
    }

    if(valid) {
      this.fileContentConfigObj[this.objName] = sources;
      return this.fileContentConfigObj;
    }
    else {
      return null;
    }
  }
}