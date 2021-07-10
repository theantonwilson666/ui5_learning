sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/util/UriParameters",
	"sap/base/Log"
], function (MockServer, UriParameters, Log) {
	"use strict";

	return {
		init: function () {
			// create
			var oMockServer = new MockServer({
				rootUri: "/"
			});

			var oUriParameters = new UriParameters(window.location.href);

			// configure mock server with a delay
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: oUriParameters.get("serverDelay") || 500
			});

			// simulate
			oMockServer.simulate("../localService/metadata.xml", {
				sMockdataBaseUrl: "../localService/mockdata",
				bGenerateMissingMockData: true
			});

			// start
			oMockServer.start();

			Log.info("Running the app with mock data");
		}
	};

});