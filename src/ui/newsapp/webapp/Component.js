sap.ui.define([
	"sap/base/util/UriParameters",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/f/library",
	"sap/f/FlexibleColumnLayoutSemanticHelper"
], function(UriParameters, UIComponent, JSONModel, library, FlexibleColumnLayoutSemanticHelper) {
	'use strict';

	var LayoutType = library.LayoutType;

	var Component=  UIComponent.extend('intheme.NewsProject.Component', {

		metadata: {
			manifest: 'json'
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);

			var oModel = new JSONModel();
			this.setModel(oModel);
			
			this.getRouter().initialize();
		},

		getHelper: function () {
			var oFCL = this.getRootControl().byId("flexibleColumnLayout"),
				oParams = UriParameters.fromQuery(location.search),
				oSettings = {
					defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
					defaultThreeColumnLayoutType: LayoutType.ThreeColumnsMidExpanded,
					mode: oParams.get("mode"),
					maxColumnsCount: oParams.get("max")
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		},

		_onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getModel("TypePage"),
				sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, set a default layout (normally OneColumn)
			if (!sLayout) {
				sLayout = library.LayoutType.OneColumn;
			}

			oModel.setProperty("/layout", sLayout);
		}
	});
	return Component;
});