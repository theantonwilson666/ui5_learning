sap.ui.define([], function(){
    "use strict";

    function exampleFormatter(oDataField){
        var sPath = oDataField.Value && oDataField.Value.Path;

        return "{" + sPath + "}";
    }

    function getNavigationPath(){
    }
    debugger

    return {
        exampleFormatter: exampleFormatter,
        getNavigationPath: getNavigationPath
    };

}, true);