sap.ui.define(
  [
    "intheme/ivan_app/controller/Main.controller",
    "sap/m/Dialog",
    "sap/ui/model/json/JSONModel",
      "sap/ui/core/Fragment",
      "intheme/ivan_app/formatter/myformatter"
  ],
  function (Controller, Dialog, JSONModel, Fragment,Formatter) {
    "use strict";
   
    return Controller.extend(
      "intheme.ivan_app.controller.Detail",
      {
        myformatter: Formatter,
        onInit: function () {
          // debugger
          this.getRouter()
            .getRoute("DetailRoute")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
          // debugger
          var oArr = oEvent.getParameter("arguments")["?query"];
          this.getView()
            .byId("DetailForm")
            .bindElement("/VolumeRegisterSet('"+oArr.BookID+"')");

          this.getView()
            .byId("OrderSmartTable")
            .bindElement("/VolumeRegisterSet('"+oArr.BookID+"')");


          var pe = "/VolumeRegisterSet('"+oArr.BookID+"')";

          this.setStateProperty("/layout", "TwoColumnsBeginExpanded");
          this.setStateProperty("/pathForDia", pe);



          debugger
        },
        problemfix:function(oEvent){
        
        console.log(oEvent.getSource().getBindingContext().getProperty('Id'))
          //  debugger
        },
        ShowDescr: function () {
		
      var  po = this.getStateProperty('/pathForDia')

         debugger
           this.loadDialog.call(this, {
           
             sViewName: "intheme.ivan_app.view.fragment.Descr",
             sPath : po
           }).then(function (oFragment)
           {oFragment.open()})


		},
 getStateProperty: function (sPath, oContext) {
      return this.getModel("state").getProperty(sPath, oContext);
    },
    loadDialog: function (oParams) {
			if (!this[oParams.sDialogName]) {
				return Fragment.load({
					id: this.getView().sId,
					type: "XML",
					name: oParams.sViewName,
					controller: (oParams.controller) ? oParams.controller : this
				}).then(function (oDialog) {
					this[oParams.sDialogName] = oDialog;
					if (oParams.sPath) { this[oParams.sDialogName].bindElement(oParams.sPath); }
					if (oParams.bAddDependent === undefined || oParams.bAddDependent === true) {
						this.getView().addDependent(this[oParams.sDialogName]);
					}
					if (!$.isArray(this[oParams.sDialogName])) { this[oParams.sDialogName].setBusyIndicatorDelay(0); }
					return this[oParams.sDialogName];
				}.bind(this));
			} else {
        	if (oParams.sPath) { this[oParams.sDialogName].bindElement(oParams.sPath); }
				return new Promise(function (res) {
					res(this[oParams.sDialogName]);
				}.bind(this));
			}
		},



      })
  })