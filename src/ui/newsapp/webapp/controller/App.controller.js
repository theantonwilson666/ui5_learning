sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (
	JSONModel, 
	Controller
	) {
	"use strict";

	return Controller.extend("intheme.NewsProject.controller.App", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		},

		onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel("state");
			var sLayout = oEvent.getParameters().arguments.layout;
			if (!sLayout) {
				sLayout = "OneColumn";
			}
			if (sLayout) {
				oModel.setProperty("/layout", sLayout);
			}
		},

		onExit: function () {
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}
	});
});
