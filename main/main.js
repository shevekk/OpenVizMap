if (typeof SimpleGIS == 'undefined') {
  SimpleGIS = {};
}

if (typeof SimpleGIS.Main == 'undefined') {
  SimpleGIS.Main = {};
}

/*
 * The main software class
 */
SimpleGIS.Main.Main = class Main
{
  /**
   * Init the software
   * @param {string} - divNameHtml - Html name of the map div
   * @param {string} - fileName - Name of the config file to load
   */
  static init(divNameHtml, dataFileName) 
  {
    // Get config in params
    this.dataFileName = dataFileName;
    let urlParams = SimpleGIS.Main.Main.getUrlParams();
    if(urlParams['config']) {
      this.dataFileName = urlParams['config'];
    }

    //
    const localConfigStr = localStorage.getItem('SimpleGis-configuration');
    if(localConfigStr) {
       if(confirm("Souhaitez vous utilisés les configurations stockées en local ?")) {
        this.create(divNameHtml, "");
       }
       else {
        this.create(divNameHtml, dataFileName);
       }
    }
    else {
      this.create(divNameHtml, dataFileName);
    }
  }

  /**
   * Create the content, control and display
   * @param {string} - divNameHtml - Name of the div
   * @param {string} - dataFileName - Name of the file
   */
  static create(divNameHtml, dataFileName) 
  {
    this.mapManager = new SimpleGIS.Map.MapManager();
    
    this.dataManager = new SimpleGIS.Data.DataManager(this.dataFileName);
    this.isLocalStorage = dataFileName == "";

    this.dataManager.loadConfig(this.isLocalStorage).then(dataConfig => {
      /* @param {SimpleGIS.Data.Config} - dataConfig */

      // If mobile change resolution
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this.dataManager.editModeEnable = false;
      }

      let defaultParams = dataConfig.defaultParams;

      this.mapManager.init(divNameHtml, defaultParams.position, defaultParams.zoom, defaultParams.fullscreenControl);
      this.mapManager.spin(true);

      if(dataConfig.backgrounds.length > 0) {
        SimpleGIS.Main.Main.changeBackGround(dataConfig.backgrounds[0]);
      }

      // Init the background select
      this.backgroundSelect = new SimpleGIS.Control.BackgroundSelect();
      this.backgroundSelect.init(dataConfig.backgrounds);
      this.backgroundSelect.addTo(this.mapManager.map);

      if(!dataConfig.defaultParams.vizReference) {
        // Load of data file
        this.dataManager.loadSourceDataAutoload().then(dataSourcesLoaded => {
          /* @param {SimpleGIS.Data.DataSource[]} - dataSourcesLoaded */

          dataSourcesLoaded.forEach(dataSourceLoaded => {
            /* @param {SimpleGIS.Data.DataSource} - dataSourceLoaded */

            this.mapManager.addLayerFromGeoJson(dataSourceLoaded.reference, dataSourceLoaded.layer);
          });

          this.mapManager.spin(false);
        });
      }

      // Init button description
      this.controlDescription = new SimpleGIS.Control.Description();
      this.controlDescription.init(dataConfig.description);
      this.controlDescription.addTo(this.mapManager.map);

      // Init button control
      this.controlActions = new SimpleGIS.Control.Actions();
      this.controlActions.init();
      for(let i = 0; i < dataConfig.buttonViz.length; i++) {
        let buttonViz = dataConfig.buttonViz[i];
        this.controlActions.addButton(buttonViz.name, buttonViz.reference, buttonViz.icon.type, buttonViz.icon.value, buttonViz.description, buttonViz.sources, buttonViz.sourcesOSM);
      }
      this.controlActions.addTo(this.mapManager.map);
      
      if(this.dataManager.editModeEnable) {
        let dataSourcesReferencesAutoload = dataConfig.dataSources.filter(el => el.autoload).flatMap((element) => element.reference).concat(dataConfig.dataSourcesOSM.filter(el => el.autoload).flatMap((element) => element.reference));
        SimpleGIS.Main.Main.reloadControlLayersSelect(dataConfig, dataSourcesReferencesAutoload);

        // Init change edit mode button control
        this.controlEditButton = new SimpleGIS.Control.EditButton();
        this.controlEditButton.init(true);
        this.controlEditButton.addTo(this.mapManager.map);
      }

      // If edit param false = don't display edit UI
      let urlParams = SimpleGIS.Main.Main.getUrlParams();
      if(urlParams['edit'] && (urlParams['edit'] == false || urlParams['edit'] == "false")) {

        if(this.controlEditButton) {
          this.controlEditButton.changeEditMode();
        }
        if(this.controlConfiguration) {
          this.controlConfiguration.div.style.display = "none";
        }
      }

      if(dataConfig.defaultParams.vizReference) {
        let viz = dataConfig.buttonViz.find(bv => bv.reference == dataConfig.defaultParams.vizReference);
        if(viz) {
          this.mapManager.spin(false);
          SimpleGIS.Main.Main.enableViz(viz.sources, viz.sourcesOSM, viz.description);

          document.getElementById(`buttonViz|${viz.reference}`).style = "color:#C58F22;background-color: #F4ECDD";
        }
      }
    });

    // Listen events
    document.addEventListener("show-layer", (e) => {SimpleGIS.Main.Main.showLayer(e.detail.reference, e.detail.isOSM, e.detail.updateLayerControl)});
    document.addEventListener("hide-layer", (e) => {SimpleGIS.Main.Main.hideLayer(e)});
    document.addEventListener("hide-all-layers", (e) => {SimpleGIS.Main.Main.hideAllLayers(e.detail.updateLayerControl)});
    document.addEventListener("reload-config", (e) => {SimpleGIS.Main.Main.reloadConfig(e.detail.isLocalStorage)});
    document.addEventListener("change-edit-mode", (e) => {SimpleGIS.Main.Main.changeEditMode(e.detail.editMode)});
    document.addEventListener("show-legend", (e) => {SimpleGIS.Main.Main.showLegend(e.detail.sourcesReferences, e.detail.sourcesReferencesOSM, e.detail.description)});
    document.addEventListener("change-background", (e) => {SimpleGIS.Main.Main.changeBackGround(e.detail.background)}); // 
    document.addEventListener("enable-viz", (e) => {SimpleGIS.Main.Main.enableViz(e.detail.sourcesReferences, e.detail.sourcesReferencesOSM, e.detail.description)});
  }

  /**
   * Reload UI for layer selection
   * @param {SimpleGIS.Data.Config} - dataConfig
   * @param {string[]} - checkedReferences
   */
  static reloadControlLayersSelect(dataConfig, checkedReferences) 
  {
    let dataSources = dataConfig.dataSources;

    let dataSourcesNamesWithNoGroup = dataSources.filter(el => el.group == null || el.group == "").flatMap((element) => element.name);
    let dataSourcesReferencesWithNoGroup = dataSources.filter(el => el.group == null || el.group == "").flatMap((element) => element.reference);
    if(this.controlLayersSelect) {
      this.mapManager.map.removeControl(this.controlLayersSelect);
    }

    // Init layers Controls
    this.controlLayersSelect = new SimpleGIS.Control.LayersSelect();

    this.controlLayersSelect.init();

    this.controlLayersSelect.addCheckedSources(checkedReferences);
    for(let i = 0; i < dataConfig.sourcesGroups.length; i++) {
      this.controlLayersSelect.addGroupSources(dataConfig.sourcesGroups[i].name, dataConfig.sourcesGroups[i].reference, dataConfig.sourcesGroups[i].childrenNames, dataConfig.sourcesGroups[i].childrenReferences, dataConfig.sourcesGroups[i].childrenNamesOSM, dataConfig.sourcesGroups[i].childrenReferencesOSM);
    }
    this.controlLayersSelect.addOthersSources(dataSourcesNamesWithNoGroup, dataSourcesReferencesWithNoGroup, false);

    // Add dataSourcesOSM
    let dataSourcesOSM = dataConfig.dataSourcesOSM;
    let dataSourcesOSMNamesWithNoGroup = dataSourcesOSM.filter(el => el.group == null || el.group == "").flatMap((element) => element.name);
    let dataSourcesOSMReferencesWithNoGroup = dataSourcesOSM.filter(el => el.group == null || el.group == "").flatMap((element) => element.reference);
    this.controlLayersSelect.addOthersSources(dataSourcesOSMNamesWithNoGroup, dataSourcesOSMReferencesWithNoGroup, true);

    this.controlLayersSelect.addTo(this.mapManager.map);

    this.backgroundSelect.init(dataConfig.backgrounds, this.backgroundSelect.selectedBackground);

    // Control the actions
    this.controlActions.init();
    for(let i = 0; i < dataConfig.buttonViz.length; i++) {
      let buttonViz = dataConfig.buttonViz[i];
      this.controlActions.addButton(buttonViz.name, buttonViz.reference, buttonViz.icon.type, buttonViz.icon.value, buttonViz.description, buttonViz.sources, buttonViz.sourcesOSM);
    }
    this.controlActions.addTo(this.mapManager.map);

    // Init configuration button control
    if(this.controlConfiguration) {
      this.mapManager.map.removeControl(this.controlConfiguration);
    }
    this.controlConfiguration = new SimpleGIS.Control.Configuration();
    this.controlConfiguration.init(dataConfig.fileContent, this.isLocalStorage, this.mapManager);
    this.controlConfiguration.addTo(this.mapManager.map);

    // Update description
    this.controlDescription.updateDescriptionObs(dataConfig.description);
  }

  /**
   * Load a new layer 
   * @param {string} - reference - The reference of the layer
   * @param {bool} - isOSM - True if is a OSM source
   * @param {bool} - updateLayerControl - 
   * @return{Promise} 
   */
  static showLayer(reference, isOSM, updateLayerControl)
  {
    return new Promise((resolve, reject) => {

      this.dataManager.loadSourcesDataFromReference(reference).then((dataSource) => {
        /* @param {SimpleGIS.Data.DataSource} - dataSource */

        this.mapManager.addLayerFromGeoJson(dataSource.reference, dataSource.layer);

        if(updateLayerControl && this.controlLayersSelect) {
          this.controlLayersSelect.updateCheckState(reference, true);
        }

        resolve();
      });
    });
  }

  /*
   * Remove a new layer 
   * @param {Event} - event - Event with name of the layer to hide
   */
  static hideLayer(event)
  {
    this.mapManager.removeLayer(event.detail.reference);

    if(event.detail.updateLayerControl && this.controlLayersSelect) {
      this.controlLayersSelect.updateCheckState(event.detail.reference, false);
    }
  }

  /*
   * Hide all layers in map
   * @param {bool} - updateLayerControl - Update the layer control
   */
  static hideAllLayers(updateLayerControl) 
  {
    this.mapManager.removeAllLayers();

    if(this.controlLayersSelect) {
      this.controlLayersSelect.updateAllCheckStates(false);
    }
  }

  /*
   * Reload the config and redisplay
   * @param {bool} - isLocalStorage - Load for use the local storage
   */
  static reloadConfig(isLocalStorage) 
  {
    this.isLocalStorage = isLocalStorage;

    this.dataManager.loadConfig(isLocalStorage).then(dataConfig => {
      let displayReferences = [];
      
      for (const ref in this.mapManager.layers) {
        if(this.mapManager.layers[ref]) {
          displayReferences.push(ref);
        }
      }

      SimpleGIS.Main.Main.reloadControlLayersSelect(dataConfig, displayReferences);

      this.mapManager.removeAllLayers();

      for(let i = 0; i < displayReferences.length; i++) {
        this.dataManager.loadSourcesDataFromReference(displayReferences[i]).then((dataSource) => {
          /* @param {SimpleGIS.Data.DataSource} - dataSource */
          
          this.mapManager.addLayerFromGeoJson(displayReferences[i], dataSource.layer);
        });
      }
    });
  }

  /**
   * Change the edit Mode (show or hide controls)
   * @param {bool} - editMode - Edit mode
   */
  static changeEditMode(editMode)
  {
    if(editMode) {
      let displayReferences = [];
      for (const ref in this.mapManager.layers) {
        if(this.mapManager.layers[ref]) {
          displayReferences.push(ref);
        }
      }

      this.controlLayersSelect.addTo(this.mapManager.map);
      this.controlLayersSelect.updateAllCheckStates(false);
      for(let i = 0; i < displayReferences.length; i++) {
        this.controlLayersSelect.updateCheckState(displayReferences[i], true);
      }
    }
    else {
      if(this.controlLayersSelect) {
        this.mapManager.map.removeControl(this.controlLayersSelect);
      }
    }
  }

  /**
   * Show the legend control
   * @param {string[]} - sourcesReferences - List of references of sources
   * @param {string[]} - sourcesReferencesOSM - List of references of OSM sources
   * @param {string} - description
   */
  static showLegend(sourcesReferences, sourcesReferencesOSM, description) {

    if(this.controlLegend) {
      this.mapManager.map.removeControl(this.controlLegend);
    }

    // Get sources
    let sources = [];
    for(let i = 0; i < sourcesReferences.length; i++) {
      sources.push(this.dataManager.config.dataSources.find(el => el.reference == sourcesReferences[i]));
    }
    for(let i = 0; i < sourcesReferencesOSM.length; i++) {
      sources.push(this.dataManager.config.dataSourcesOSM.find(el => el.reference == sourcesReferencesOSM[i]).source);
    }

    let legendHidden = this.controlLegend && this.controlLegend.contentDiv.style["display"] == "none";
    this.controlLegend = new SimpleGIS.Control.Legend(); 
    this.controlLegend.init(sources, description);
    this.controlLegend.addTo(this.mapManager.map);

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      legendHidden = true;
    }

    if(legendHidden) {
      this.controlLegend.changeVisibility(this.controlLegend.contentDiv, this.controlLegend.iconChangeVisibility, this.controlLegend.iconOpenAll);
    }
  }

  /**
   * Get params in the address bar
   * return {String[]}             Array of params get in address bar 
   */
  static getUrlParams()
  {
    // Get ars values of address bar
    var args = location.search.substr(1).split(/&/);
    var argsValues = [];

    for(var i =0; i < args.length; i++)
    {
      var tmp = args[i].split(/=/);
      if (tmp[0] != "") {
          argsValues[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp.slice(1).join("").replace("+", " "));
      }
    }

    return argsValues;
  }

  /**
   * Show the legend control
   * @param {object} - background - Background object
   */
  static changeBackGround(background)
  {
    // event.detail.background
    let tile = L.tileLayer(background.url, background.params)
    this.mapManager.addTile(tile);
  }

  /**
   * Show the legend control
   * @param {string[]} - sourcesReferences - List of references of sources
   * @param {string[]} - sourcesReferencesOSM - List of references of OSM sources
   * @param {string} - description
   */
  static enableViz(sourcesReferences, sourcesReferencesOSM, description)
  {
    let me = this;
    let promisesShowLayer = [];

    me.mapManager.spin(true);
    if(me.controlLegend) {
      me.controlLegend.hide();
    }

    SimpleGIS.Main.Main.hideAllLayers(true);

    for(let i = 0; i < sourcesReferences.length; i++) {
      promisesShowLayer.push(SimpleGIS.Main.Main.showLayer(sourcesReferences[i], false, true));
    }

    for(let i = 0; i < sourcesReferencesOSM.length; i++) {
      promisesShowLayer.push(SimpleGIS.Main.Main.showLayer(sourcesReferencesOSM[i], true, true));
    }

    Promise.all(promisesShowLayer).then(() => {

      SimpleGIS.Main.Main.showLegend(sourcesReferences, sourcesReferencesOSM, description);

      me.mapManager.spin(false);
    });
  }
}