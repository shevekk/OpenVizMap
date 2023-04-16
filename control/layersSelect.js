if (typeof SimpleGIS == 'undefined') {
  SimpleGIS = {};
}

if (typeof SimpleGIS.Control == 'undefined') {
  SimpleGIS.Control = {};
}

/*
 * Store data of a layer Group
 */
SimpleGIS.Control.LayersGroup = class LayersGroup
{
  /*
   * @param {string[]} - names - names of layer
   * @param {string[]} - references - references  of layer
   * @param {string[]} - names - of OSM layer
   * @param {string[]} - namesOSM - referencesOSM - references of OSM layer
   * @property {object[]} - data - Object with names and reference
   */
  constructor(names, references, namesOSM, referencesOSM) 
  {
    this.names = names;
    this.references = references;
    this.namesOSM = namesOSM;
    this.referencesOSM = referencesOSM;

    this.data = [];
    for(let i = 0; this.names && i < this.names.length; i++) {
      this.data.push({name : this.names[i], reference : this.references[i], isOSM : false});
    }
    for(let i = 0; this.namesOSM && i < this.namesOSM.length; i++) {
      this.data.push({name : this.namesOSM[i], reference : this.referencesOSM[i], isOSM : true});
    }
  }
}

/*
 * Control of the layer selection
 */
