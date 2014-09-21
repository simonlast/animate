var RESIZE_DEBOUNCE = 200;


var WindowResize = {

  componentDidMount: function() {
    this.debouncedOnWindowResize = _.debounce(this.onWindowResize, RESIZE_DEBOUNCE);
    window.addEventListener("resize", this.debouncedOnWindowResize);
  },


  componentWillUnmount: function() {
    window.removeEventListener("resize", this.debouncedOnWindowResize);
  },


  /**
  * Mouse Events
  */

  onWindowResize: function(e) {
    if(_.isFunction(this.handleWindowResize)){
      this.handleWindowResize(e);
    }
  }

};


module.exports = WindowResize