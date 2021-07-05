sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator",
    "intheme/ivan_app/formatter/myformatter",
  ],
  function (Controller, MessageToast, Fragment, BusyIndicator, Formatter) {
    "use strict";

    return Controller.extend("intheme.ivan_app.controller.Main", {
      myformatter: Formatter,
      onInit: function () {
        this.getRouter()
          .getRoute("WorklistRoute")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },

      onViewDetail: function (oEvent) {
        var oBindingObject = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getObject();

        var oParams = {
          ProjectID: oBindingObject.ProjectID,
        };

        this.navTo("DetailRoute", { query: oParams }, false);
      },

      onPressColumnListItem: function (oEvent) {
        debugger;
        var oBindingObject = oEvent.getSource().getBindingContext().getObject();

        var oParams = {
          BookID: oBindingObject.Id,
        };
        this.setStateProperty("/currentRow", oBindingObject);
        this.setStateProperty(
          "/currentPath",
          oEvent.getSource().getBindingContext().getPath()
        );
        debugger;
        this.navTo("DetailRoute", { query: oParams }, false);
      },

      _onRouteMatched: function (oEvent) {
        var oSmartTable = this.byId("bookSmartTable");
        this.setStateProperty("/layout", "OneColumn");

        if (oSmartTable) {
          oSmartTable.getTable().removeSelections();
        }
      },

      bindView: function (mParameters) {
        this._initViewBinder();
        return this.viewBinder.bind(mParameters);
      },

      _initViewBinder: function () {
        var ViewBinderClass = this.getOwnerComponent()
          .getViewBinder()
          .getMetadata()
          .getClass();
        this.viewBinder = new ViewBinderClass();
        this.viewBinder.setModel(this.getModel());
        this.viewBinder.setView(this.getView());
      },

      getViewBinder: function () {
        return this.viewBinder;
      },

      getStateProperty: function (sPath, oContext) {
        return this.getModel("state").getProperty(sPath, oContext);
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
      },

      onDataRequested: function (oEvent) {},

      onFireSearchAfterSelectSmartVariant: function (sFilterBarId) {
        if (typeof sFilterBarId === "string" && sFilterBarId.length > 0) {
          this.byId(sFilterBarId).fireSearch();
          return true;
        }

        return false;
      },

      navTo: function (sName, oParameters, bReplace) {
        this.getRouter().navTo(sName, oParameters, bReplace);
      },

      onSelectionLine: function (oEvent) {
        var oSelectedItem = oEvent.getParameter("listItem");
        var oBindingContext = oSelectedItem.getBindingContext();
        if (!this._oDialog) {
          this._oDialog = sap.ui.xmlfragment("demo.Adress", this);
        }
        this._oDialog.setBindingContext(oBindingContext);
        this._oDialog.open();
      },

      getLineItem: function (i) {
        return this.getView()
          .byId("userSmartTab")
          .getTable()
          .getAggregation("items")
          [i].getBindingContext()
          .getObject();
      },

      getSmartTable: function () {
        return this.getView().byId("bookSmartTable");
      },

      onEditToggled: function (oEvent) {
        this.setStateProperty("/editMode", true);
      },

      onCancel: function (oEvent) {
        this.setStateProperty("/editMode", false);
      },

      // rebindTable: function (oEvent) {
      //   this.getSmartTable().rebindTable();
      // },

      onCloseNewMeetUp: function (oEvent) {
        oEvent.getSource().getParent().close();
      },
      loadDialog: function (oParams) {
        if (!this[oParams.sDialogName]) {
          return Fragment.load({
            id: this.getView().sId,
            type: "XML",
            name: oParams.sViewName,
            controller: oParams.controller ? oParams.controller : this,
          }).then(
            function (oDialog) {
              this[oParams.sDialogName] = oDialog;
              if (oParams.sPath) {
                this[oParams.sDialogName].bindElement(oParams.sPath);
              }
              if (
                oParams.bAddDependent === undefined ||
                oParams.bAddDependent === true
              ) {
                this.getView().addDependent(this[oParams.sDialogName]);
              }
              if (!$.isArray(this[oParams.sDialogName])) {
                this[oParams.sDialogName].setBusyIndicatorDelay(0);
              }
              return this[oParams.sDialogName];
            }.bind(this)
          );
        } else {
          if (oParams.sPath) {
            this[oParams.sDialogName].bindElement(oParams.sPath);
          }
          return new Promise(
            function (res) {
              res(this[oParams.sDialogName]);
            }.bind(this)
          );
        }
      },
      openIsbr: function () {
        debugger;
        this.loadDialog
          .call(this, {
            sViewName: "intheme.ivan_app.view.fragment.Isbr",
            // sPath : po
          })
          .then(
            function (oFragment) {
              oFragment.open();
              // this.getView().byId("FovouriteBooks").rebindTable()
            }
            // .bind(this)
          );
      },

      onPressColumnListItemFromFav: function (oEvent) {
        debugger;
        oEvent
          .getSource()
          .getParent()
          .getParent()
          .getParent()
          .getParent()
          .close();
        var oBindingObject = oEvent.getSource().getBindingContext().getObject();

        var oParams = {
          BookID: oBindingObject.BookID,
        };
        this.setStateProperty("/currentRow", oBindingObject);
        this.setStateProperty(
          "/currentPath",
          oEvent.getSource().getBindingContext().getPath()
        );
        debugger;
        this.navTo("DetailRoute", { query: oParams }, false);
      },
      onEditToggled: function () {
        if (this.getStateProperty("/editMode")) {
          this.setStateProperty("/editMode", true);
        } else {
          this.setStateProperty("/editMode", false);
        }

        // if (condition) {

        // }
      },

      addIsbrText: function (oEvent) {
        debugger;
        //  var oModel = new sap.ui.model.odata.v2.ODataModel({});

        var sMsg = "1 Книга добавлена в избранное";
        var sMsgError = "Ошибка";
        var row = oEvent.getSource().getBindingContext().getObject();
        var icon = oEvent.getSource().getIcon();
        var sID = oEvent.getSource().getBindingContext().getProperty("Id");

        var oColumnListItem = oEvent.getSource().getParent();
        // var oTable = oColumnListItem.getParent();
        // oTable.setSelectedItem(oColumnListItem);
        debugger;
        BusyIndicator.show(0);

        var oNewFavBook = this.getModel().createEntry("FavouriteBookSet", {
          properties: {
            BookID: sID,
          },
        });

        // this.getModel().create("/FavouriteBookSet", oNewFavBook, {
        //   success: function (oData) {
        //     debugger;
        //     MessageToast.show(sMsg);
        //     this.UpdateIsbr();
        //   },

        //   error: function (error) {
        //     debugger;
        //   },
        // });

        this.getModel().submitChanges({
          success: function () {
            BusyIndicator.hide();
            MessageToast.show(sMsg);

            this.UpdateIsbr();
          }.bind(this),

          error: function () {
            BusyIndicator.hide();
            MessageToast.show(sMsgError);
          },
        });

        // this.UpdateIsbr();
      },
      onDeleteRow: function (oEvent) {
        console.log("done");
        var ID = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getObject().BookID;
        debugger;
        console.log(ID);

        this.getModel().remove(`/FavouriteBookSet('${ID}')`, {
          success: function () {
            debugger;
          },
          error: function () {
            debugger;
          },
        });
        this.UpdateIsbr();
      },

      UpdateIsbr: function () {
        this.getView().byId("bookSmartTable").rebindTable();
        //  this.getView().byId("bookSmartTable").getModel().refresh(true)
      },
    });
  }
);
