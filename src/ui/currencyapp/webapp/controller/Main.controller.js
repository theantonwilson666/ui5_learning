sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (Controller) {
    "use strict";

    return Controller.extend("intheme.currency.controller.Main", {
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

      onPressColumnListItem: function () {

        var oBindingObject = this.getView().byId("tableCurrency").getSelectedItem().getBindingContext().getObject();
        
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
          oSmartTable.getTable().removeSelections() 
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

      navTo: function (sName, oParameters, bReplace) {
        this.getRouter().navTo(sName, oParameters, bReplace);
      },

      getSmartTableCurrency: function () {
        return this.getView().byId("currencySmartTab");
      },

      onEditToggled: function (oEvent) {
        this.setStateProperty("/editMode", true);
      },

      onCancel: function (oEvent) {
        this.setStateProperty("/editMode", false);
      },

      rebindTable: function (oEvent) {
        this.getSmartTableCurrency().rebindTable();
        this.changeTypeOfElements();
      },

      ShowResultCalc: function(oEvent) {
        alert('Ну почти работает');

        var iVariableCurrency = this.byId("valueInput").getValue(),
        iCurrencyValue = this.byId("resultInput");
        iCurrencyValue = iCurrencyValue.setValue(Math.floor(iVariableCurrency*1,515*1000)/1000);

      }
      
    });
    
  }
);
