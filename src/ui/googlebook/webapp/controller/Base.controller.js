sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/Fragment",
      "intheme/ivan_app/formatter/myformatter"
    ],
    function (Controller,Fragment,Formatter) {
        "use strict";
    
        return Controller.extend("intheme.ivan_app.controller.Base", {
            myformatter: Formatter,
          onInit: function () {
       
          },

          getRouter: function () {
            return this.getOwnerComponent().getRouter();
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
            return this.getModel("state").setProperty(sPath, oValue,oContext,bAsyncUpdate
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
    
          getSmartTable: function () {
            return this.getView().byId("bookSmartTable");
          },
    
          rebindTable: function (oEvent) {
            this.getSmartTable().rebindTable();
          },
    
          
          onCloseDialog: function (oEvent) {
            oEvent.getSource().getParent().close();
            this.setStateProperty('/editMode', false)
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

          onEditToggled: function () {
            this.setStateProperty("/editMode", this.getStateProperty("/editMode"));
          },

        })
    }
)