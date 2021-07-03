sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, BusyIndicator, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("intheme.zui5_pokemons.controller.Master", {
		onInit: function () {
			var oSmartTable = this.getSmartTable(),
				oFilterBar = this.getView().byId("smartFilterBar");
			oSmartTable.setModel(this.getModel("DataSets"));
			oFilterBar.setModel(this.getModel("DataSets"));
			this.oRouter = this.getOwnerComponent().getRouter();
			this._bDescendingSort = false;
			this.oRouter.navTo("master", {layout: 'OneColumn'});
		},

		onListItemPress: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				pokemonPath = oEvent.getSource().getBindingContext().getPath(),
				pokemon = pokemonPath.substring(pokemonPath.indexOf("'") + 1, pokemonPath.lastIndexOf("'"));
			this.oRouter.navTo("detail", {layout: oNextUIState.layout, pokemon: pokemon});
		},
		
		onDeleteRow: function (oEvent) {
			var oListItem = oEvent.getParameter("listItem"),
				oContex = this;
			MessageBox.warning("Are you sure you want to remove the Pokemon?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.YES) {
						oContex.deletePokemon(oListItem, oEvent);
					}
				}
			});
		},

		deletePokemon: function (oListItem, oEvent) {
			BusyIndicator.show();
			this.getModel("DataSets").remove(oListItem.getBindingContext().getPath());
			this.onSaveChanges(oEvent);
			BusyIndicator.hide();
		},

		onSaveChanges: function (oEvent) {
			BusyIndicator.show();
			var oTable = this.getSmartTable().getTable();
			var mItems = oTable.getItems();
			mItems.forEach(
				function (oItem) {
					if (oItem.getBindingContext().bCreated) {
						oTable.removeItem(oItem);
					}
			  	}.bind(this)
			);
	
			this.submitChanges({
				success: function () {
					MessageToast.show("Success");
					BusyIndicator.hide();
			  	}.bind(this),
			  	error: function () {
					MessageToast.show("Error");
					BusyIndicator.hide();
			  	}.bind(this),
			});
			this.setStateProperty("/editMode", false);
			BusyIndicator.hide();
		},

		onCancel: function (oEvent) {
			this.setStateProperty("/editMode", false);
		},

		refreshTable: function() {
			this.getSmartTable().rebindTable();
		},

		submitChanges: function (oEvents) {
			return this.getModel("DataSets").submitChanges(oEvents);
		},

		getSmartTable: function () {
			return this.getView().byId("LineItemsSmartTable");
		},

		setStateProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
			return this.getModel("state").setProperty(
				sPath,
				oValue,
				oContext,
				bAsyncUpdate
			);
		},

		getModel: function (sName) {
			return (
				this.getOwnerComponent().getModel(sName) ||
				this.getView().getModel(sName)
			);
		}
	});
});