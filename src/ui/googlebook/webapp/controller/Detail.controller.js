sap.ui.define(
  [
    "intheme/ivan_app/controller/Main.controller",
  ],
  function (Controller) {
    "use strict";
   
    return Controller.extend(
      "intheme.ivan_app.controller.Detail",
      {
        onInit: function () {
          
          this.getRouter()
            .getRoute("DetailRoute")
            .attachPatternMatched(this._onRouteMatched, this);
            
        },

        _onRouteMatched: function (oEvent) {

        var oArr = oEvent.getParameter("arguments")["?query"];
        var sPath = this.getModel().createKey("/VolumeRegisterSet", {
					Id: oArr.BookID
				});

          this.getView()
            .byId("DetailForm")
            .bindElement(sPath);

          this.getView()
            .byId("OrderSmartTable")
            .bindElement(sPath);


          this.setStateProperty("/layout", "TwoColumnsBeginExpanded");
          this.setStateProperty("/pathForDia", sPath);
        },
       
        ShowDescr: function () {
      var  path = this.getStateProperty('/pathForDia')
           this.loadDialog.call(this, {
             sViewName: "intheme.ivan_app.view.fragment.Descr",
             sPath : path
           }).then(function (oFragment)
           {oFragment.open()})
		},

      })
  })