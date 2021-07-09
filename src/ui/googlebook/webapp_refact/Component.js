sap.ui.define([
    "sap/ui/core/UIComponent",
    "intheme/ivan_app/model/models",
    "sap/ui/core/BusyIndicator",
    "sap/ui/Device"

], function (UIComponent, models, BusyIndicator, Device) {
    "use strict";
    //   debugger
    return UIComponent.extend("intheme.ivan_app.Component", {
              
        metadata: {
            manifest: "json"
        },

        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            
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
        }
    });
});