sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("intheme.zui5_pokemons.controller.Master", {
		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
			this._bDescendingSort = false;
		},

		onListItemPress: function(oEvent) {
			var oContex = oEvent.getSource().getBindingContext();
			this.oRouter.navTo("detail", {layout: "TwoColumnsMidExpanded", pokemon: oContex.getProperty("PokemonName")});
		},
		
		onDeleteRow: function(oEvent) {
			var oListItem = oEvent.getParameter("listItem"),
				oContex = this;
			MessageBox.warning("Are you sure you want to remove the Pokemon?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function(sAction) {
					if (sAction === MessageBox.Action.YES) {
						oContex.deletePokemon(oListItem, oEvent);
					}
				}
			});
		},

		deletePokemon: function(oListItem) {
			this.getModel().remove(oListItem.getBindingContext().getPath());
		},

		onSaveChanges: function() {
			if (this.getModel().hasPendingChanges()) {
				this.getModel().submitChanges({
					success: function() {
						MessageToast.show("Success");
					}.bind(this),
					error: function() {
						MessageToast.show("Error");
					}.bind(this),
				});
			};
			
			this.setStateProperty("/editMode", false);
		},

		onCancelChanges: function() {
			if (this.getModel().hasPendingChanges()) {
				this.getModel().resetChanges();
			};
			this.setStateProperty("/editMode", false);
		},

		refreshTable: function() {
			this.getSmartTable().rebindTable();
		},

		getSmartTable: function() {
			return this.getView().byId("mainSmartTable");
		},

		setStateProperty: function(sPath, oValue, oContext, bAsyncUpdate) {
			return this.getModel("state").setProperty(
				sPath,
				oValue,
				oContext,
				bAsyncUpdate
			);
		},

		getModel: function(sName) {
			return (
				this.getOwnerComponent().getModel(sName) ||
				this.getView().getModel(sName)
			);
		}
	});
});