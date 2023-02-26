
/*
 * Control for display and change backgrounds
 */
SimpleGIS.Control.BackgroundSelect = L.Control.extend({

  /*
   * @params {L.DomUtil} - div
   * @params {SimpleGIS.Data.BackgroundParams[]} - backgrounds - All config backgrounds
   * @params {number} - selectedBackgroundNumber - Number of selected background of backgrounds array
   * @params {boolean} - openAutocomplete - The auto complete is enable
   * @params {SimpleGIS.Data.BackgroundParams} - selectedBackground - The selected background
   */
  options: {
    position: 'topright'
  },

  /*
   * Init the UI
   * @params {SimpleGIS.Data.BackgroundParams[]} - backgrounds - All config backgrounds
   * @params {SimpleGIS.Data.BackgroundParams} - selectedBackground - Old selected background before reinit
   */
  init(backgrounds, selectedBackground) {

    if(this.div) {
      this.div.innerHTML = "";
    }
    else {
      this.div = L.DomUtil.create('div', 'leaflet-bar leaflet-control background-control');
    }
    
    this.backgrounds = backgrounds;
    this.selectedBackgroundNumber = 0;
    this.openAutocomplete = false;
    this.selectedBackground = null;
    let changeBackground = false;

    if(selectedBackground) {
      let reInit = true;
      for(let i = 0; i < this.backgrounds.length; i++) {
        if(this.backgrounds[i].name == selectedBackground.name) {
          this.selectedBackgroundNumber = i;
          this.selectedBackground = backgrounds[this.selectedBackgroundNumber];
          reInit = false;
        }
      }
      if(reInit) {
        this.selectedBackground = backgrounds[0];
        this.selectedBackgroundNumber = 0;
        changeBackground = true;
      }
    }
    else {
      this.selectedBackground = backgrounds[0];
    }

    let nameElement = null;

    if(backgrounds && backgrounds.length >= 2) {
      let title = L.DomUtil.create('h4', 'background-control-title', this.div);
      title.innerHTML = "Fond de plan :";

      // Init content
      let content = L.DomUtil.create('div', 'background-control-content', this.div);

      let leftArrow = L.DomUtil.create('i', 'fa-solid fa-chevron-left', content);
      L.DomEvent.on(leftArrow, 'click', function(e) { this.leftArrowClick(nameElement); }, this);

      nameElement = L.DomUtil.create('h3', 'background-control-name', content);
      nameElement.innerHTML = this.selectedBackground.name;
      L.DomEvent.on(nameElement, 'click', function(e) { this.nameClick(nameElement, backgrounds); }, this);

      let rightArrow = L.DomUtil.create('i', 'fa-solid fa-chevron-right', content);
      L.DomEvent.on(rightArrow, 'click', function(e) { this.rightArrowClick(nameElement); }, this);

      this.div.style['display'] = "inline-block";
    }
    else {
      this.div.style['display'] = "none";
    }

    if(changeBackground) {
      this.changeBackground(nameElement);
    }

    L.DomEvent.addListener(this.div, 'dblclick', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mousedown', L.DomEvent.stop);
    L.DomEvent.addListener(this.div, 'mouseup', L.DomEvent.stop);
  },

  /*
   * Event of click to right arrow
   * @params {L.DomUtil} - nameElement - The name DomUtil element
   */
  rightArrowClick: function(nameElement) {
    this.selectedBackgroundNumber ++;

    if(this.selectedBackgroundNumber >= this.backgrounds.length) {
      this.selectedBackgroundNumber = 0;
    }

    this.changeBackground(nameElement);
  },

    /*
   * Event of click to left arrow
   * @params {L.DomUtil} - nameElement - The name DomUtil element
   */
  leftArrowClick: function(nameElement) {
    this.selectedBackgroundNumber --;

    if(this.selectedBackgroundNumber < 0) {
      this.selectedBackgroundNumber = this.backgrounds.length - 1;
    }

    this.changeBackground(nameElement);
  },

  /*
   * Change selected background : dispatchEvent
   * @params {L.DomUtil} - nameElement - The name DomUtil element
   */
  changeBackground(nameElement) 
  {
    this.selectedBackground = this.backgrounds[this.selectedBackgroundNumber];
    if(nameElement) {
      nameElement.innerHTML = this.selectedBackground.name;
    }
    document.dispatchEvent(new CustomEvent('change-background', {detail: {background : this.selectedBackground}}));
  },


  /*
   * Click to the name : open list background
   * @params {L.DomUtil} - nameElement - The name DomUtil element
   */
  nameClick : function(nameElement) {

    let me = this;

    closeAllLists();

    if(!this.openAutocomplete) {
      let arr = [];
      for(let i = 0; i < this.backgrounds.length; i++) {
        if(this.selectedBackgroundNumber != i) {
          arr.push(this.backgrounds[i].name);
        }
      }

      let val = "";
      let a = L.DomUtil.create('div', 'autocomplete-items', this.div);

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {

            let b = L.DomUtil.create('div', '', a);
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);

            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

                b.addEventListener("click", function(e) {

                for(let i = 0; i < me.backgrounds.length; i++) {
                  if(me.backgrounds[i].name == e.target.innerText) {
                    me.selectedBackgroundNumber = i;
                  }
                }

                me.openAutocomplete = false;
                me.changeBackground(nameElement) 
                closeAllLists();
            });
        }
      }
    }

    this.openAutocomplete = !this.openAutocomplete;

    /* Close the background list */
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        //if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        //}
      }
    }
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