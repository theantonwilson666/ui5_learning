sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/base/Log",
	"sap/ui/core/format/DateFormat",
	"sap/m/Image",
	"sap/ui/core/HTML"
], function (Controller, Log, DateFormat, Image, HTML) {

	"use strict";

	return Controller.extend("intheme.NewsProject.controller.Nasa", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			var oSplitApp = this.getView().byId("SplitApp");
			oSplitApp.setModel(this.getOwnerComponent().getModel());
			this.onInitApod();
		},

		onInitApod: function () {
			var oDateFormat = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
			var sDate = oDateFormat.format(new Date());
			var sRequest = "/APODSet('" + sDate + "')";
			// sRequest = "/APODSet('2021-07-06')";                    // Проверка вывода картинки
			// sRequest = "/APODSet('2021-07-07')";                    // Проверка вывода видео
			this.byId("APODPage").bindElement(sRequest);
			sRequest = sRequest.replace('/', '')
			var that = this;
			this.getOwnerComponent().getModel().attachBatchRequestCompleted(function(oEvent) {
				oEvent.getParameter('requests').forEach(oRequest => {
					if (oRequest.url.indexOf(sRequest) !== -1) {
						var oModel = that.getOwnerComponent().getModel().getProperty(that.byId("APODPage").getElementBinding().sPath);
						that.onMediaPlace(oModel.media_type, oModel.url);
					}
				});
			});
		},

		//Метод динамического определения картинки/видео
		onMediaPlace: function (sMedia, sUrl) {
			var oContentCell = this.byId("ContentCell");
			var oContent;
			switch (sMedia) {
				case "video":
					oContent = new HTML("video_html", {
						content: "<iframe width='99%' height='300px' src='" + sUrl + "'>" +
							     "</iframe>"
					});
					break;
				case "image":
					oContent = new Image({
						src: sUrl,
						width: "99%"
					});
					break;
			}
			//Прикрепление контента к элементу
			oContentCell.addContent(oContent);
		},

		getSplitAppObj: function () {
			var result = this.byId("SplitApp");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},

		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},

		onAPODPress: function(oEvent) {
			this.getSplitAppObj().toDetail(this.createId("APODPage"));
		},

		onPressNavToDetail: function () {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},

		onPressDetailBack: function () {
			this.getSplitAppObj().backDetail();
		},

		onPressMasterBack: function () {
			this.getSplitAppObj().backMaster();
		},

		onPressGoToMaster: function () {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		}
	});
});