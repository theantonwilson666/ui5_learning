sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/Button",
		"sap/m/ButtonType",
		"sap/m/Text",
		"sap/m/Dialog",
		"sap/m/DialogType",
		"sap/m/MessageToast",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/m/ObjectListItem",
		"sap/m/ObjectAttribute",
		"sap/ui/core/Fragment",
		"sap/m/library",
		"sap/ui/model/odata/ODataMetadata"
	],
	function (
		Controller,
		JSONModel,
		Button,
		ButtonType,
		Text,
		Dialog,
		DialogType,
		MessageToast,
		BusyIndicator,
		MessageBox,
		ObjectListItem,
		ObjectAttribute,
		Fragment,
		fioriLibrary,
		ODataMetadata
	) {
		"use strict";

		return Controller.extend("intheme.NewsProject.controller.Master", {
			onInit: function () {
				var oSmartTable = this.getSmartTable(),
					oFilterBar = this.getView().byId("smartFilterBar");
				oSmartTable.setModel(this.getModel("DataSets"));
				oFilterBar.setModel(this.getModel("DataSets"));
				this.oRouter = this.getOwnerComponent().getRouter();
				this._bDescendingSort = false;
			},

			// _onRouteMatched: function () {
			// 	debugger;
			// 	var oSmartTable = this.byId("LineItemsSmartTable");
			// 	this.setStateProperty("/layout", "OneColumn");

			// 	if (oSmartTable) {
			// 		oSmartTable.getTable().removeSelections();
			// 	}
			// },

			// navTo: function (sName, oParameters, bReplace) {
			// 	this.getRouter().navTo(sName, oParameters, bReplace);
			// },

			getRouter: function () {
				return this.getOwnerComponent().getRouter();
			},

			getLineItem: function (i) {
				return this.getView()
					.byId("LineItemsSmartTable")
					.getTable()
					.getAggregation("items")[i]
					.getBindingContext().getObject();
			},

			setStateProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
				return this.getModel("state").setProperty(
					sPath,
					oValue,
					oContext,
					bAsyncUpdate
				);
			},

			//Получение Смарт таблицы
			getSmartTable: function () {
				return this.getView()
					.byId("LineItemsSmartTable");
			},

			//Функция по перепривязке (обновлении) таблицы
			rebindTable: function (oEvent) {
				this.getSmartTable()
					.rebindTable();
			},

			//Метод получения модели
			getModel: function (sName) {
				return (
					this.getOwnerComponent()
						.getModel(sName) ||
					this.getView()
						.getModel(sName)
				);
			},



			onPressColumnListItem: function (oEvent) {
				
				var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
					oNewsPath = oEvent.getSource().getBindingContext().getPath(),
					sNews = oNewsPath.substring(oNewsPath.indexOf("'") + 1, oNewsPath.lastIndexOf("'"));
				this.oRouter.navTo("detail", { layout: oNextUIState.layout, news: sNews });
			},

			submitChanges: function (oEvents) {
				return this.getModel().submitChanges(oEvents);
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
						MessageToast.show(this.i18n("SaveSuccess"));
						BusyIndicator.hide();
					}.bind(this),
					error: function () {
						MessageToast.show(this.i18n("SaveError"));
						BusyIndicator.hide();
					}.bind(this),
				});
			},

			//Routing
			// navTo: function (sName, oParameters, bReplace) {
			// 	this.getRouter().navTo(sName, oParameters, bReplace);
			// },

			// getRouter: function () {
			// 	return this.getOwnerComponent().getRouter();
			// },
		});
	});
