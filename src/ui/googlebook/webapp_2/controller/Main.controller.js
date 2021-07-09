  sap.ui.define(
  [
    "intheme/ivan_app/controller/Base.controller",
    "sap/m/MessageToast",
     "sap/ui/model/json/JSONModel",
    "sap/ui/core/dnd/DragInfo",
	"sap/ui/core/dnd/DropInfo",
	"sap/ui/core/dnd/DropPosition",
	"sap/ui/core/dnd/DropLayout",
  "sap/f/dnd/GridDropInfo",
  "intheme/ivan_app/RevealGrid/RevealGrid"
  ],
  function (Controller, MessageToast, JSONModel, DragInfo, DropInfo, DropPosition, DropLayout, GridDropInfo,RevealGrid) {
    "use strict";

    return Controller.extend("intheme.ivan_app.controller.Main", {
   
      onInit: function () {
      
        this.getRouter()
          .getRoute("WorklistRoute")
          .attachPatternMatched(this._onRouteMatched, this);
         
      },

	initData: function () {
			this.byId("list1").setModel(new JSONModel([
				{ title: "Open SAP Homepage 2x2" },
				{ title: "Your personal information 3x3" },
				{ title: "Appointments management 2x4" }
			]));
  },
      attachDragAndDrop: function () {
        var oList = this.byId("list1");
        oList.addDragDropConfig(new DragInfo({
          sourceAggregation: "items"
        }));
  
        oList.addDragDropConfig(new DropInfo({
          targetAggregation: "items",
          dropPosition: DropPosition.Between,
          dropLayout: DropLayout.Vertical,
          drop: this.onDrop.bind(this)
        }));
      },

     
      onDropIndicatorSize: function (oDraggedControl) {
        debugger
        var oBindingContext = oDraggedControl.getBindingContext(),
          oData = oBindingContext.getModel().getProperty(oBindingContext.getPath());
  
        if (oDraggedControl.isA("sap.m.StandardListItem")) {
          return {
            rows: oData.rows,
            columns: oData.columns
          };
        }
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
        oEvent.getSource().getParent().getParent().getParent().close();
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

      Check:function(){
          this.loadDialog
          .call(this, {
            sViewName: "intheme.ivan_app.view.fragment.Check",
            sDialogName: null
          })
          .then(
            function (oFragment) {
              oFragment.open();
            }
          );
         
      },
      

      Drag:function(){
 this.attachDragAndDrop();
 	this.initData();
      },



     
    });
  }
);
