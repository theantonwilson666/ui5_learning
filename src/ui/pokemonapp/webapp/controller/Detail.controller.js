sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function (Controller) {
	"use strict";

	return Controller.extend("intheme.zui5_pokemons.controller.Detail", {
		onInit: function () {

			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			this.getView().byId("ObjectPageLayout").setModel(this.getOwnerComponent().getModel("DataSets"));
			
			this.oRouter.getRoute("detail").attachPatternMatched(this._onPokemonMatched, this);
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onPokemonMatched, this);
		},

		onMovePress: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2),
				sPokemonPath = oEvent.getSource().getBindingContext().getPath(),
				sPokemonAndMove = sPokemonPath.substring(sPokemonPath.indexOf("'") + 1, sPokemonPath.lastIndexOf("'")),
				sPokemon = sPokemonAndMove.substring(0, sPokemonAndMove.indexOf("'")),
				sMove = sPokemonAndMove.substring(sPokemonAndMove.lastIndexOf("'") + 1);
			this.oRouter.navTo("detailDetail", {layout: oNextUIState.layout, pokemon: sPokemon, move: sMove});
		},

		_onPokemonMatched: function (oEvent) {
			this._pokemon = oEvent.getParameter("arguments").pokemon || this._pokemon || "0";

			this.getView().byId("ObjectPageLayout").bindElement("/PokemonSet('" + this._pokemon + "')/PokemonsInfo");
		},

		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {layout: sNextLayout});
		}
	});
});
