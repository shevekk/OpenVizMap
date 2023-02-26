/*
 * Default params fo the map
 */
SimpleGIS.Data.DefaultParams = class DefaultParams
{
  /*
   * @param {number} - zoom - Level of default zoom of the map
   * @param {number[]} - position - Default position of the map
   * @param {Object} - marker - Default marker params
   * @param {bool} - fullscreenControl - True if fullscreen control is visible
   * @param {string} - vizReference - Reference of default reference
   */
  constructor(zoom, position, marker, fullscreenControl, vizReference) 
  {
  	this.zoom = zoom;
  	this.position = position;
    this.marker = marker;
    this.fullscreenControl = fullscreenControl;
    this.vizReference = vizReference;
  }
}