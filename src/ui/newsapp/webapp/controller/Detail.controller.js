sap.ui.define([
	"intheme/NewsProject/controller/Master.controller",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/odata/ODataMetadata",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, DateFormat, ODataMetadata, BusyIndicator, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("intheme.NewsProject.controller.Detail", {
		onInit: function () {

			this.oRouter = this.getOwnerComponent().getRouter();

			var oSmartForm = this.getView().byId("ObjectPageLayout");
			oSmartForm.setModel(this.getOwnerComponent().getModel("DataSets"));

			this.oRouter
				.getRoute("detail")
				.attachPatternMatched(this._onNewsMatched, this);
		},

		_onNewsMatched: function (oEvent) {
			this._publishedAt = oEvent.getParameter("arguments").news || this._publishedAt || "0";;
			this.getView().byId("ObjectPageLayout").bindElement("/NewsSet(datetime'" + this._publishedAt + "')");
			// this.setStateProperty("/layout", "TwoColumnsMidExpanded");

		},

		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onNewsMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onNewsMatched, this);
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

		submitChanges: function (oEvents) {
			return this.getModel("DataSets").submitChanges(oEvents);
		},

		onSaveChanges: function (oEvent) {
			BusyIndicator.show();

			var oList = this.getCommentList();
			var mItems = oList.getItems();
			mItems.forEach(
				function (oItem) {
					if (oItem.getBindingContext().bCreated) {
						oList.removeItem(oItem);
					}
				}.bind(this)
			);

			this.submitChanges({
				success: function () {
					MessageToast.show("Success");
					BusyIndicator.hide();
				}.bind(this),
				error: function () {
					MessageToast.show("Successn't");
					BusyIndicator.hide();
				}.bind(this),
			});
		},

		//Метод получения комментария по списку (i = номер, начиная с нуля)
		getComment: function (i) {
			this.getView().byId("CommentList")
				.getAggregation("items")[i]
				.getBindingContext()
				.getObject();
		},

		getCommentList: function () {
			return this.getView()
				.byId("CommentList");
		},

		//Метод для создания комментария
		onPost: function (oEvent) {

			var oFormat = DateFormat.getDateTimeInstance({ style: "full" });
			var oDate = new Date();
			var sDate = oFormat.format(oDate);
			var sValue = oEvent.getParameter("value");


			BusyIndicator.show();
			var oParent = oEvent.getSource().getParent();
			var oModel = this.getView().getModel();
			var oList = this.getCommentList();
			var oListItem = this.byId("CommentItem").clone();
			// oListItem.setText(sValue);
			// oListItem.setSender("IVANOVA");

			var oNewCom = this.getModel("DataSets").createEntry("CommentSet", {
				properties: {
					content: sValue + " " + this._publishedAt,
					publishedAt : Date()

				},
			});

			oNewCom.sPath = "/NewsSet(datetime'" + this._publishedAt + "')";
			// oNewCom.sPath = "/CommentSet(datetime='" + this._publishedAt + "')";
			oParent.setBindingContext(oNewCom);

			oListItem.setBindingContext(oParent.getBindingContext());
			oList.insertItem(oListItem, 0);
			this.onSaveChanges(oEvent);
			BusyIndicator.hide();
		},

		handleClose: function () {
			var sNextLayout = this.getModel().getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", { layout: sNextLayout });
		},

		DeleteComment: function (oListItem, oEvent) {
			BusyIndicator.show();
			this.getModel("DataSets").remove(oListItem.getBindingContext().getPath());
			this.onSaveChanges(oEvent);
			BusyIndicator.hide();
		},
		onDelActionPressed: function(oEvent) {
			var oListItem = oEvent.getParameter("item");
			var oController = this;
			var Event = oEvent;
			MessageBox.warning("Do you want to delete comment?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.YES) {
						oController.DeleteComment(oListItem, Event);
					}
				}
			});
		}
	});
});