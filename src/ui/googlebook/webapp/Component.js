sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/m/Page",
	"sap/ui/core/mvc/View",
	"sap/ui/core/mvc/ViewType",
    "intheme/ivan_app/model/models",
    "sap/ui/core/BusyIndicator",
    "sap/ui/Device"

], function (
    UIComponent,
    Page,
	View,
	ViewType,
     Models, 
     BusyIndicator, 
     Device) {
    "use strict";
    //   debugger
    return UIComponent.extend("intheme.ivan_app.Component", {
              
        metadata: {
            manifest: "json"
        },

        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
        
            // enable routing
            this.getModel().attachMetadataLoaded(function () {
                this.getRouter().initialize();
                this.setModel(Models.createDeviceModel(),"device");
            }.bind(this))
          

            this.getModel().attachBatchRequestSent(function(){
                BusyIndicator.show(0);
            })

            this.getModel().attachBatchRequestCompleted(function(){
                BusyIndicator.hide();
            })
        },
      
    });
});