/*
 * UI for reload the config
 */
SimpleGIS.Control.Configuration = L.Control.extend({

  options: {
    position: 'topleft'
  },

  /*
   * Init the Control for configuration
   * @param {string} - fileContentConfig - Name of the config file
   * @param {bool} - isLocalStorage - Is the local storage file config loaded
   */
  init(fileContentConfig, isLocalStorage) {
    this.div = L.DomUtil.create('div', 'action-button leaflet-bar leaflet-control');

    L.DomEvent.addListener(this.div, 'dblclick', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mousedown', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mouseup', L.DomEvent.stop);

    this.fileContentConfig = fileContentConfig;
    this.isLocalStorage = isLocalStorage;

    this.button = L.DomUtil.create('a', 'fa-solid fa-pen-to-square', this.div);
    this.button.title = "Modifier la config";

    L.DomEvent.on(this.button, 'click', (e) => {this.displayConfiguration()}, this);
  },


  /*
   * Display the configuration control
   */
  displayConfiguration() {
    let me = this;

    let popupContainer = document.getElementsByClassName("popup-container-configuration")[0];
    popupContainer.style.visibility = "visible";
    popupContainer.style.opacity = "1";
    
    popupContainer.innerHTML = `
      <div class="inner-container-configuration">
        <div class="header-configuration"></div>
        <textArea class="textArea-configuration">${this.fileContentConfig}</textArea>
        <div class="footer-configuration">
          <div class="configuration-localStorage-state">Stockage local</div>
          <div>
            <button class="btn-configuration btn-close-configuration">Close</button>
            <button class="btn-configuration btn-reload-configuration">Recharger la config par défaut</button>
            <button class="btn-configuration btn-save-configuration">Sauvegarder et Recharger</button>
            <button class="btn-configuration btn-download-configuration">Télécharger</button>
            <button class="btn-configuration btn-suppr-configuration">Suppression</button>
          </div>
        </div>
      </div>`;

    let popupTitle = document.getElementsByClassName("header-configuration")[0];
    popupTitle.innerHTML = "Configuration de la carte";
    
    // Hide the popup
    function hidePopup() {
      popupContainer.style.visibility = "hidden";
      popupContainer.style.opacity = "0";
    }

    // Button for close
    let closeBtn = document.getElementsByClassName("btn-close-configuration")[0];
    closeBtn.onclick = () => {
      hidePopup();
    }

    // Save and reload the config -> Set the localStorage and load the content
    let saveBtn = document.getElementsByClassName("btn-save-configuration")[0];
    saveBtn.onclick = () => {
      try {
        let textArea = document.getElementsByClassName("textArea-configuration")[0];
        
        var obj = JSON.parse(textArea.value);

        localStorage.setItem('SimpleGis-configuration', textArea.value);

        hidePopup();

        me.isLocalStorage = true;
        document.dispatchEvent(new CustomEvent('reload-config', {detail: {isLocalStorage : true}}));

        alert("Save");
      }
      catch (e) {
        alert("Fail");
      }
    }

    // Delete the localStorage content and reload the file config
    let supprBtn = document.getElementsByClassName("btn-suppr-configuration")[0];
    supprBtn.onclick = () => {
      
      if(confirm("Voulez-vous supprimer la configuration stockée en local ?")) {
        localStorage.removeItem('SimpleGis-configuration');

        hidePopup();

        me.isLocalStorage = false;
        document.dispatchEvent(new CustomEvent('reload-config', {detail: {isLocalStorage : false}}));
      }
    }

    // Download button action
    let downloadBtn = document.getElementsByClassName("btn-download-configuration")[0];
    downloadBtn.onclick = () => {
      let textArea = document.getElementsByClassName("textArea-configuration")[0];
      this.download(textArea.value, "config.json", "json");
    }

    // Reload the config
    let reloadBtn = document.getElementsByClassName("btn-reload-configuration")[0];
    reloadBtn.onclick = () => {
      hidePopup();

      me.isLocalStorage = false;
      document.dispatchEvent(new CustomEvent('reload-config', {detail: {isLocalStorage : false}}));
    }

    this.updateLocalStorageColor();
  },

  /*
   * Update the color of the storage type div
   */
  updateLocalStorageColor() {
    let localStorageConfigDiv = document.getElementsByClassName("configuration-localStorage-state")[0];
    if(this.isLocalStorage) {
      localStorageConfigDiv.style.backgroundColor = "#22DC7E";
      localStorageConfigDiv.style.border = "2px solid #236043";
      localStorageConfigDiv.title = "Stockage de la configuration local utilisé";
    }
    else {
      localStorageConfigDiv.style.backgroundColor = "#DC9D22";
      localStorageConfigDiv.style.border = "2px solid #654A15";
      localStorageConfigDiv.title = "Pas de stockage local de la configuration";
    }
  },

  /*
   * Download the config text content to a file
   * @param {string} - data - Str content of the file
   * @param {string} - filename - Name of the file
   * @param {string} - type - Type of the file
   */
  download(data, filename, type) {
    let file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
      let a = document.createElement("a");
      let url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
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