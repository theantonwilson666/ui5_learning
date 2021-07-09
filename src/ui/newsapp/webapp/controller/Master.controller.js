sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (
	Controller
) {
	"use strict";

	return Controller.extend("intheme.NewsProject.controller.Master", {
		onInit: function () {
			this.oRouter = this.getRouter();
			this._bDescendingSort = false;
		},

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		//Получение Смарт таблицы
		getSmartTable: function () {
			return this.byId("LineItemsSmartTable");
		},

		//Функция по перепривязке (обновлению) таблицы
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
		}
	});
});
