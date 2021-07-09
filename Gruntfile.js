module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-openui5");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-zip");
  grunt.loadNpmTasks("grunt-nwabap-ui5uploader");
  grunt.loadNpmTasks("grunt-connect-proxy");


  // Parameters for deploy (comes from console command)
  var sApp = grunt.option("app");
  var sLevel = grunt.option("level");
  // var sLib = grunt.option("lib");
  // var sPlugin = grunt.option("plugin");

  if (sApp === undefined) {
    sApp = "weatherapp";
  }

  if (sLevel === undefined) {
    sLevel = "0";
  }

  // Structure of MOL
  var oAuth = {
    server: "http://sap-tm.inthemelab.com:8000",
    login: "VILSONAYU",
    pass: "QAZwsx123!",
    packages: [{
      transportno: "TMDK921768",
      apps: {
        weatherapp: {
          package: "ZUI5_LEARNING",
          bspContainer: "ZWEATHER_APP",
          bspDescription: "Weather Deploy",
          prefix: "intheme/zweather_app",
        },

        pokemonapp: {
          package: "ZPOKEMON_APP",
          bspContainer: "ZUI5_POKEMONS",
          bspDescription: "Pokemon",
          prefix: "intheme/zui5_pokemons",
        },

        newsapp: {
          package: "ZNEWS_APP",
          bspContainer: "ZNEWSPROJECT",
          bspDescription: "News",
          prefix: "intheme/NewsProject",
        },

        googlebook: {
          package: "ZGOOGLE_BOOK_APP",
          bspContainer: "ZGOOGLE_BOOK",
          bspDescription: "Google Books",
          prefix: "intheme/ivan_app",
        },

        currencyapp: {
          package: "ZCURRENCY_APP",
          bspContainer: "ZCURRENCY",
          bspDescription: "Currency Rate",
          prefix: "intheme/currency",
        }

      },
    }, ],
  };

  grunt.initConfig({
    zip: {
      "src.zip": ["src/**/*.*", "Gruntfile.js"],
    },

    unzip: {
      "./": "src.zip",
    },

    clean: ["src/dist"],

    connect: {
      server: {
        options: {
          port: 8001,
          livereload: false,
          keepalive: true,
          middleware: function (connect, options, middlewares) {
            middlewares.unshift(
              require("grunt-connect-proxy/lib/utils").proxyRequest
            );
            return middlewares;
          },
        },
        proxies: [{
          context: "/sap/",
          host: "10.11.12.4",
          port: 8000,
          secure: false,
          https: false,
          header: "Basic " + new Buffer.from("VILSONAYU:QAZwsx123!"),
        }, ],
      },
    },

    openui5_connect: {
      server: {
        options: {
          appresources: "src",
          resources: "sapui5-dist-static/resources",
          testresources: "sapui5-dist-static/test-resources",
        },
      },
    },

    nwabap_ui5uploader: {
      options: {
        conn: {
          server: oAuth.server,
        },
        auth: {
          user: oAuth.login,
          pwd: oAuth.pass,
        },
      },
      upload_build: {
        options: {
          ui5: {
            package: oAuth.packages[sLevel].apps[sApp].package,
            transportno: oAuth.packages[sLevel].transportno,
            bspcontainer: oAuth.packages[sLevel].apps[sApp].bspContainer,
            bspcontainer_text: oAuth.packages[sLevel].apps[sApp].bspDescription,
          },
          resources: {
            cwd: "src/dist/ui/" + sApp + "/webapp",
            src: "**/*.*",
          },
        },
      },
    },
  });

  grunt.registerTask("initBuild", function () {
    oAuth.packages.forEach(function (oPackage) {
      Object.keys(oPackage.apps).forEach(function (sAppName) {
        // var sProject = oPackage.project;
        var sPrefix = oPackage.apps[sAppName].prefix;
        grunt.config.set("openui5_preload." + sAppName, {
          options: {
            resources: {
              cwd: "src/ui/" + sAppName + "/webapp",
              prefix: sPrefix,
            },
            dest: "src/dist/ui/" + sAppName + "/webapp",
            compress: true,
          },
          components: true,
        });
      });
    });
  });

  grunt.registerTask("copy", function () {
    // Copying remaining files of apps
    oAuth.packages.forEach(function (oPackage) {
      for (var app in oPackage.apps) {
        grunt.file.copy(
          "src/ui/" + app + "/webapp",
          "src/dist/ui/" + app + "/webapp"
        );
      }
    });
  });

  grunt.registerTask("serve", function () {
    grunt.task.run(["configureProxies:server", "openui5_connect:server"]);
  });

  grunt.registerTask("deploy", ["nwabap_ui5uploader:upload_build"]);

  grunt.registerTask("build", [
    "clean",
    "initBuild",
    "openui5_preload",
    "copy",
  ]);
};