sap.ui.define([], function () {
    return {
        cutLonLat: function (num) {
            return parseInt(num * 10000) / 10000
        },
        weatherImg: function (img) {
            return `http://openweathermap.org/img/w/${img}.png`
        },


    };
});