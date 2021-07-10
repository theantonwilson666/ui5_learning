sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageBox"
], function (
	Controller,
	BusyIndicator,
	MessageBox
) {
	"use strict";

	return Controller.extend("intheme.NewsProject.controller.Detail", {
		onInit: function () {

			this.oRouter = this.getOwnerComponent().getRouter();

			// var oSmartForm = this.getView().byId("ObjectPageLayout");
			// oSmartForm.setModel(this.getOwnerComponent().getModel());

			this.oRouter
				.getRoute("detail")
				.attachPatternMatched(this._onNewsMatched, this);
		},

		setStateCurrentUser: function (oEvent) {
			this.getModel().callFunction("/getCurrentUser", {
				method: "GET",
				success: function (oData) {
					this.getModel("state").oData.currUser = oData.getCurrentUser.CURRENTUSER;
				}.bind(this),

				error: function (oError) {
					this.showError(oError);
				}.bind(this)
			});
		},

		_onNewsMatched: function (oEvent) {
			this._publishedAt = oEvent.getParameter("arguments").news || this._publishedAt || "0";;
			this.byId("ObjectPageLayout").bindElement("/NewsSet(datetime'" + this._publishedAt + "')");
			this.setStateCurrentUser(oEvent);
		},

		rebindList: function (oEvent) {
			var oList = this.getCommentList(oEvent);
			oList.getBinding("items").refresh(true);
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
			return this.getModel().submitChanges(oEvents);
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
					BusyIndicator.hide();
				}.bind(this),
				error: function () {
					BusyIndicator.hide();
				}.bind(this),
			});
		},

		// setStateProperty: function (sPath, oValue, oContext, bAsyncUpdate) {
		// 	return this.getModel("state").setProperty(
		// 		sPath,
		// 		oValue,
		// 		oContext,
		// 		bAsyncUpdate
		// 	);
		// },

		getCommentList: function () {
			return this.getView()
				.byId("CommentList");
		},

		getFormDate: function (rawDate) {
			var num = Number(rawDate.slice(11, 13)) + 3
			var cleanDate = rawDate.slice(0, 4) + "-" +     //Год
				rawDate.slice(5, 7) + "-" +                 //Месяц
				rawDate.slice(8, 10) + " " +                //Число

				String(num) + ":" +                         //Часы
				rawDate.slice(16, 18) + ":" +               //Минуты
				rawDate.slice(21, 23);                      //Секунды
			return cleanDate;
		},
		//Метод для создания комментария
		onPost: function (oEvent) {
			var oPubDate = new Date(this.getFormDate(this._publishedAt));
			var oComDate = new Date(new Date().toString('yyyy-MM-dd HH:MM:SS'));
			var sValue = oEvent.getParameter("value");


			BusyIndicator.show();
			var oList = this.getCommentList();
			var oListItem = this.byId("CommentItem").clone();

			var oNewCom = this.getModel().createEntry("CommentSet", {
				properties: {
					publishedAt: oPubDate,
					commentedAt: oComDate,
					content: sValue
				},
			});
			oNewCom.sPath = "/NewsSet(datetime'" + this._publishedAt + "')";

			oListItem.setBindingContext(oNewCom);
			oList.insertItem(oListItem, 0);
			this.onSaveChanges(oEvent);
			BusyIndicator.hide();
		},

		getUpdate: function (oEvent) {
			BusyIndicator.show();
			this.onSaveChanges(oEvent);
			BusyIndicator.hide();
		},

		handleClose: function () {
			var oFeedInput = this.byId("FeedInput");
			oFeedInput.setValue(null);
			var sNextLayout = this.getModel().getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", { layout: sNextLayout });
		},

		DeleteComment: function (oListItem, oEvent) {
			BusyIndicator.show();
			this.getModel().remove(oListItem.getBindingContext().getPath());
			this.onSaveChanges(oEvent);
			BusyIndicator.hide();
		},

		onDelActionPressed: function (oEvent) {
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