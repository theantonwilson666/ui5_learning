sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/unified/DateRange",
    "sap/ui/core/format/DateFormat",
    "sap/ui/unified/CalendarLegendItem",
    "sap/ui/unified/DateTypeRange",
    "sap/ui/model/odata/ODataUtils",
    "sap/ui/model/Filter",
    "sap/ui/core/library",
    "intheme/zweather_app/formatter/CommonFormatter",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
    "./InitPage",
  ],
  function (
    Controller,
    DateRange,
    DateFormat,
    CalendarLegendItem,
    DateTypeRange,
    ODataUtils,
    Filter,
    coreLibrary,
    Formatter,
    Fragment,
    JSONModel,
    ODataModel,
    FlattenedDataset,
    ChartFormatter,
    Format,
    InitPageUtil
  ) {
    "use strict";

    var CalendarType = coreLibrary.CalendarType;

    return Controller.extend(
      "sap.ui.unified.sample.CalendarSingleDaySelection.CalendarSingleDaySelection", {
        oFormatYyyymmdd: null,
        commonFormatter: Formatter,

        onInit: function () {
          this.oFormatYyyymmdd = DateFormat.getInstance({
            pattern: "yyyy-MM-dd",
            calendarType: CalendarType.Gregorian
          });

          var oViewModel = new JSONModel();

          oViewModel.setProperty("/chart/", this._chart);

          this.getView().setModel(oViewModel, "view");
        },

        onAfterRendering: function () {

          var oCal = this.byId("calendar"),
            oLeg = this.byId("legend"),
            oRefDate;

          oRefDate = new Date();

          var oCurDay = Date().split(" ")[2];
          oLeg.addItem(
            new CalendarLegendItem({
              text: "активные дни",
              color: "#ff69b4",
            })
          );
          for (var i = 0; i < 5; i++) {
            oCal.addSpecialDate(
              new DateTypeRange({
                startDate: new Date(oRefDate.setDate(+oCurDay - 1 - i)),
                type: "Type11",
                // color: "#ff69b4",
              })
            );
          }
        },
        handleCalendarSelect: function (oEvent) {
          var oCalendar = oEvent.getSource();

          this._updateText(oCalendar);

          // this.showInfo();
          // console.log(this.handleSelectToday);
          // this.getView().byId("calendar").addStyleClass("hm");
        },

        _updateText: function (oCalendar) {
          debugger;
          var oText = this.byId("selectedDate"),
            aSelectedDates = oCalendar.getSelectedDates(),
            oUnixDate = this.byId("unixDate"),
            oDate = aSelectedDates[0].getStartDate();

          // this.oFormatYyyymmdd.format(oDate).split('-').reduce((el,baze)=> +el + +baze)
          // console.log(this.oFormatYyyymmdd.format(oDate));

          var unixTime =
            new Date(this.oFormatYyyymmdd.format(oDate).split("-")).getTime() /
            1000;

          oText.setText(this.oFormatYyyymmdd.format(oDate));
          oUnixDate.setText(unixTime);
          return unixTime;
        },
        // getUnixDate: function (oCalendar) {
        //     var oText = this.byId("selectedDate"),
        //         aSelectedDates = oCalendar.getSelectedDates(),
        //         oUnixDate = this.byId('unixDate'),
        //         oDate = aSelectedDates[0].getStartDate();
        //     var unixTime = new Date(this.oFormatYyyymmdd.format(oDate).split('-'))
        //         .getTime() / 1000 + 7200
        //     return 1
        // },

        handleSelectToday: function () {
          var oCalendar = this.byId("calendar");

          oCalendar.removeAllSelectedDates();
          oCalendar.addSelectedDate(
            new DateRange({
              startDate: new Date(),
            })
          );
          this._updateText(oCalendar);

          debugger;
        },

        cutNum: function (num) {
          return parseInt(num * 10000) / 10000;
        },

        onSelectCity: function (oEvent) {
          debugger;

          var oContext = oEvent.getSource().getBindingContext();
          var oCity = oContext.getObject().City;

          this.setCurrentCity(oCity);

          var oTodayTime = new Date().getTime();

          if (
            this.byId("calendar").getSelectedDates()[0] &&
            this.byId("T1").getText() !== ""
          ) {
            //если выбран день И выбранно время

            var oСhosenDay = this.byId("calendar")
              .getSelectedDates()[0]
              .getStartDate()
              .getTime(); //выбранный день

            this.byId("smartForm").bindElement(
              `/CityWeatherOnDateSet(Date=${encodeURIComponent(
                ODataUtils.formatValue(
                  oСhosenDay + this.getSelectTime() * 1000,
                  "Edm.DateTime"
                )
              )},City='${oCity}')`
            );

            console.log(" выбран день И выбранно время");
          } else if (
            this.byId("calendar").getSelectedDates()[0] &&
            this.byId("T1").getText() == ""
          ) {
            // если выбран ТОЛЬКО день
            var oСhosenDay = this.byId("calendar").getSelectedDates()[0].getStartDate().getTime(); //выбранный день

            this.byId("smartForm").bindElement(`/CityWeatherOnDateSet(Date=${encodeURIComponent(ODataUtils.formatValue(oСhosenDay, "Edm.DateTime"))},City='${oCity}')`);

            console.log("ток день");

          } else if (!this.byId("calendar").getSelectedDates()[0] && this.byId("T1").getText() !== "") {
            // если выбранно ТОЛЬКО время
            // var oCurDateArr = (new Date).toJSON().substring(0, 10).split('-').map(el => +el)

            // var oUnixCurDate00 = ((oCurDateArr[0] - 1970) * 31556926) + (oCurDateArr[1] * 2629743) + (oCurDateArr[2] * 604800)

            // this.byId('smartForm')
            //     .bindElement(`/CityWeatherOnDateSet(Date=${encodeURIComponent(ODataUtils
            // .formatValue(oUnixCurDate00 + this.getSelectTime()*1000, "Edm.DateTime"))},City='${oCity}')`);
            console.log("ток время");
          } else {
            // если ничо не выбранно
            this.byId("smartForm").bindElement(`${oContext.sPath}/ToCityWeather`);
            console.log("ничо не выбранно ");
          }

          this.getDataForViz();

          // получить значение темпы this.byId('smartForm').getBindingContext().oModel.aBindings[5].vOriginalValue
          // console.log(`/CityWeatherOnDateSet(Date=${encodeURIComponent(ODataUtils.formatValue(oTodayTime, "Edm.DateTime"))},Lon=${oCurLongitude}M,Lat=${oCurLatitude}M)/Weather`);
          //    `CityWeatherOnDateSet(Date=datetime'2012-01-01T00:00:00',Lon=44.555M,Lat=33.4444M)`
        },

        // TIME PICKER
        handleOpenDialog: function () {
          var oView = this.getView();

          // create popover
          if (!this._pDialog) {
            this._pDialog = Fragment.load({
              id: oView.getId(),
              name: "intheme.zweather_app.view.TimePickerSlidersDialog",
              controller: this,
            }).then(
              function (oDialog) {
                oView.addDependent(oDialog);

                oDialog.attachAfterOpen(
                  function () {
                    var oTP = this.byId("TPS2");
                    this._sOldValue = oTP.getValue();
                  }.bind(this)
                );
                return oDialog;
              }.bind(this)
            );
          }
          this._pDialog.then(function (oDialog) {
            oDialog.open();
          });
        },

        handleOKPress: function () {
          var oText = this.byId("T1"),
            oTP = this.byId("TPS2");

          this.byId("selectTimeDialog").close();
          oTP.collapseAll();

          oText.setText(oTP.getValue());
        },

        handleCancelPress: function () {
          var oTP = this.byId("TPS2");

          oTP.setValue(this._sOldValue);

          this.byId("selectTimeDialog").close();
        },
        getSelectTime: function (oEvent) {
          debugger;
          if (this.byId("T1").getText() !== "") {
            var oTimeArr = this.byId("T1")
              .getText()
              .split(":")
              .map((el) => +el);
            var hh = oTimeArr[0] * 3600;
            var mm = oTimeArr[1] * 60;
            var ss = oTimeArr[2];
            var unixTime = oTimeArr[0] * 3600 + oTimeArr[1] * 60 + oTimeArr[2];
            console.log(unixTime);
            return unixTime;
          } else {
            console.log(0);
            return 0;
          }
        },

        setCurrentCity: function (sCity) {
          this.sCity = sCity;
        },

        getCurrentCity: function () {
          return this.sCity;
        },

        getSelectedDate: function () {
          return this.byId("calendar").getSelectedDates()[0].getStartDate();
        },

        getMaxMinTemp: function (oData) {
          debugger
          console.log(oData);
        },

        getMaxMinTemp: function (oData) {
          debugger
          var oTempArr = []
          for (var i = 0; i < oData.results.length; i++) {
            oTempArr.push(Math.floor(+oData.results[i].Temp))
          }
          var maxTemp = Math.max(...oTempArr)
          var minTemp = Math.min(...oTempArr)
          console.log(oTempArr);
          console.log(maxTemp);
          console.log(minTemp);
          this.setMaxMinTemp(maxTemp, minTemp)
        },

        setMaxMinTemp: function (max, min) {
          this.getView().byId("idVizFrame").setVizProperties({
            plotArea: {

              primaryScale: {
                fixedRange: true,
                maxValue: Math.ceil(max / 10) * 10 + 5,
                minValue: Math.floor(min / 10) * 10 - 5
              }
            },
          })
        },

        getDataForViz: function () {
          debugger
          var oFilter = new sap.ui.model.Filter();

          var oModel = this.getView().getModel();
          var oModelJson = new sap.ui.model.json.JSONModel();

          var fData = new sap.ui.model.Filter({
            path: "Date",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: this.getSelectedDate(),
          });
          var fCity = new sap.ui.model.Filter({
            path: "City",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: this.getCurrentCity(),
          });

          var oFilter = new Array();
          oFilter.push(fData);
          oFilter.push(fCity);

          sap.ui.core.BusyIndicator.show();
          // this.byId("idVizFrame").setBusy(true)

          oModel.read("/CityWeatherOnDateHourlySet", {
            filters: oFilter,
            success: function (oData) {
              // this.byId("idVizFrame").setBusy(false)
              this.prepareViz(oData.results);
              this.getMaxMinTemp(oData)
              sap.ui.core.BusyIndicator.hide();

            }.bind(this),
            error: function () {
              debugger;
              sap.ui.core.BusyIndicator.hide();
              // this.byId("idVizFrame").setBusy(false)
              console.log("error");
            }.bind(this)
          });
        },

        prepareViz: function (oData) {
          Format.numericFormatter(ChartFormatter.getInstance());
          var formatPattern = ChartFormatter.DefaultPattern;

          var oVizFrame = this.getView().byId("idVizFrame");

          oVizFrame.setVizProperties({
            plotArea: {
              window: {
                start: "firstDataPoint",
                end: "lastDataPoint",
              },

              dataLabel: {
                formatString: formatPattern.SHORTFLOAT_MFD2,
                visible: false,
              },
              primaryScale: {
                fixedRange: true,
                maxValue: 40,
                minValue: 10
              }
            },

            legend: {
              visible: false,
              title: {
                visible: false,
              },
            },
            valueAxis: {
              label: {
                formatString: formatPattern.SHORTFLOAT_MFD2
              },
              title: {
                visible: true,
                text: "Температура",
              }

            },

            timeAxis: {
              title: {
                visible: true,
                text: "Время",
              },

              interval: {
                unit: "",
              },
              levels: ["day", "hour", "minute"],


            },

            title: {
              visible: true,
              text: "Температура за день",
            },

            interaction: {
              syncValueAxis: false,

            }
          });

          oVizFrame.setVizScales({
            scales: {
              valueAxis: {
                min: 20
              }
            }
          })

          var oPopOver = this.getView().byId("idPopOver");
          oPopOver.connect(oVizFrame.getVizUid());
          oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
          var oJson = new sap.ui.model.json.JSONModel({
            Chart: oData
          });
          oVizFrame.setModel(oJson, "TempHourlyMdl");
        }
      }
    );
  }
);