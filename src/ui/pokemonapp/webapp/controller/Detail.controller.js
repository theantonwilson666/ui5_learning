sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function (Controller) {
	"use strict";

	return Controller.extend("intheme.zui5_pokemons.controller.Detail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("detail").attachPatternMatched(this._onPokemonMatched, this);
			this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onPokemonMatched, this);
		},

		onMovePress: function (oEvent) {
			var oContex = oEvent.getSource().getBindingContext();
			this.oRouter.navTo("detailDetail", {layout: "ThreeColumnsMidExpanded", pokemon: oContex.getProperty("PokemonName"), move: oContex.getProperty("MoveName")});
		},

		_onPokemonMatched: function (oEvent) {
			this.byId("ObjectPageLayout").bindElement("/PokemonSet('" + oEvent.getParameter("arguments").pokemon + "')/PokemonsInfo");
		},

		handleClose: function () {
			this.oRouter.navTo("master", {layout: "OneColumn"});
		}
	});
});
