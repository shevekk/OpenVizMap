/*
 * A background params config
 */
SimpleGIS.Data.BackgroundParams = class Background
{
  /*
   * @params{Object} - json - Config datas to read
   * @property{boolean} - noWrap - No Wrap
   * @property{string} - attribution - Text at right bottom of the map
   */
  constructor(json) 
  {
    this.noWrap = json['noWrap'];
    this.attribution = json['attribution'];
  }
}

/*
 * A background config
 */
SimpleGIS.Data.Background = class Background
{
  /*
   * @params{Object} - json - Config datas to read
   * @property{string} - type - Type (tile)
   * @property{string} - name - Display name
   * @property{string} - url - Url of the tiles
   * @property{SimpleGIS.Data.BackgroundParams} - params - Params of the background
   */
  constructor(json) 
  {
    this.type = json['type'];
    this.name = json['name'];
    this.url = json['url'];
    this.params = new SimpleGIS.Data.BackgroundParams(json['params']);

    this.params["attribution"] = `<a href="http://www.datavizdev.fr/OpenVizMap">OpenVizMap</a> | ${this.params["attribution"]}`;
  }
}