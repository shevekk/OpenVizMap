/*
 * Manage Config
 */
SimpleGIS.Data.Config = class Config
{
	/*
	 * @param {SimpleGIS.Data.DataSource[]} - dataSources - Manage sources and load content
	 * @param {SimpleGIS.Data.DataSourceOSM[]} - dataSourcesOSM - Manage OSM sources and load content
     * @param {SimpleGIS.Data.DefaultParams} - defaultParams - Default param of the map
     * @param {SimpleGIS.Data.SourceGroup[]} - sourcesGroups - Groups of sources
     * @param {SimpleGIS.Data.ButtonViz} - buttonViz - Bouton viz/action config
     * @param {SimpleGIS.Data.Background} - backgrounds - Backgrounds config
     * @param {SimpleGIS.Data.DescriptionParams} - description - Description config
	 */
	constructor(fileContent, dataSources, dataSourcesOSM, defaultParams, sourcesGroups, buttonViz, backgrounds, description) 
	{ 
		this.fileContent = fileContent;
		this.dataSources = dataSources;
		this.dataSourcesOSM = dataSourcesOSM;
		this.defaultParams = defaultParams;
		this.sourcesGroups = sourcesGroups;
		this.buttonViz = buttonViz;
    	this.backgrounds = backgrounds;
    	this.description = description;
	}
}