if (typeof SimpleGIS == 'undefined') {
  SimpleGIS = {};
}

if (typeof SimpleGIS.Data == 'undefined') {
  SimpleGIS.Data = {};
}

/*
 * Manage data (Main data class)
 */
SimpleGIS.Data.DataManager = class DataManager
{
  /*
   * @param {string} - fileName - Name of the config file to load
   * @property {SimpleGIS.Data.DataSource[]} - dataSources - Manage sources and load content
   * @property {SimpleGIS.Data.DataSourceOSM[]} - dataSourcesOSM - Manage OSM sources and load content
   * @property {SimpleGIS.Data.DefaultParams} - defaultParams - Default param of the map
   * @property {SimpleGIS.Data.SourceGroup[]} - sourcesGroups - Groups of sources
   * @property {SimpleGIS.Data.ButtonViz} - buttonViz - Bouton viz/action config
   * @property {SimpleGIS.Data.Background} - backgrounds - Backgrounds config
   * @property {SimpleGIS.Data.DescriptionParams} - description - Description config
   * @property {bool} - editModeEnable - True if is edit mode (display edit control)
   * @property {string} - fileContent - The content of the config file
   */
  constructor(fileName) 
  { 
    this.fileName = fileName;
    this.initVar();
  }

  /*
   * Reinit all vars
   */
  initVar() 
  {
    this.dataSources = [];
    this.defaultParams = null;
    this.sourcesGroups = [];
    this.buttonViz = [];
    this.editModeEnable = false;
    this.backgrounds = [];
    this.dataSourcesOSM = [];
    this.fileContent = "";
  }

  /*
   * Load the software config
   * @return {SimpleGIS.Data.Config} - Config
   */
  loadConfig(isLocalStorage)
  {
    this.initVar();

    if(isLocalStorage) {
      return new Promise((resolve, reject) => {
        this.fileContent = localStorage.getItem('SimpleGis-configuration');

        let json = JSON.parse(this.fileContent);
        
        this.initConfigData(json);

        resolve(this.config);
      });
    }
    else {
      let fileUrl = `files/${this.fileName}.json?al=` + Math.floor(Math.random() * 10000);

      return new Promise((resolve, reject) => {
        fetch(fileUrl)
        .then((response) => response.json())
        .then((json) => {

          this.fileContent = JSON.stringify(json, null, 2);

          this.initConfigData(json);

          resolve(this.config);
        })
        .catch((error) => {
          console.error('Echec du chargement du fichier de configuration : ', error);
          alert('Echec du chargement du fichier de configuration : ' + fileUrl);
          reject();
        });
      });
    }
  }

  /*
   * 
   * @param {Object} - json - Object data from config file
   */
  initConfigData(json) {
    this.editModeEnable = json.params.editModeEnable;

    for(let i = 0; i < json.sources.length; i++) {
      if(this.dataSources.find(ds => ds.reference == json.sources[i]["reference"])) {
        console.warn(`La source référence "${json.sources[i]["reference"]}" est présente plusieurs fois.`);
      }
      
      if(json.sources[i]["type"] == "polygon") {
        this.dataSources.push(new SimpleGIS.Data.DataSourcePolygon(json.sources[i]["name"], json.sources[i]["reference"], json.sources[i]["sourceFile"], json.sources[i]["description"], json.sources[i]["style"], json.sources[i]["customStyles"], json.sources[i]["group"], json.sources[i]["popup"], json.sources[i]["autoload"]));
      }
      else if(json.sources[i]["type"] == "polyline") {
        this.dataSources.push(new SimpleGIS.Data.DataSourcePolyline(json.sources[i]["name"], json.sources[i]["reference"], json.sources[i]["sourceFile"], json.sources[i]["description"], json.sources[i]["style"], json.sources[i]["customStyles"], json.sources[i]["group"], json.sources[i]["popup"], json.sources[i]["autoload"]));
      }
      else if(json.sources[i]["type"] == "point") {
        this.dataSources.push(new SimpleGIS.Data.DataSourcePoint(json.sources[i]["name"], json.sources[i]["reference"], json.sources[i]["sourceFile"], json.sources[i]["description"], json.sources[i]["style"], json.sources[i]["customStyles"], json.sources[i]["group"], json.sources[i]["popup"], json.sources[i]["autoload"]));
      }
    }

    for(let i = 0; i < json.sourcesOSM.length; i++) {
      this.dataSourcesOSM.push(new SimpleGIS.Data.DataSourceOSM(json.sourcesOSM[i]));
    }

    this.defaultParams = new SimpleGIS.Data.DefaultParams(json.params.default.zoom, json.params.default.position, json.params.default.marker, json.params.default.fullscreenControl, json.params.default.vizReference);

    for(let i = 0; i < json.sourcesGroups.length; i++) {
      this.sourcesGroups.push(new SimpleGIS.Data.SourceGroup(json.sourcesGroups[i]["reference"], json.sourcesGroups[i]["name"], this.dataSources, this.dataSourcesOSM));
    }

    for(let i = 0; i < json.buttonViz.length; i++) {
      this.buttonViz.push(new SimpleGIS.Data.ButtonViz(json.buttonViz[i]));
    }

    for(let i = 0; json.backgrounds && i < json.backgrounds.length; i++) {
      this.backgrounds.push(new SimpleGIS.Data.Background(json.backgrounds[i]));
    }

    this.description = new SimpleGIS.Data.DescriptionParams(json.params.description);

    this.config = new SimpleGIS.Data.Config(this.fileContent, this.dataSources, this.dataSourcesOSM, this.defaultParams, this.sourcesGroups, this.buttonViz, this.backgrounds, this.description);
  }

  /*
   * Autoload data files with autoload = true
   * @return {SimpleGIS.Data.DataSource} - Selected source (loaded)
   */
  loadSourceDataAutoload()
  {
    let selectedSourcesDataLoad = []; 
    this.dataSources.forEach(dataSource => {
      /* @param {SimpleGIS.Data.DataSource} - dataSource */

      if (dataSource.autoload) {
        selectedSourcesDataLoad.push(dataSource.loadGeoJson(this.defaultParams));
      }
    });

    this.dataSourcesOSM.forEach(dataSourcesOSM => {
      /* @param {SimpleGIS.Data.DataSource} - dataSourcesOSM */

      if (dataSourcesOSM.autoload) {
        selectedSourcesDataLoad.push(dataSourcesOSM.loadGeoJson(this.defaultParams));
      }
    });

    return new Promise((resolve, reject) => {
      Promise.all(selectedSourcesDataLoad).then(() => {

        let selectedSourcesData = [];
        this.dataSources.forEach(dataSource => {
          /* @param {SimpleGIS.Data.DataSource} - dataSource */

          if (dataSource.autoload) {
              selectedSourcesData.push(dataSource);
          }
        });

        this.dataSourcesOSM.forEach(dataSourcesOSM => {
          /* @param {SimpleGIS.Data.DataSource} - dataSourcesOSM */

          if (dataSourcesOSM.autoload) {
              selectedSourcesData.push(dataSourcesOSM.source);
          }
        });

        resolve(selectedSourcesData);
      });
    });
  }

  /*
   * Load a data file from his name
   * @param {string} - fileName - Name of the data file to load
   * @return {SimpleGIS.Data.DataSource} - Selected source (loaded)
   */
  loadSourcesDataFromReference(sourceReference)
  {
    return new Promise((resolve, reject) => {

      let isOSM = false;
      let fileData = this.dataSources.find(f => f.reference == sourceReference);

      if(!fileData) {
        fileData = this.dataSourcesOSM.find(f => f.reference == sourceReference);
        isOSM = true;
      }

      if(fileData) {
        if(isOSM) {
            fileData.loadGeoJson(this.defaultParams).then((fileDataResult) => {
              resolve(fileDataResult);
          });
        }
        else {
          fileData.loadGeoJson(this.defaultParams).then((fileDataResult) => {
            resolve(fileData);
          });
        }
      }
      else {
        resolve(null);
      }
    });
  }
}