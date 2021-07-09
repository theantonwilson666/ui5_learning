sap.ui.define([], function () {
  "use strict";
  return {
   
  formatRub: function(asd){
    // return 4
    if(asd == '0.00'){
      return "null";
    }
    else{
    return asd + " Руб";
    }
  },
    formatRowHighlight: function (sStatus) {

           if (sStatus) {
             return "Success";
           }
           else{
             return "None";
           }
          
        },
        FormatEBook:function(bStatus){
          if(bStatus){
            
              return 'Существует';
            }
            
            else{
            return "Не существует";
            }
        },
        FormatSaleability:function(sStatus){
          switch (sStatus) {
            case 'FOR_SALE':
                return "В продаже";
            case 'NOT_FOR_SALE':
                return "Не в продаже";
        }
        },
        formatMR:function(sStatus){
          switch (sStatus) {
            case 'NOT_MATURE':
                return "Нет";
         
        }
        },
        formatPrint:function(sStatus){
          switch (sStatus) {
            case 'BOOK':
                return "Книга";
         
        }
        },
        formatEnableButton:function(bStatus){

          if(bStatus){
            return false;
          }
          else{
            return true;
          }
        }
  };
});