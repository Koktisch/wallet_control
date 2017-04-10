var listOfExpenses = [];
var listOfSettings = [];

function refreshExpenseValue() {
    document.getElementById('lastExpenses').value = 0;
}


function removeSign() {
    var val = getExpenseValue();
    val = val.slice(0, -1);
    insertValueToExpense(val);
}

function setDay()
{
    if (document.getElementById('h2DayVal').innerHTML == '') {
        var now = new Date();
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var day = days[now.getDay()];
        document.getElementById('h2DayVal').innerHTML += " " + day;
    }
}

function getExpenseValue(){
    var expense = document.getElementById('lastExpenses').value;
  if ((expense == 0) || (expense == null) || (expense == "0")){
    return "";
  }
  else{
    return expense;
  }
}

function getCurrency() {

}

function converterToDefaultCurrency() {

}

function addToArray()
{
    var val = getExpenseValue();
    var amount = val.substring(val.indexOf("X") + 1);
    var id = localStorage.getItem('DbID');
    var type = getType();
    var date = new Date();
    var strDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
    if (id == null)
    {
        id = 1;
        localStorage.setItem('DbID', id);
    }
    if (val != "" && type !== 'Choose') {
        var obj = { id: id, type: type, value: val, date: strDate };
        listOfExpenses.push(obj);    
        localStorage.setItem('DbID', ++id);
        refreshExpenseValue();
    }
    else
    {
        //TODO: walidacja/ pojawienie się błędu z nie wybranym typem
    }

}

function getType() {
    var e = document.getElementById("typeSelect");
    var type = e.options[e.selectedIndex].value;
    return type;
}

function insertValueToExpense(new_value){
    document.getElementById('lastExpenses').value  = new_value;
}

function setNumber(e){
    var expense = getExpenseValue();
    if (decimalValue(expense))
    {   
        if (e.innerHTML != 'X' || e.innerHTML != ',') {
            var new_value = expense.toString() + e.innerHTML;
            insertValueToExpense(new_value);
        }
    }  
}

function buttonSpecialSign(et){
  var expense = getExpenseValue();
  var e = expense.toString();
  if (checkstring(expense, et.innerHTML)) {
      if ((e == '') || (e == '0')) {
          var new_value = "0" + et.innerHTML;
      }
      else {
          var new_value = e + et.innerHTML;
      }
      insertValueToExpense(new_value);
  }
}

function checkstring(str, searchingChar)
{
    if (-1 === str.indexOf(searchingChar))
    {
        return true
    }
    return false;
}

// funkcja do sprawdzania czy nie próbuje wpisać więcej niż 2 cyfr po przecinku
function decimalValue(val) {
    if (!val.includes("X"))
    {
        var str = val.substring(val.indexOf(",") + 1);
        if (val.includes(","))
        {
            if (str.length >= 2)
            {
                return false;
            }
        }
        return true;
    }
    return true;
}

function cancelExpenses() {
    if (listOfExpenses.length != 0) {
        listOfExpenses = [];
    }
}

//DB functions
function insertExpensesToDatabase() {
    sessionStorage.setItem('dbExpense', listOfExpenses);
}

function insertSettingsToDatabase() {
    sessionStorage.setItem('dbSettings', listOfSettings);
}