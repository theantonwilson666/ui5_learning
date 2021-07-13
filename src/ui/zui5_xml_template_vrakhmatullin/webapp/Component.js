sap.ui.define([
    "sap/ui/core/UIComponent",
	"sap/m/Page",
	"sap/ui/core/mvc/View",
	"sap/ui/core/mvc/ViewType"
 ], function (UIComponent, Page, View, ViewType) {
    "use strict";
    return UIComponent.extend("intheme.zui5_xml_template.Component", {
        metadata : {
            manifest: "json"
        },
        init : function () {
            UIComponent.prototype.init.apply(this, arguments);
		},
		createContent: function() {
            var oContainer = new Page();
            var oModel = this.getModel();
            var oMetaModel = oModel.getMetaModel();
            var sPath = null;
            oMetaModel.loaded().then(function(){
                return oModel.annotationsLoaded();
            }).then(function(){

                sPath =  "/TableTypeSet";

                return View.create({
                    type: ViewType.XML,
                    viewName: "intheme.zui5_xml_template.view.Main",
                    preprocessors: {
                        xml: {
                            bindingContexts:{
                                meta: oMetaModel.getMetaContext(sPath)
                            },
                            models: {
                                meta: oMetaModel
                            }
                        }
                    }
                });
            }).then(function(oView){
                oView.bindElement({
                    path: sPath
                });
                oContainer.setShowHeader(false);
                oContainer.addContent(oView);
            });

            return oContainer;
		}
    });
 });