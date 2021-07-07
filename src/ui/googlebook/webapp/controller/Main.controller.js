  sap.ui.define(
  [
    "intheme/ivan_app/controller/Base.controller",
    "sap/m/MessageToast",
  ],
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("intheme.ivan_app.controller.Main", {
   
      onInit: function () {
        this.getRouter()
          .getRoute("WorklistRoute")
          .attachPatternMatched(this._onRouteMatched, this);
         
      },

      onPressColumnListItem: function (oEvent) {
        var oBindingObject = oEvent.getSource().getBindingContext().getObject();
        var oParams = {
          BookID: oBindingObject.Id,
        };
        this.navTo("DetailRoute", { query: oParams }, false);
      },



      _onRouteMatched: function (oEvent) {
        var oSmartTable = this.byId("bookSmartTable");
        this.setStateProperty("/layout", "OneColumn");

        if (oSmartTable) {
          oSmartTable.getTable().removeSelections();
        }
      },


      openIsbr: function () {
       
        this.loadDialog
          .call(this, {
            sViewName: "intheme.ivan_app.view.fragment.Isbr",
          })
          .then(
            function (oFragment) {
              oFragment.open();
            }
          );
      },


      onPressColumnListItemFromFav: function (oEvent) {
       
        oEvent.getSource().getParent().getParent().getParent().getParent().close();
        var oBindingObject = oEvent.getSource().getBindingContext().getObject();
        var oParams = {
          BookID: oBindingObject.BookID,
        };
        this.setStateProperty("/currentRow", oBindingObject);
        this.setStateProperty(
          "/currentPath",
          oEvent.getSource().getBindingContext().getPath()
        );
        this.navTo("DetailRoute", { query: oParams }, false);
      },



      addIsbrText: function (oEvent) {
        var sMsg = "1 Книга добавлена в избранное";
        var sMsgError = "Ошибка";
        var sID = oEvent.getSource().getBindingContext().getProperty("Id");
        this.getModel().createEntry("FavouriteBookSet", {
          properties: {
            BookID: sID,
          },
        });


        this.getModel().submitChanges({
          success: function () {
            MessageToast.show(sMsg);

            this.UpdateIsbr();
          }.bind(this),

          error: function () {
            MessageToast.show(sMsgError);
          },
        });
      },


      onDeleteRow: function (oEvent) {
        console.log("done");
        var ID = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getObject().BookID;

        this.getModel().remove(`/FavouriteBookSet('${ID}')`, {
        });
        this.UpdateIsbr();
      },

      UpdateIsbr: function () {
        this.getView().byId("bookSmartTable").rebindTable();
      },
    });
  }
);
