if (typeof SimpleGIS == 'undefined') {
  SimpleGIS = {};
}

if (typeof SimpleGIS.Map == 'undefined') {
  SimpleGIS.Map = {};
}

/*
 * Manager of the layer map
 */
SimpleGIS.Map.MapManager = class Map
{
  /*
   * @property {L.Map} - map
   * @property {L.Layer} - layer - Layers objects
   */
  constructor() 
  {
    this.map = null;
    this.layers = {};
    this.selectedTile = null;
  }

  /*
   * Init the map
   * @param {string} - divNameHtml - Html name of the map div
   * @param {number} - zoom - Level of default zoom of the map
   * @param {Array[number]} - position - Default position of the map
   * @param {bool} - fullscreenControl - True if fullscreen control is visible
   */
  init(divNameHtml, position, zoom, fullscreenControl, tile)
  {
    this.map = L.map(divNameHtml, {preferCanvas : true, fullscreenControl: fullscreenControl}).setView(position, zoom);

    this.selectedTile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  /*
   * Show/Hide spin
   * @param {bool} - spinState - True show spin / False hide spin
   */
  spin(spinState) {
    this.map.spin(spinState);
  }

  /*
   * Add a layer in the map
   * @param {string} - reference - Reference of the layer
   * @param {L.Layer} - layer - The layer to add
   */
  addLayerFromGeoJson(reference, layer)
  {
    // _leaflet_id
    if(!this.layers[reference]) {
      this.layers[reference]=layer; 
      this.layers[reference].addTo(this.map);
    }
  }

  /*
   * Remove a layer in the map
   * @param {string} - reference - Reference of the layer to remove
   */
  removeLayer(reference) 
  {
    if(this.layers[reference]) {
      this.map.removeLayer(this.layers[reference]);
      this.layers[reference] = null;
    }
    else {
      console.log(`Layer ${reference} don't exist in MapManager`);
    }
  }

  /*
   * Remove all layers display in map
   */
  removeAllLayers() 
  {
    for (const reference in this.layers) {
      if(this.layers[reference]) {
        this.map.removeLayer(this.layers[reference]);
        this.layers[reference] = null;
      }
    }
  }

  /*
   * Change the map tile
   * @param {string} - tile - Tile data
   */
  addTile(tile)
  {
    if(this.selectedTile) {
      this.map.removeLayer(this.selectedTile);
    }

    this.selectedTile = tile.addTo(this.map);
  }
}