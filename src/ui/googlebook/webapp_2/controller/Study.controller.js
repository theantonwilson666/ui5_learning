sap.ui.define(
    [
      "intheme/ivan_app/controller/Main.controller",
    ],
    function (Controller) {
      "use strict";
     
      return Controller.extend(
        "intheme.ivan_app.controller.Study",
        {
          onInit: function () {
            
            this.getRouter()
              .getRoute("StudyRoute")
              .attachPatternMatched(this._onRouteMatched, this);
              
          },
  
          _onRouteMatched: function (oEvent) {
          
          },
  
  
        })
    })