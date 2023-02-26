/*
 * OpenStreetMap source management
 */
SimpleGIS.Data.DataSourceOSM = class DataSourceOSM
{
   /*
    * @param {Object} - json - Data from config
    * @property {string} - name - Name of the file
    * @property {string} - reference - Reference of the file
    * @property {string} - type - The type of file (point, polygon, polyline)
    * @property {string} - description - Description of the source
    * @property {string} - group - Reference of the group
    * @property {string} - autoload - True if the file is load at the launch of the application 
    * @property {string[]} - content - Array of OSM query values
    * @property {string} - bbox - Numerical code of the city
    * @property {string} - city - If the city is not folded: management of the geographical area (rectangle)
    * @property {bool} - loaded - True if already loaded
    */
  constructor(json)
  {
    this.source = null;
    if(json['type'] == 'point') {
      this.source = new SimpleGIS.Data.DataSourcePoint(json["name"], json["reference"], json["sourceFile"], json["description"], json["style"], json["customStyles"], json["group"], json["popup"], json["autoload"]);
    }
    else if(json['type'] == 'polygon') {
      this.source = new SimpleGIS.Data.DataSourcePolygon(json["name"], json["reference"], json["sourceFile"], json["description"], json["style"], json["customStyles"], json["group"], json["popup"], json["autoload"]);
    }
    else if(json['type'] == 'polyline') {
      this.source = new SimpleGIS.Data.DataSourcePolyline(json["name"], json["reference"], json["sourceFile"], json["description"], json["style"], json["customStyles"], json["group"], json["popup"], json["autoload"]);
    }
    
    this.name = json["name"];
    this.reference = json["reference"];
    this.type = json["type"];
    this.autoload = json["autoload"];
    this.description = json["description"];
    this.group = json["group"];
    this.content = json['content'];
    this.bbox = json['bbox'];
    this.city = json['city'];

    this.loaded = false;
  }

  /*
   * Query OpenSteetMap API and create a geojson from query results
   * @param {SimpleGIS.Data.DefaultParams} - defaultParams - Default param of the map
   */
  loadGeoJson(defaultParams)
  {
    if(this.loaded) {
      return new Promise((resolve, reject) => {
        resolve(this.source);
      });
    }

    let query = "";
    if(this.type == "point") {
      let contentQuery = ``;
      let geocodeAreaQuery = ``;

      if(this.city) {
        geocodeAreaQuery += `area(id:${this.city})->.searchArea;`;
        this.bbox = "area.searchArea";
      }

      for(let i = 0; i < this.content.length; i++) {
        contentQuery += `node[${this.content[i]}](${this.bbox});`;
      }

      query = `
        [out:json][timeout:25];
        ${geocodeAreaQuery}
        (
          ${contentQuery}
        );
        out body;
        >;
        out skel qt;
      `;
    }
    else if(this.type == "polygon") {

      let contentQuery = ``;
      let geocodeAreaQuery = ``;

      if(this.city) {
        geocodeAreaQuery += `area(id:${this.city})->.searchArea;`;
        this.bbox = "area.searchArea";
      }

      for(let i = 0; i < this.content.length; i++) {
        contentQuery += `way[${this.content[i]}](${this.bbox});
        relation[${this.content[i]}](${this.bbox});`;
      }

      query = `
        [out:json][timeout:25];
        ${geocodeAreaQuery}
        (
          ${contentQuery}
        );
        out body;
        >;
        out skel qt;
      `;
    }
    else if(this.type == "polyline") {

      let contentQuery = ``;
      let geocodeAreaQuery = ``;

      if(this.city) {
        geocodeAreaQuery += `area(id:${this.city})->.searchArea;`;
        this.bbox = "area.searchArea";
      }

      for(let i = 0; i < this.content.length; i++) {
        contentQuery += `way[${this.content[i]}](${this.bbox});`;
      }

      query = `
        [out:json][timeout:25];
        ${geocodeAreaQuery}
        (
          ${contentQuery}
        );
        out body;
        >;
        out skel qt;
      `;
    }

    const encodedQuery = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

    return new Promise((resolve, reject) => {
      fetch(encodedQuery)
      .then((fileContent) => {
        // 
        const reader = fileContent.body.getReader();

        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                push();
              });
            }

            push();
          },
        });
      })
      .then((stream) =>
        // Respond with our stream
        new Response(stream, { headers: { 'Content-Type': 'text/html' } }).text()
      )
      .then((result) => {

        let jsonObj = JSON.parse(result);

        let geoJson = {};
        geoJson['type'] = 'FeatureCollection';
        geoJson['features'] = [];

        if(this.type == "point") {
          jsonObj.elements.forEach(element => {

            let feature = {};
            feature["type"] = "Feature";
            feature['geometry'] = {};

            feature['geometry']['type'] = "Point";
            feature['geometry']['coordinates'] = [element.lon, element.lat];
             
            let properties = [];
            if(element.tags && element.tags != {}) {
              properties = element.tags;
            }
            feature['properties'] = properties;

            geoJson['features'].push(feature);
          });
        }
        else if(this.type == "polygon" || this.type == "polyline") {
          jsonObj.elements.forEach(element => {

            if(element.type == "way") {

              let feature = {};
              feature["type"] = "Feature";

              feature['geometry'] = {};

              if(this.type == "polyline") {
                feature['geometry']['type'] = "LineString";
                feature['geometry']['coordinates'] = [];
                feature['geometry']['coordinates'].push();
              }
              else if(this.type == "polygon") {
                feature['geometry']['type'] = "Polygon";
                feature['geometry']['coordinates'] = [];
                feature['geometry']['coordinates'].push([]);
              }

              element.nodes.forEach(node => {
                let selectNode = jsonObj.elements.find(e => e.id == node);

                if(this.type == "polyline") {
                  feature['geometry']['coordinates'].push([selectNode.lon, selectNode.lat]);
                }
                else if(this.type == "polygon") {
                  feature['geometry']['coordinates'][0].push([selectNode.lon, selectNode.lat]);
                }
              });

              geoJson['features'].push(feature);

              let properties = [];
              if(element.tags && element.tags != {}) {
                properties = element.tags;
              }
              feature['properties'] = properties;
            }
          });
        }

        this.source.geoJson = geoJson;
        this.source.layer = L.geoJSON(geoJson);
        
        this.source.setLayerStyle(defaultParams);
        this.source.initLayerPopUpFromProps();

        this.loaded = true;

        resolve(this.source);
      })
      .catch((error) => {
        console.error('Echec du chargement du fichier de configuration : ', error);
        alert('Echec du chargement de la requête : ' + encodedQuery);
        reject();
      });
    });
  }
}