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
            UIComponent.prototype.init.apply(this, arguments);
        
            // this.getModel().attachMetadataLoaded(function () {
            //     this.getRouter().initialize();
            //     this.setModel(Models.createDeviceModel(),"device");
            // }.bind(this))
          

            // this.getModel().attachBatchRequestSent(function(){
            //     BusyIndicator.show(0);
            // })

            // this.getModel().attachBatchRequestCompleted(function(){
            //     BusyIndicator.hide();
            // })
        },

        createContent: function(){
             
			var oContainer = new Page();
			var oModel = this.getModel();
			var oMetaModel = oModel.getMetaModel();
			var sPath = null;

			var oDeviceModel = Models.createDeviceModel();
			this.setModel(oDeviceModel, "device");


			var oStateModel = this.getModel("state");

			oMetaModel.loaded().then(function(){
				return oModel.annotationsLoaded();
			}).then(function(){

				sPath = oModel.createKey("/VolumeRegisterSet", {
					Id: "QFXgCgAAQBAJ"
				});

				return View.create({
					type: ViewType.XML,
					viewName: "intheme.ivan_app.view.Template",
					preprocessors: {
						xml: {
							bindingContexts:{
								meta: oMetaModel.getMetaContext(sPath),
								device: oDeviceModel.createBindingContext("/system")
							},
							models: {
								meta: oMetaModel,
								device: oDeviceModel,
								json: oStateModel
							}
						}
					}
				});
			}).then(function(oView){
				oView.bindElement({
					path: sPath
				});

				oContainer.addContent(oView);
			});

			return oContainer;
		}

      

    });
});