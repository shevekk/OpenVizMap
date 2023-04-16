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
   * @param {SimpleGIS.Map.MapManager} - mapManager - 
   */
  init(fileContentConfig, isLocalStorage, mapManager) {
    this.div = L.DomUtil.create('div', 'action-button leaflet-bar leaflet-control');

    this.modifications = false;
    this.initArraySVG();

    L.DomEvent.addListener(this.div, 'dblclick', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mousedown', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mouseup', L.DomEvent.stop);
 
    //this.fileContentConfig = fileContentConfig;
    this.fileContentConfigObj = JSON.parse(fileContentConfig);
    this.isLocalStorage = isLocalStorage;
    this.mapManager = mapManager;

    this.button = L.DomUtil.create('a', 'fa-solid fa-pen-to-square', this.div);
    this.button.title = "Modifier la config";

    this.contentConfig = null;

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

    let titlesHtml = `<nav class="navbar is-info" role="navigation">
                        <div class="navbar-menu">
                          <div class="navbar-start">
                            <a class="navbar-item navbar-item-selected" id="config-nav-textes" title="Edition de la configuration sous forme de texte">Textes</a>
                            <a class="navbar-item" id="config-nav-params" title="Ecran des paramètres principaux de la configuration">Params</a>
                            <a class="navbar-item" id="config-nav-boutonsviz" title="Ecran de configuration des boutons de visualisations">Boutons de visualisation</a>
                            <a class="navbar-item" id="config-nav-groupes" title="Ecran de configuration des groupes">Groupes</a>
                            <a class="navbar-item" id="config-nav-sources" title="Ecran de configuration des sources de données GeoJson">Sources</a>
                            <a class="navbar-item" id="config-nav-sourcesosm" title="Ecran de configuration des source de données OpenStreetMap">SourcesOSM</a>
                            <a class="navbar-item" id="config-nav-backgrounds" title="Ecran de configuration des fond d'écrans">Fond de plan</a>
                          </div>
                        </div>
                      </nav><br/>`;

    popupContainer.innerHTML = `
      <div class="inner-container-configuration">
        <div class="header-configuration"></div>
        ${titlesHtml}
        <div id="configuration-content" class="container is-fluid"></div>
        <div class="footer-configuration">
          <div class="configuration-localStorage-state"><i class="fa-solid fa-file"></i></div>
          <div>
            <button class="button is-danger" id="btn-suppr-configuration" title="Supprimer la configuration en sauvegarde local"><i class="fa-solid fa-trash"></i></button>
            <button class="button is-info" id="btn-reload-configuration" title="Recharger la configuration par défaut"><i class="fa-solid fa-arrows-rotate"></i></button>
            <button class="button is-link" id="btn-download-configuration" title="Télécharger la configuration sous forme de fichier"><i class="fa-solid fa-file-arrow-down"></i></button>
            <button class="button is-success is-light" id="btn-save-configuration" title="Sauvegarder et Recharger"><i class="fa-solid fa-floppy-disk"></i></button>
            <button class="button is-dark" id="btn-close-configuration" title="Fermer sans sauvegarder">Close</button>
          </div>
        </div>
      </div>`;

      // 

    let popupTitle = document.getElementsByClassName("header-configuration")[0];
    popupTitle.innerHTML = "Configuration de la carte";
    
    // Hide the popup
    function hidePopup() {
      popupContainer.style.visibility = "hidden";
      popupContainer.style.opacity = "0";
    }

    // Button for close
    let closeBtn = document.getElementById("btn-close-configuration");
    closeBtn.onclick = () => {
      if(this.modifications) {
        var closeConfirm = confirm("Êtes-vous sûr de vouloir quitter sans sauvegarder ?");
        if (closeConfirm == true) {
            hidePopup();
        }
      }
      else {
        hidePopup();
      }
    }

    // Save and reload the config -> Set the localStorage and load the content
    let saveBtn = document.getElementById("btn-save-configuration");
    saveBtn.onclick = () => {
      try {
        let resultContentObj = this.contentConfig.getContentConfigObj();
        if(resultContentObj) {
          this.modifications = false;

          this.fileContentConfigObj = resultContentObj;
          let fileContentConfig = JSON.stringify(this.fileContentConfigObj, null, 2);
          localStorage.setItem('SimpleGis-configuration', fileContentConfig);

          hidePopup();

          me.isLocalStorage = true;
          document.dispatchEvent(new CustomEvent('reload-config', {detail: {isLocalStorage : true}}));

          saveBtn.className = "button is-success is-light";

          alert("Save");
        }
        else {
          event.preventDefault();
          alert("Formulaire invalide !");
        }
      }
      catch (e) {
        alert("Fail");
      }
    }

    // Delete the localStorage content and reload the file config
    let supprBtn = document.getElementById("btn-suppr-configuration");
    supprBtn.onclick = () => {
      
      if(confirm("Voulez-vous supprimer la configuration stockée en local ?")) {
        localStorage.removeItem('SimpleGis-configuration');

        hidePopup();

        me.isLocalStorage = false;
        document.dispatchEvent(new CustomEvent('reload-config', {detail: {isLocalStorage : false}}));
      }
    }

    // Download button action
    let downloadBtn = document.getElementById("btn-download-configuration");
    downloadBtn.onclick = () => {

      try {
        let resultContentObj = this.contentConfig.getContentConfigObj();
        if(resultContentObj) {
          this.modifications = false;

          this.fileContentConfigObj = resultContentObj;
          let fileContentConfig = JSON.stringify(this.fileContentConfigObj, null, 2);

          this.download(fileContentConfig, "config.json", "json");
        }
        else {
          event.preventDefault();
          alert("Formulaire invalide !");
        }
      }
      catch (e) {
        alert("Fail");
      }
    }

    // Reload the config
    let reloadBtn = document.getElementById("btn-reload-configuration");
    reloadBtn.onclick = () => {
      hidePopup();

      me.isLocalStorage = false;
      document.dispatchEvent(new CustomEvent('reload-config', {detail: {isLocalStorage : false}}));
    }

    this.updateLocalStorageColor();

    // Gestion du changement de menu
    let configurationContentDiv = document.getElementById("configuration-content");
    this.contentConfig = new SimpleGIS.Control.Config.TextEdition(configurationContentDiv, this.fileContentConfigObj);

    let configNavTextes = document.getElementById("config-nav-textes");
    configNavTextes.onclick = (event) => {

      this.changeNavBarStyle("config-nav-textes");

      if(this.getContentConfigObj()) {
        this.contentConfig = new SimpleGIS.Control.Config.TextEdition(configurationContentDiv, this.fileContentConfigObj);
      }
    }
    let configNavParams = document.getElementById("config-nav-params");
    configNavParams.onclick = () => {

      this.changeNavBarStyle("config-nav-params");

      if(this.getContentConfigObj()) {
        this.contentConfig = new SimpleGIS.Control.Config.Params(configurationContentDiv, this.fileContentConfigObj, this.mapManager);
      }

      this.reinitChangeInputButtons();
    }
    let configNavBoutonsViz = document.getElementById("config-nav-boutonsviz");
    configNavBoutonsViz.onclick = () => {

      this.changeNavBarStyle("config-nav-boutonsviz");

      if(this.getContentConfigObj()) {
        this.contentConfig = new SimpleGIS.Control.Config.BoutonsViz(configurationContentDiv, this.fileContentConfigObj, this.arraySVG);
      }

      this.reinitChangeInputButtons();
    }
    let configNavGroupes = document.getElementById("config-nav-groupes");
    configNavGroupes.onclick = () => {

      this.changeNavBarStyle("config-nav-groupes");

      if(this.getContentConfigObj()) {
        this.contentConfig = new SimpleGIS.Control.Config.Groupes(configurationContentDiv, this.fileContentConfigObj);
      }

      this.reinitChangeInputButtons();
    }
    let configNavSources = document.getElementById("config-nav-sources");
    configNavSources.onclick = () => {

      this.changeNavBarStyle("config-nav-sources");

      if(this.getContentConfigObj()) {
        this.contentConfig = new SimpleGIS.Control.Config.Sources(configurationContentDiv, this.fileContentConfigObj, this.arraySVG);
      }

      this.reinitChangeInputButtons();
    }
    let configNavSourcesOSM = document.getElementById("config-nav-sourcesosm");
    configNavSourcesOSM.onclick = () => {

      this.changeNavBarStyle("config-nav-sourcesosm");

      if(this.getContentConfigObj()) {
        this.contentConfig = new SimpleGIS.Control.Config.SourcesOSM(configurationContentDiv, this.fileContentConfigObj, this.arraySVG);
      }

      this.reinitChangeInputButtons();
    }
    let configNavBackgrounds = document.getElementById("config-nav-backgrounds");
    configNavBackgrounds.onclick = () => {

      this.changeNavBarStyle("config-nav-backgrounds");

      if(this.getContentConfigObj()) {
        this.contentConfig = new SimpleGIS.Control.Config.Backgrounds(configurationContentDiv, this.fileContentConfigObj);
      }

      this.reinitChangeInputButtons();
    }

    
  },

  initArraySVG()
  {
    // Get all svg in list
    this.arraySVG = [];
    fetch('scripts/list_svg.php', {
      method: 'GET'
    })
    .then((response) => {
      const reader = response.body.getReader();
      reader.read().then(({ done, value }) => {
        let contentJson = "";
        let text = new Uint8Array(value).reduce(function (data, byte) {
            contentJson += String.fromCharCode(byte);
        }, '');
        this.arraySVG = JSON.parse(contentJson);

        // this.stylePointDefaut.setArraySVG(this.arraySVG);
      });
    });
  },

  /*
   * Change the nav bar design
   */
  changeNavBarStyle(id)
  {
    let navBars = document.getElementsByClassName("navbar-item");
    Array.from(navBars).forEach(function(element) {
      element.className = "navbar-item";
    });

    document.getElementById(id).className = "navbar-item navbar-item-selected";
  },

  /*
   * Re init the button change design with 
   */
  reinitChangeInputButtons() 
  {
    let me = this;

    let inputs = document.getElementsByTagName('input');
    Array.from(inputs).forEach(function(element) {
      element.addEventListener('change', event => {
        document.getElementById("btn-save-configuration").className = 'button is-success';
        me.modifications = true;
      });
    });
  },

  /*
   * Get Content Config Object of the children
   * @return {bool} - True if valid
   */
  getContentConfigObj() 
  {
    let valid = false;
    let resultContentObj = this.contentConfig.getContentConfigObj();
      if(resultContentObj) {
        this.fileContentConfigObj = resultContentObj;
        valid = true;
      }
      else {
        event.preventDefault();
        alert("Formulaire invalide !");
        valid = false;
      }

      return valid;
  },

  /*
   * Update the color of the storage type div
   */
  updateLocalStorageColor() 
  {
    let localStorageConfigDiv = document.getElementsByClassName("configuration-localStorage-state")[0];
    if(this.isLocalStorage) {
      localStorageConfigDiv.style.backgroundColor = "#68F6AE";
      localStorageConfigDiv.style.color = "#228F57";
      localStorageConfigDiv.title = "Stockage de la configuration local utilisé";
      document.getElementById(`btn-reload-configuration`).style.display = "inline-block";
    }
    else {
      localStorageConfigDiv.style.backgroundColor = "#F4DFAA";
      localStorageConfigDiv.style.color = "#BFA56E";
      localStorageConfigDiv.title = "Pas de stockage local de la configuration";
      document.getElementById(`btn-reload-configuration`).style.display = "none";
    }
  },

  /*
   * Download the config text content to a file
   * @param {string} - data - Str content of the file
   * @param {string} - filename - Name of the file
   * @param {string} - type - Type of the file
   */
  download(data, filename, type) 
  {
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