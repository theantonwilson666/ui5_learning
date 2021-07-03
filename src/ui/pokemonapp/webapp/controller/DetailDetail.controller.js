sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("intheme.zui5_pokemons.controller.DetailDetail", {
		onInit: function () {

			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			this.getView().byId("dPage").setModel(this.getOwnerComponent().getModel("DataSets"));

			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onPokemonMatched, this);
		},

        _onPokemonMatched: function (oEvent) {
			this._pokemon = oEvent.getParameter("arguments").pokemon || this._pokemon || "0";
            this._move = oEvent.getParameter("arguments").move || this._move || "0";

            this.getView().byId("dPage").bindElement("/MoveSet('" + this._move + "')");
		},

		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/closeColumn");
			this.oRouter.navTo("detail", {layout: sNextLayout, pokemon: this._pokemon});
		}
	});
});
