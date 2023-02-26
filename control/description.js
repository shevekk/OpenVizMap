
/*
 * Control for description
 */
SimpleGIS.Control.Description = L.Control.extend({

  options: {
    position: 'topleft'
  },

  /*
   * Init the control for display description windows
   * @params {SimpleGIS.Data.DescriptionParams} - descriptionObj - Object of description params
   */
  init(descriptionObj) {
    this.div = L.DomUtil.create('div', 'action-button leaflet-bar leaflet-control');

    L.DomEvent.addListener(this.div, 'dblclick', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mousedown', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mouseup', L.DomEvent.stop);

    this.open = false;
    this.descriptionObj = descriptionObj;

    if(this.descriptionObj.enable) {
      this.button = L.DomUtil.create('a', 'fa-solid fa-list', this.div);
      this.button.title = "Afficher la description";

      L.DomEvent.on(this.button, 'click', (e) => {this.displayWindow()}, this);
    }
    else {
      this.div.style["display"] = "none";
    }
  },

  /*
   * Update the Object of description params
   * @params {SimpleGIS.Data.DescriptionParams} - descriptionObj - Object of description params
   */
  updateDescriptionObs(descriptionObj) {
    this.descriptionObj = descriptionObj;
  },

  /*
   * Display description window and manage close
   */
  displayWindow() {
    let popupContainer = document.getElementsByClassName("popup-container-description")[0];
    popupContainer.style.visibility = "visible";
    popupContainer.style.opacity = "1";

    let popupTitle = document.getElementsByClassName("header-description")[0];
    popupTitle.innerHTML = this.descriptionObj.title;

    let descriptionHTML = `<div>${this.descriptionObj.html}</div><br/>`;
    if(this.descriptionObj.creator && this.descriptionObj.creatorWebsite) {
      descriptionHTML += `<div>Createur : ${this.descriptionObj.creator} <a class="btn-description" href="${this.descriptionObj.creatorWebsite}" target="_blank">Site</a></div>`;
    }
    
    let popupContent = document.getElementsByClassName("content-description")[0];
    popupContent.innerHTML = descriptionHTML;

    function hidePopup() {
      popupContainer.style.visibility = "hidden";
      popupContainer.style.opacity = "0";
    }

    popupContainer.onclick = (e) => {
        if(e.target.attributes.getNamedItem("data-js") && e.target.attributes.getNamedItem("data-js").value == "popup-description") {
          hidePopup();
        }
    };

    let closeBtn = document.getElementsByClassName("btn-close-description")[0];
    closeBtn.onclick = () => {
      hidePopup();
    }
  },

  /*
   * Add control to the map and init html
   * @params {L.Map} - map
   */
  onAdd: function(map) {
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
