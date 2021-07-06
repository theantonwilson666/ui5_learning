sap.ui.define(
  [
    "intheme/currency/controller/Main.controller",
    "sap/ui/unified/DateRange",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/library",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
  ],
  function (
    Controller,
    DateRange,
    JSONModelg,
    DateFormat,
    coreLibrary,
    ChartFormatter,
    Format
  ) {
    "use strict";

    var CalendarType = coreLibrary.CalendarType;

    return Controller.extend(
      "intheme.zjira_project_register.controller.Detail",
      {
        oFormatYyyymmdd: null,
        onInit: function () {
          this.getRouter()
            .getRoute("DetailRoute")
            .attachPatternMatched(this._onRouteMatched, this);
          //свойство график
          //oViewModel.setProperty("/chart/", this._chart);
          // календарь
          this.oFormatYyyymmdd = DateFormat.getInstance({
            pattern: "yyyy-MM-dd",
            calendarType: CalendarType.Gregorian,
          });
        },
        _onRouteMatched: function (oEvent) {
          var oArr = oEvent.getParameter("arguments")["?query"];

          var oRowContext = this.getStateProperty("/currentRow");

          this.getView().byId("AnyCoeff").setText(oRowContext.Coeff);
          this.getView().byId("AnySourceCurr").setText(oRowContext.SourceCurr);
          this.getView()
            .byId("AnyCurrencyDescr")
            .setText(oRowContext.CurrencyDescr);
          this.getView().byId("AnyCurrencyId").setText(oRowContext.CurrencyId);

          this.getView()
            .byId("DetailBox")
            .bindElement("/CurrencyRegister('" + oArr.CurrencyId + "')");

          this.setStateProperty("/layout", "TwoColumnsMidExpanded");
        },

        handleCalendarSelect: function (oEvent) {
          var oCalendar = oEvent.getSource();
          if (oCalendar.getSelectedDates()[0].getEndDate()) {
            this.getDataForViz(
              oCalendar.getSelectedDates()[0].getStartDate(),
              oCalendar.getSelectedDates()[0].getEndDate()
            );
          }
        },

        // _updateText: function(oSelectedDates) {
        //   debugger
        //   var oSelectedDateFrom = this.byId("selectedDateFrom"),
        //     oSelectedDateTo = this.byId("selectedDateTo"),
        //     oDate;

        //   if (oSelectedDates) {
        //     oDate = oSelectedDates.getStartDate();
        //     if (oDate) {
        //       oSelectedDateFrom.setText(this.oFormatYyyymmdd.format(oDate));
        //     } else {
        //       oSelectedDateTo.setText("No Date Selected");
        //     }
        //     oDate = oSelectedDates.getEndDate();
        //     if (oDate) {
        //       oSelectedDateTo.setText(this.oFormatYyyymmdd.format(oDate));
        //     } else {
        //       oSelectedDateTo.setText("No Date Selected");
        //     }
        //   } else {
        //     oSelectedDateFrom.setText("No Date Selected");
        //     oSelectedDateTo.setText("No Date Selected");
        //   }
        // },

        handleSelectThisWeek: function () {
          this._selectWeekInterval(6);
        },

        handleSelectWorkWeek: function () {
          this._selectWeekInterval(4);
        },

        handleWeekNumberSelect: function (oEvent) {
          var oDateRange = oEvent.getParameter("weekDays"),
            iWeekNumber = oEvent.getParameter("weekNumber");

          if (iWeekNumber % 5 === 0) {
            oEvent.preventDefault();
            MessageToast.show(
              "You are not allowed to select this calendar week!"
            );
          } else {
            // this._updateText(oDateRange);
          }
        },

        _selectWeekInterval: function (iDays) {
          var oCurrent = new Date(), // get current date
            iWeekStart = oCurrent.getDate() - oCurrent.getDay() + 1,
            iWeekEnd = iWeekStart + iDays, // end day is the first day + 6
            oMonday = new Date(oCurrent.setDate(iWeekStart)),
            oSunday = new Date(oCurrent.setDate(iWeekEnd)),
            oCalendar = this.byId("calendar");

          oCalendar.removeAllSelectedDates();
          oCalendar.addSelectedDate(
            new DateRange({ startDate: oMonday, endDate: oSunday })
          );

          // this._updateText(oCalendar.getSelectedDates()[0]);
        },
        getCurrencyId: function () {
          return this.byId("AnyCurrencyId").mProperties.text;
        },

        getSelectedDateFrom: function () {
          if (this.byId("calendar").getSelectedDates()[0].getStartDate()) {
            return this.byId("calendar").getSelectedDates()[0].getStartDate();
          } else {
          }
        },

        getSelectedDateTo: function () {
          return this.byId("calendar").getSelectedDates()[0].getEndDate();
        },

        //график делаем
        getDataForViz: function (oDateFrom, oDateTo) {
          var oFilter = new sap.ui.model.Filter();

          var oModel = this.getView().getModel();
          var oModelJson = new sap.ui.model.json.JSONModel();

          var fDataFrom = new sap.ui.model.Filter({
            path: "Date",
            operator: sap.ui.model.FilterOperator.BT,
            value1: oDateFrom,
            value2: oDateTo,
          });
          var fValue = new sap.ui.model.Filter({
            path: "CurrencyId",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: this.getCurrencyId(),
          });

          var oFilter = new Array();
          oFilter.push(fDataFrom);
          oFilter.push(fValue);

          oModel.read("/HistoricCurrencySet", {
            filters: oFilter,
            success: function (oData) {
              this.prepareViz(oData.results);
            }.bind(this),
            error: function () {
              console.log("error");
            }.bind(this),
          });
        },

        getMaxMinRate: function(oData){

          var aArr = [];

          oData.forEach(item=>{
            aArr.push(item.CurrencyAmount);
          })

          return {
            max : Math.max(...aArr),
            min : Math.min(...aArr)
          };
        },


        prepareViz: function (oData) {
          Format.numericFormatter(ChartFormatter.getInstance());
          var formatPattern = ChartFormatter.DefaultPattern;

          var oVizFrame = this.getView().byId("idVizFrame");

          var oMaxMin = this.getMaxMinRate(oData);

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
                maxValue: Math.round(oMaxMin.max + 5),
                minValue: Math.round(oMaxMin.min - 5)
              }
            },
            legend: {
              visible: true,
              title: {
                visible: false,
              },
            },
            valueAxis: {
              title: {
                visible: true,
                text: "Валюта",
              },
            },

            timeAxis: {
              title: {
                visible: true,
                text: "Дата",
              },

              interval: {
                unit: "",
              },
            },
            title: {
              visible: true,
              text: "Значение валюты за период",
            },

            interaction: {
              syncValueAxis: false,
            },
          });

          var oPopOver = this.getView().byId("idPopOver");
          oPopOver.connect(oVizFrame.getVizUid());
          oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
          var oJson = new sap.ui.model.json.JSONModel({ Chart: oData });
          oVizFrame.setModel(oJson, "ChartMdl");
        },
        kek: function () {
          //получим компонент

          this.getDataForViz();
        },
      }
    );
  }
);
