sap.ui.define([], function () {
    return {
        modifyRebindSmartTable: function (oSmartTable) {
            if (!oSmartTable) {
                return
            }

            oSmartTable.attachInitialise(function () {
                var oRebindButton = new sap.m.OverflowToolbarButton({
                    icon: 'sap-icon://refresh',
                    type: sap.m.ButtonType.Transparent,
                    press: function () {
                        oSmartTable.rebindTable()
                    }
                })
                oSmartTable.getToolbar().addContent(oRebindButton)
            })
        },
        modifyAddSmartTable: function (oSmartTable) {
            if (!oSmartTable) {
                return
            }
            oSmartTable.attachInitialise(function () {
                var oRebindButton = new sap.m.OverflowToolbarButton({
                    icon: 'sap-icon://add',
                    type: sap.m.ButtonType.Transparent,
                    press: function () {
                        oSmartTable.onAddWeather()
                    }
                })
                oSmartTable.getToolbar().addContent(oRebindButton)
            })
        }
    };
});