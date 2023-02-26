/*
 * Sources groups
 */
SimpleGIS.Data.SourceGroup = class SourceGroup
{
  /*
   * @param {string} - reference - Reference of the group
   * @param {string} - name - Name of the group
   * @param {Array[string]} - childrenNames - List of name of childrens
   * @property {Array[SimpleGIS.Data.DataSource]} - dataSources - List of data sources
   * @property {Array[SimpleGIS.Data.DataSourceOSM]} - dataSourcesOSM - List of data sourcesOSM
   */
  constructor(reference, name, dataSources, dataSourcesOSM) 
  {
    this.reference = reference;
    this.name = name;
    this.childrenNames = [];
    this.childrenReferences = [];

    for(let i = 0; dataSources && i < dataSources.length; i++) {
      if(dataSources[i].group == this.reference) {
        this.childrenNames.push(dataSources[i].name);
        this.childrenReferences.push(dataSources[i].reference);
      }
    }

    for(let i = 0; dataSourcesOSM && i < dataSourcesOSM.length; i++) {
      if(dataSourcesOSM[i].group == this.reference) {
        this.childrenNames.push(dataSourcesOSM[i].name);
        this.childrenReferences.push(dataSourcesOSM[i].reference);
      }
    }
  }
}