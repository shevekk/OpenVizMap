
/*
 * Control of the actions
 */
SimpleGIS.Control.Actions = L.Control.extend({

  options: {
    position: 'topleft'
  },

  /*
   * Init the control of action
   * @property {L.DomUtil[]} - buttons - All actions button
   */
  init() {
    this.div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

    L.DomEvent.addListener(this.div, 'dblclick', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mousedown', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mouseup', L.DomEvent.stop);

    this.buttons = [];
  },

  /*
   * Add a new button
   * @param {string} - name
   * @param {string} - iconType
   * @param {string} - iconValue
   * @param {string} - description
   * @param {string[]} - sources - List of sources reference
   * @param {string[]} - sourcesOSM - List of sources OSM reference
   */
  addButton(name, iconType, iconValue, description, sources, sourcesOSM) {
    this.buttons.push(L.DomUtil.create('a', 'action-button ' + iconValue, this.div));
    this.buttons[this.buttons.length - 1].title = description;

    let selectedButton = this.buttons[this.buttons.length - 1];

    L.DomEvent.on(this.buttons[this.buttons.length - 1], 'click', (e) => {this.enabledViz(sources, sourcesOSM, description, selectedButton)}, this);
  },
  
  /*
   * Enable a dataViz, hide all source and show the selected layers sources
   * @param {string[]} - sources - List of sources reference
   * @param {string[]} - sourcesOSM - List of sources OSM reference
   * @param {string} - description - Description of the viz
   * @param {L.DomUtil} - targetButton - Target button (button of click)
   */
  enabledViz(sources, sourcesOSM, description, targetButton) 
  {
    for(let key in this.buttons) {
      this.buttons[key].style = "";
    }
    targetButton.style = "color:#C58F22;background-color: #F4ECDD"

    document.dispatchEvent(new CustomEvent('enable-viz', {detail: {sourcesReferences : sources, sourcesReferencesOSM : sourcesOSM, description : description}}));
  },

  /*
   * Add control to the map and init html
   * @param {L.Map} - map
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