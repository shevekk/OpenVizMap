
/*
 * Control for change edit/viz Mode
 */
SimpleGIS.Control.EditButton = L.Control.extend({

  options: {
    position: 'topleft'
  },

  /*
   * Init the Control for change edit/viz mode
   * @params {bool} - editMode - True if is an edit mode
   */
  init(editMode) {
    this.div = L.DomUtil.create('div', 'action-button leaflet-bar leaflet-control');

    L.DomEvent.addListener(this.div, 'dblclick', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mousedown', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mouseup', L.DomEvent.stop);

    this.editMode = editMode;

    if(this.editMode) {
      this.button = L.DomUtil.create('a', 'fa-solid fa-eye', this.div);
      this.button.title = "Recharger la config";
    }
    else {
      this.button = L.DomUtil.create('a', 'fa-solid fa-pen-to-square', this.div);
      this.button.title = "Recharger la config";
    }

    L.DomEvent.on(this.button, 'click', (e) => {this.changeEditMode()}, this);
  },


  /*
   * Click button = change edit mode
   */
  changeEditMode() {
    this.editMode = !this.editMode;

    if(this.editMode) {
      this.button.className = 'fa-solid fa-eye';
      this.button.title = "Voir l'interface (mode édition)";
    }
    else {
      this.button.className = 'fa-solid fa-pen-to-square';
      this.button.title = "Cacher l'interface (mode visualisation)";
    }

    document.dispatchEvent(new CustomEvent('change-edit-mode', {detail: {editMode : this.editMode}}));
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
