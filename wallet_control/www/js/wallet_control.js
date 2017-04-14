var listOfExpenses = [];
var settings = {
    balance: "",
    setCurrency: "",
    expense: ""
};

function refreshExpenseValue() {
    document.getElementById('lastExpenses').value = 0;
}

function removeSign() {
    var val = getExpenseValue();
    val = val.slice(0, -1);
    insertValueToExpense(val);
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

// funkcja ustawiajaca walute na ekranie dodawania wydaktow w zaleznosci od ustawien w opcjach
function setDefaultCurrency() {
    setSettings();
	$('#setCurrency').on('change', function(){
		$('#currency').val($(this).val());
	});
}
// wywolanie ww funkcji po uruchomieniu aplikacji
$(document).ready(function(){
	setDefaultCurrency();
});

function converterToDefaultCurrency() {

}

function getExchangeRate()
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://api.nbp.pl/api/exchangerates/tables/C/?format=json", false);
    xhr.send();
    if (xhr.status == 200)
    {
        sessionStorage.setItem('dbExchanfeRate',xhr.responseText);
    } 
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

function setSettingsInDB(e)
{   
    settingBD = sessionStorage.getItem('dbSettings', settings);
    settings = $.parseJSON(settingBD);
    switch (e.id)
    {
        case "balance":
            settings.balance = $("#" + e.id).val();
            break;
        case "setCurrency":
            settings.setCurrency = $("#"+e.id+ " option:selected").val();
            break;
        case "expense":
            settings.expense = $("#"+e.id).val();
            break;
        default:
            ;
            break;
    }
    insertSettingsToDatabase();
}

function cancelExpenses() {
    if (listOfExpenses.length != 0) {
        listOfExpenses = [];
    }
}

function setSettings() {
    var sett = sessionStorage.getItem('dbSettings', settings);
    if (sett != "undefined") {
        var setobj = $.parseJSON(sett);
        $("#balance").val(setobj.balance);        
        $("#expense").val(setobj.expense);
        $('#currencySelect').val(setobj.setCurrency).change();
    }
}

//DB functions
function insertExpensesToDatabase() {
    sessionStorage.setItem('dbExpense', JSON.stringify(listOfExpenses));
}

function insertSettingsToDatabase() {
    sessionStorage.setItem('dbSettings', JSON.stringify(settings));
}

