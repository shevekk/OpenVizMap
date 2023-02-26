/*
 * Icon data
 */
SimpleGIS.Data.Icon = class Icon
{
  /*
   * @param {Object} - json - Data as a json object
   * @property {string} - type - Type of icon ("font" or "svg")
   * @property {string} - value - Value (class or url)
   */
  constructor(json) 
  {
  	this.type = json['type'];
    this.value = json['value'];
  }
}