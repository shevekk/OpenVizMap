/*
 * Description params
 */
SimpleGIS.Data.DescriptionParams = class Description
{
  /*
   * @param {Object} - json - json data
   * @param {bool} - enable - True if data, display control
   * @param {string} - html - Html content
   * @param {string} - creator - Creator name
   * @param {string} - creatorWebsite - Website avec the cretor
   * @param {string} - title - Title of the description
   */
  constructor(json) 
  {
    if(json) {
      this.enable = true;

      this.html = json["html"];
      this.creator = json["creator"];
      this.creatorWebsite = json["creatorWebsite"];
      this.title = json["title"];
    }
    else {
      this.enable = false;
    }
  }
}