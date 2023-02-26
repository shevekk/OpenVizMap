/*
 * Button Viz
 */
SimpleGIS.Data.ButtonViz = class ButtonViz
{
  /*
   * @param {Object} - json - Data as a json object
   * @property {string} - name
   * @property {string} - reference
   * @property {string} - description
   * @property {SimpleGIS.Data.Icon} - icon
   * @property {string[]} - sources - sources references
   * @property {string[]} - sourcesOSM - references of OSM sources
   */
  constructor(json) 
  {
    this.name = json['name'];
    this.reference = json['reference'];
    this.description = json['description'];
    this.icon = new SimpleGIS.Data.Icon(json['icon']);
    this.sources = json['sources'];

    if(json['sourcesOSM']) {
      this.sourcesOSM = json['sourcesOSM'];
    }
    else {
      this.sourcesOSM = [];
    }
  }
}