sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("intheme.zui5_pokemons.controller.App", {
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