SimpleGIS.Control.LayersSelect = L.Control.extend({

  options: {
    position: 'topright'
  },

  /*
   * Init the UI data
   * @property {L.DomUtil[]} - divGroups - List of groups Html elements
   * @property {L.DomUtil[]} - divLines - List of lines Html elements
   * @property {Object(SimpleGIS.Control.LayersGroup)} - groups - Groups containing the names of the layers
   * @property {Object(L.DomUtil)} - checkbox - Checkbox for a source
   * @property {Object(L.DomUtil)} - checkboxGroups - Checkbox for a group
   */
  init() 
  {
    this.div = L.DomUtil.create('div', 'leaflet-bar leaflet-control layers-control');

    let controlTitle = L.DomUtil.create('h2', 'title-control', this.div);
    controlTitle.innerHTML += "Layers";

    L.DomEvent.addListener(this.div, 'dblclick', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mousedown', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mouseup', L.DomEvent.stop);

    this.divGroups = [];
    this.divLines = [];

    this.groups = {};

    this.checkbox = {};
    this.checkboxGroups = {};
  },

  /*
   * All a groups with list of sources
   * @params {String[]} - dataSourcesReferencesChecked - References of the checked sources
   */
  addCheckedSources(dataSourcesReferencesChecked) 
  {
    this.dataSourcesReferencesChecked = dataSourcesReferencesChecked;
  },

  /*
   * All a groups with list of sources
   * @params {String} - groupName - Name of the groups
   * @params {String} - groupRef - Reference of the groups
   * @params {String[]} - dataSourcesNames - Names of the sources
   * @params {String[]} - dataSourcesReferences - References of the sources
   * @params {String[]} - dataSourcesNamesOSM - Names of the sources OSM
   * @params {String[]} - dataSourcesReferencesOSM - References of the sources OSM
   */
  addGroupSources(groupName, groupRef, dataSourcesNames, dataSourcesReferences, dataSourcesNamesOSM, dataSourcesReferencesOSM) 
  {
    this.groups[groupRef] = new SimpleGIS.Control.LayersGroup(dataSourcesNames, dataSourcesReferences, dataSourcesNamesOSM, dataSourcesReferencesOSM);

    this.divGroups.push(L.DomUtil.create('div', 'control-sourceSelect-group', this.div));

    let divTitle = L.DomUtil.create('div', 'control-sourceSelect-group-title', this.divGroups[this.divGroups.length - 1]);
    let divTitleIcon = L.DomUtil.create('i', 'fa-solid fa-angle-up', divTitle);
    this.checkboxGroups[groupRef] = L.DomUtil.create('input', 'control-sourceSelect-title-input', divTitle);
    this.checkboxGroups[groupRef].type = "checkbox";
    let divTitleText = L.DomUtil.create('h3', '', divTitle);
    divTitleText.innerHTML = groupName;

    let divContent = L.DomUtil.create('div', 'control-sourceSelect-content', this.divGroups[this.divGroups.length - 1]);
    for(let i = 0; i < this.groups[groupRef].data.length; i++) {
      this.addSource(this.groups[groupRef].data[i].name, this.groups[groupRef].data[i].reference, divContent, this.groups[groupRef].data[i].isOSM);
    }

    L.DomEvent.on(divTitleIcon, 'click', (e) => {this.changeGroupVisibility(e, divTitleIcon, divContent)}, this);

    L.DomEvent.on(this.checkboxGroups[groupRef], 'click', (e) => {this.changeGroupSelection(e, this.groups[groupRef])}, this);
  },

  /*
   * Add list of others sources (sources with no groups)
   * @params {String[]} - dataSourcesNames - Names of the sources
   * @params {String[]} - dataSourcesReferences - References of the sources
   * @params {bool} - isOSM - True if is OSM source
   */
  addOthersSources(dataSourcesNames, dataSourcesReferences, isOSM) 
  {
    for(let i = 0; i < dataSourcesNames.length; i++) {
      this.addSource(dataSourcesNames[i], dataSourcesReferences[i], this.div, isOSM);
    }
  },

  /*
   * Add a source
   * @params {String} - sourceName - Name of the source
   * @params {String} - sourceReference - Reference of the source
   * @params {L.DomUtil} - parentHTML - The parent html element of the source line
   * @params {bool} - isOSM - True if is OSM source
   */
  addSource(sourceName, sourceReference, parentHTML, isOSM) 
  {
    this.divLines.push(L.DomUtil.create('div', 'control-sourceSelect-line', parentHTML));

    this.checkbox[sourceReference] = L.DomUtil.create('input', 'control-sourceSelect-line', this.divLines[this.divLines.length - 1]);
    this.checkbox[sourceReference].id = `source_${sourceReference}`;
    this.checkbox[sourceReference].type = "checkbox";
    this.checkbox[sourceReference].name = sourceReference;
    this.checkbox[sourceReference].isOSM = isOSM;

    let label = L.DomUtil.create('label', 'checkbox-select-layer-name', this.divLines[this.divLines.length - 1]);
    label.innerHTML = sourceName;
    label.for = `source_${sourceReference}`;

    if(this.dataSourcesReferencesChecked.includes(sourceReference)) {
      this.checkbox[sourceReference].checked = true;
    }

    L.DomEvent.on(this.divLines[this.divLines.length - 1], 'click', (e) => {this.changeCheckedLine(e)}, this);
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
   * Check source = event display layer
   * @params {Event} - e - Checkbox html event
   */
  changeCheckedLine(e) 
  {
    let checked = e.currentTarget.children[0].checked;
    let reference = e.currentTarget.children[0].name;
    let isOSM = e.currentTarget.children[0].isOSM;

    if(e.srcElement.type != "checkbox") {
      checked = !checked;
      e.currentTarget.children[0].checked = checked;
    }

    if(reference != "" && reference != null) {
      if(checked) {
        document.dispatchEvent(new CustomEvent('show-layer', {detail: {reference : reference, isOSM : isOSM}}));
      }
      else {
        document.dispatchEvent(new CustomEvent('hide-layer', {detail: {reference : reference}}));
      }
    }
    else {
      console.log("Empty reference for change visibility layer");
    }

    // Manage auto check groups
    for (const groupRef in this.groups) 
    {
      let checked = true;
      for(let i = 0; i < this.groups[groupRef].data.length; i++) {
        if(!this.checkbox[this.groups[groupRef].data[i].reference].checked) {
          checked = false;
        }
      }
      this.checkboxGroups[groupRef].checked = checked;
    }
  },

  /*
   * Check a group of sources = event display layer for all sources
   * @params {Event} - e - Html event
   * @params {String[]} - groupData - List of sources
   */
  changeGroupSelection(e, groupData) 
  {
    let checked = false;
    let isOSM = false;
    if(e.srcElement.getElementsByClassName('checkbox-select-group').length > 0) {
      checked = e.srcElement.getElementsByClassName('checkbox-select-group')[0].checked;
      isOSM = e.srcElement.getElementsByClassName('checkbox-select-group')[0].isOSM;
    }
    else {
      checked = e.srcElement.checked;
      isOSM = e.srcElement.isOSM;
    }

    for(let i = 0; i < groupData.data.length; i++) {
      if(checked) {
        document.dispatchEvent(new CustomEvent('show-layer', {detail: {reference : groupData.data[i].reference, isOSM : isOSM}}));
      }
      else {
        document.dispatchEvent(new CustomEvent('hide-layer', {detail: {reference : groupData.data[i].reference}}));
      }

      this.checkbox[groupData.data[i].reference].checked = checked;
    }
  },

  /*
   * Change the visibility of a group content
   * @params {Event} - e - Html event
   * @params {L.DomUtil} - divTitleIcon - Icon of the title
   * @params {L.DomUtil} - divContent - Content of the group div
   */
  changeGroupVisibility(e, divTitleIcon, divContent) 
  {
    if(divContent.style["display"] == "none")
    {
      divContent.style["display"] = "inline-block";
      divTitleIcon.className = "fa-solid fa-angle-up";
    }
    else
    {
      divContent.style["display"] = "none";
      divTitleIcon.className = "fa-solid fa-angle-down";
    }
  },

  /*
   * Update a checkbox value from reference
   * @params {string} - reference
   * @params {bool} - checkedState
   */
  updateCheckState(reference, checkedState) 
  {
    if(this.checkbox[reference]) {
      this.checkbox[reference].checked = checkedState;
    }
  },

  /*
   * Update all checkbox value
   * @params {bool} - checkedState
   */
  updateAllCheckStates(checkedState) 
  {
    for (const reference in this.checkbox) {
      this.checkbox[reference].checked = checkedState;
    }
  },

  /*
   * Remove control
   * @params {L.Map} - map
   */
  onRemove: function(map)
  {
  }
});