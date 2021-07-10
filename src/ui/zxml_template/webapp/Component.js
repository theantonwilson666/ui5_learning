sap.ui.define([
    "sap/ui/core/UIComponent",
	"sap/m/Page",
	"sap/ui/core/mvc/View",
	"sap/ui/core/mvc/ViewType",
	"z/xml/tmpl/module/TemplateUtils",
	"z/xml/tmpl/module/Models"
], function (
    UIComponent,
	Page,
	View,
	ViewType,
	TemplateUtils,
	Models
) {
	"use strict";

	return UIComponent.extend("z.xml.tmpl.Component", {

		metadata : {
			manifest : "json"
		},

		init : function () {
			UIComponent.prototype.init.apply(this, arguments);
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

				sPath = oModel.createKey("/TableTypeSet", {
					Type: "TAB1"
				});

				debugger

				return View.create({
					type: ViewType.XML,
					viewName: "z.xml.tmpl.view.Template",
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