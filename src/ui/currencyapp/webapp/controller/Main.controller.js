sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
  "sap/ui/core/BusyIndicator",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  ],
  function (Controller, MessageToast, BusyIndicator, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("intheme.currency.controller.Main", {
      onInit: function () {
        this.getRouter()
          .getRoute("WorklistRoute")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      addfilterGroupItems: function() {
        var smartFiledBar;
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
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var oBindingObject = oEvent.getSource().getBindingContext().getObject();
        
        var oParams = {
            CurrencyId: oBindingObject.CurrencyId,
        };

        this.setStateProperty("/currentRow", oBindingObject);
        
        this.navTo("DetailRoute", { query: oParams }, false);
        var aFiltersOfBar = this.byId("currencyFilterBar").getAggregation("filterGroupItems");
        
      },

      _onRouteMatched: function (oEvent) {
        var oSmartTable = this.byId("userSmartTab");
        this.setStateProperty("/layout", "OneColumn");

        if (oSmartTable) {
          oSmartTable.getTable().removeSelections();
          
        }
        
      },

      bind : function (mParameters) {
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

      getSmartTable: function () {
        return this.getView().byId("currencySmartTab");
      },

      onEditToggled: function (oEvent) {
        this.setStateProperty("/editMode", true);
      },

      onCancel: function (oEvent) {
        this.setStateProperty("/editMode", false);
      },

      rebindTable: function (oEvent) {
        this.getSmartTable().rebindTable();
      },


      onSearch: function (oEvent) {
        // add filter for search
        var aFilters = [];
        var sQuery = oEvent.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
          var filter = new Filter("CurrencyId", FilterOperator.Contains, sQuery);
          aFilters.push(filter);
        }
  
        // update list binding
        var oList = this.byId("idList");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilters, "Application");
      },
      
      onSearch2: function (oEvent) {
        // add filter for search
        var aFilters = [];
        var sQuery = oEvent.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
          var filter = new Filter("CurrencyId", FilterOperator.Contains, sQuery);
          aFilters.push(filter);
        }
  
        // update list binding
        var oList = this.byId("idList2");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilters, "Application");
      },


      ShowResultCalc: function(oEvent) {
        debugger
        alert('Ты умничка!');

        var iVariableCurrency = this.byId("valueInput").getValue(),
        iCurrencyValue = this.byId("resultInput");
        iCurrencyValue = iCurrencyValue.setValue(Math.floor(iVariableCurrency*1,515*1000)/1000);

      }
      
    });
    
  }
);
