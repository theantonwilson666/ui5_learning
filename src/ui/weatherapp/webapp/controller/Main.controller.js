sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/unified/DateRange",
    "sap/ui/core/format/DateFormat",
    "sap/ui/unified/CalendarLegendItem",
    "sap/ui/unified/DateTypeRange",
    "sap/ui/model/odata/ODataUtils",
    "sap/ui/core/library",
    "intheme/zweather_app/formatter/CommonFormatter",
    "intheme/zweather_app/Util/Util",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
  ],
  function (
    Controller,
    DateRange,
    DateFormat,
    CalendarLegendItem,
    DateTypeRange,
    ODataUtils,
    coreLibrary,
    Formatter,
    Util,
    Fragment,
    JSONModel,
    ChartFormatter,
    Format,
  ) {
    "use strict";

    var CalendarType = coreLibrary.CalendarType;

    return Controller.extend(
      "intheme.zweather_app.controller.Main", {

        commonFormatter: Formatter,

        Util: Util,

        oFormatYyyymmdd: DateFormat.getInstance({
          pattern: "yyyy-MM-dd",
          calendarType: CalendarType.Gregorian
        }),


        onInit: function () {
          var oSmartTable = this.byId('weatherlSmartTab')
          this.Util.modifyRebindSmartTable(oSmartTable)
          this.Util.modifyAddSmartTable(oSmartTable)
        },

        addSpecialDays: function () {
          var oCal = this.byId("calendar")
          var oCurDay = Date().split(" ")[2];
          for (var i = 0; i < 5; i++) {
            oCal.addSpecialDate(
              new DateTypeRange({
                startDate: this.activeDays(+oCurDay, i),
                type: "Type11",
              })
            );
          }
        },

        selectPage: function (oEvent) {
          this.addSpecialDays()
          var key = oEvent.getSource().getSelectedKey()
          // var key = oEvent.getParameter('key')
          var arrOfPagesId = this.getArrOfPagesId(oEvent)
          var arrOfSubHeadersId = arrOfPagesId.map(el => el + 'Header')

          for (var cnt = 0; cnt < arrOfPagesId.length; cnt++) {
            if (key == arrOfPagesId[cnt] && this.checkVisible(arrOfPagesId[cnt])) {
              this.changeVisible(arrOfPagesId, cnt);
              this.changeVisible(arrOfSubHeadersId, cnt)
            }
          }

        },

        changeVisible: function (arrOfPagesId, cnt) {
          for (var i = 0; i < arrOfPagesId.length; i++) {
            this.byId(arrOfPagesId[i]).setVisible(false)
          }
          this.byId(arrOfPagesId[cnt]).setVisible(true)
        },

        checkVisible: function (currentPage) {
          return this.byId(currentPage).getVisible() !== true ? true : false //Проверка на то видна ли выбранная страница 
          //(нужно для случая если пользователь кликнет на уже актиный TabFilter)
        },

        getArrOfPagesId: function (oEvent) {
          var arrOfFiltersObj = oEvent.getSource().getItems()
          var arrOfPagesName = arrOfFiltersObj.map(el => el.getKey())
          return arrOfPagesName
        },

        activeDays: function (oCurDay, i) {
          var oRefDate = new Date();
          return new Date(oRefDate.setDate(oCurDay - 1 - i))
        },

        handleCalendarSelect: function (oEvent) {
          var oCalendar = oEvent.getSource();
          this._updateText(oCalendar);
          var oCity = this.byId("thisCity").getValue()
          if (oCity) {
            var oСhosenDay = this.byId("calendar").getSelectedDates()[0].getStartDate().getTime(); //выбранный день
            this.byId("smartForm").bindElement(`/CityWeatherOnDateSet(Date=${this.formatedDate(oСhosenDay+10800000)},City='${oCity}')`);
            this.getDataForViz()
          }
        },

        _updateText: function (oCalendar) {

          var oText = this.byId("selectedDate"),
            aSelectedDates = oCalendar.getSelectedDates(),
            oUnixDate = this.byId("unixDate"),
            oDate = aSelectedDates[0].getStartDate();

          var unixTime =
            new Date(this.oFormatYyyymmdd.format(oDate).split("-")).getTime() /
            1000;

          oText.setText(this.oFormatYyyymmdd.format(oDate));
          oUnixDate.setText(unixTime);
          return unixTime;
        },

        handleSelectToday: function () {
          var oCalendar = this.byId("calendar");

          oCalendar.removeAllSelectedDates();
          oCalendar.addSelectedDate(
            new DateRange({
              startDate: new Date(),
            })
          );
          this._updateText(oCalendar);
        },

        onSelectCity: function (oEvent) {
          var oContext = oEvent.getParameters().listItem.getBindingContext(),
            oCity = oContext.getProperty('City'),
            oCountry = oContext.getProperty('Country'),
            oSmartForm = this.byId("smartForm"),
            oTodayTime = new Date().getTime(),
            oCalendar = this.byId("calendar"),
            oModel = oEvent.getSource().getModel(),
            path = '',
            oСhosenDay = ''; //выбранный день

          this.setCurrentCity(oCity);

          if (oCalendar.getSelectedDates()[0]) {
            oСhosenDay = oCalendar.getSelectedDates()[0].getStartDate().getTime()
          }

          if (this.getModelProperty('state', '/time') !== '') { //если выбран день И выбранно время
            oSmartForm.bindElement(`/CityWeatherOnDateSet(Date=${this.formatedDate(oСhosenDay + this.getSelectTime() * 1000)},City='${oCity}')`);
            // path = oModel.createKey('/CityWeatherOnDateSet', {
            //   "Date": this.formatedDate(oСhosenDay + this.getSelectTime() * 1000),
            //   "City": oCity
            // })
            // oSmartForm.bindElement(path)
          } else if (this.getModelProperty('state', '/time') === '') { // если выбран ТОЛЬКО день
            oSmartForm.bindElement(`/CityWeatherOnDateSet(Date=${this.formatedDate(oСhosenDay+10800000)},City='${oCity}')`);
            // var dt = encodeURIComponent(ODataUtils.formatValue(oСhosenDay + 10800000, "Edm.DateTime"))
            // path = oModel.createKey('/CityWeatherOnDateSet', {
            //   "Date": dt,
            //   "City": oCity
            // })
            // oSmartForm.bindElement(path)
          } else { // если ничо не выбранно
            path = oModel.createKey('/CityRegisterSet', {
              "Country": oCountry,
              "City": oCity
            }) + "/ToCityWeather"

            oSmartForm.bindElement(path)
          }
          this.getDataForViz();
        },

        formatedDate: function (date) {
          return encodeURIComponent(ODataUtils.formatValue(date, "Edm.DateTime"))
        },
        getModelProperty: function (model, prop) {
          return this.getView().getModel(model).getProperty(prop)
        },
        // createPath: function (oEvent, entitySet, nDate, sCity, nTime) {
        //   var aKeysOfEntitySet = oEvent.getSource().getModel().createKey(entitySet, {}).split('(')[1].split(",").map(el => el.split('=')[0])
        //   oEvent.getSource().getModel().createKey(entitySet, {
        //     "City": "sadgfasg"
        //   })
        // },

        // TIME PICKER
        handleOpenDialog: function () {
          var oView = this.getView();
          // create popover
          if (!this._pDialog) {
            this._pDialog = Fragment.load({
              id: oView.getId(),
              name: "intheme.zweather_app.view.dialogs.timePickerSlidersDialog",
              controller: this,
            }).then(
              function (oDialog) {
                oView.addDependent(oDialog);

                oDialog.attachAfterOpen(
                  function () {
                    var oTimePicker = this.byId("timePickerSliders");
                    this._sOldValue = oTimePicker.getValue();
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
          var oTimePicker = this.byId("timePickerSliders");
          this.byId("selectTimeDialog").close();
          this.getView().getModel('state').setProperty('/time', oTimePicker.getValue())
        },

        handleCancelPress: function () {
          var oTimePicker = this.byId("timePickerSliders");
          oTimePicker.setValue(this._sOldValue);
          this.byId("selectTimeDialog").close();
        },

        getSelectTime: function () {
          if (this.getModelProperty('state', '/time') !== "") {
            var oTimeArr = this.getModelProperty('state', '/time').split(":").map((el) => +el);
            var unixTime = oTimeArr[0] * 3600 + oTimeArr[1] * 60 + oTimeArr[2];
            return unixTime;
          } else {
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
          var oTempArr = []
          for (var i = 0; i < oData.results.length; i++) {
            oTempArr.push(Math.round(+oData.results[i].Temp))
          }
          var maxTemp = Math.max(...oTempArr)
          var minTemp = Math.min(...oTempArr)
          console.log(oTempArr);
          console.log(maxTemp);
          console.log(minTemp);
          this.convertMinMax(maxTemp, minTemp)
        },

        convertMin: function (min) {
          return Math.floor(min / 10) * 10
        },

        convertMax: function (max) {
          return Math.ceil(max / 10) * 10
        },

        convertMinMax: function (max, min) {
          let [nMax, nMin] = [0, 0]
          if (max === min) {
            nMax = this.convertMax(max)
            nMin = this.convertMin(min)
          } else {
            nMax = max % 5 == 0 ? max + 5 : this.convertMax(max)
            nMin = min % 5 == 0 ? min - 5 : this.convertMin(min)
          }
          this.setMaxMinTemp(nMax, nMin)
        },

        setMaxMinTemp: function (max, min) {
          this.getView().byId("idVizFrame").setVizProperties({
            plotArea: {
              primaryScale: {
                fixedRange: true,
                maxValue: max,
                minValue: min
              }
            },
          })
        },

        getDataForViz: function () {
          var oFilter = new sap.ui.model.Filter();
          var oModel = this.getView().getModel();

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

          oModel.read("/CityWeatherOnDateHourlySet", {
            filters: oFilter,
            success: function (oData) {
              this.prepareViz(oData.results);
              this.getMaxMinTemp(oData)
              sap.ui.core.BusyIndicator.hide();

            }.bind(this),
            error: function () {

              sap.ui.core.BusyIndicator.hide();
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
        },

        whereIAm: function () {
          var url = "https://ipinfo.io/?token=fbd7ce3541827b";
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url);
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              console.log(JSON.parse(xhr.responseText).city);
              go(JSON.parse(xhr.responseText).city)
            }
          };
          xhr.send();
          let go = city => {
            if (city) {
              var oСhosenDay = this.byId("calendar").getSelectedDates()[0].getStartDate().getTime(); //выбранный день
              this.byId("smartForm").bindElement(`/CityWeatherOnDateSet(Date=${this.formatedDate(oСhosenDay+10800000)},City='${city}')`);
              this.getDataForViz()
            }
          }
        },
      }
    );
  });