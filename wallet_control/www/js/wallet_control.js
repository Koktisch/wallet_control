var listOfExpenses = [];
var date = new Date();
var settings = {
    balance: "",
    expense: "",
    currency: ""
};
var objExpenses =
    {
        id: "",
        type: "",
        value: "",
        date: ""
    };
var curentMoney = {
    val: "",
    date: ""
};

var balanceVal;

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

function putInList(e) {
    var newDiv = '<div class="newAddedExpenseList" ' + ">" + 'Value:' + e.value + "  Type:" + e.type +
        "<a class=\"ui-btn ui-icon - delete ui-btn-icon-right\" onclick=\"removeFromList(this);\"></a>"
        + "</div>";
    $('#listExpenses').append(newDiv); 
}

function removeFromList(ethis)
{
    var innerTxt = ethis.parentElement.innerHTML;
    ethis.parentElement.outerHTML = "";
}

function refreshExpenseValue() {
    document.getElementById('lastExpenses').value = 0;
}

function getExchangeRate() {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://api.nbp.pl/api/exchangerates/tables/C/?format=json", false);
        xhr.send();
        if (xhr.status == 200) {
            localStorage.setItem('dbExchangeRate', xhr.responseText);
        }
    }
    catch (err)
    {
        navigator.notification.alert(
            'An unknown error occurred while retrieving the data. Please check your network connection or enter expense in EUR and try again.',  
            null,         
            'Error',          
            'OK'               
        );
    }
}

function setMoney(valu)
{
    var date = new Date();
    if (valu != true) {        
        curentMoney = JSON.parse(localStorage.getItem('dbMoney'));
        if (curentMoney != null && curentMoney.date == (date.getDate() + '-' + date.getMonth() + 1) + '-' + date.getFullYear())
        {            
            $('#moneysLeft').val(parseFloat(curentMoney.val).toFixed(2));
        }
        else
        {
            var settingObj = $.parseJSON(localStorage.getItem('dbSettings'));
            $('#moneysLeft').val(parseFloat(settingObj.expense).toFixed(2));
        }
    }
    else {
        var moneyVal = $('#moneysLeft').val();
        curentMoney.val = moneyVal - objExpenses.value;
        $('#moneysLeft').val(parseFloat(curentMoney.val).toFixed(2));
        if (moneyVal - objExpenses.value < 0)
        {
            navigator.vibrate(1000);
        }
    }
    curentMoney = {
        val: curentMoney.val,
        date: (date.getDate() + '-' + date.getMonth() + 1) + '-' + date.getFullYear()
    };
}
function converterToDefaultCurrency(valmoney) {
    var currencyTable = $.parseJSON(localStorage.getItem('dbExchangeRate'));
    if (currencyTable == null)
    {
        getExchangeRate();
    }
    var currencyCode = getCurrency();
    var convertedMoney = 0;
    for (var x = 0; x < currencyTable[0].rates.length; x++)
    {
        if (currencyTable[0].rates[x].code == currencyCode)
        {
            convertedMoney = currencyTable[0].rates[x].ask * valmoney;
            break;
        }
    }    
    return convertedMoney;
}

function getCurrency()
{
    var codeStr = $('#currency-button')[0].parentElement.innerText;
    return codeStr.slice(0,3);
}

function addToArray()
{
    var val = getExpenseValue();  
    var valmoney = val.split("X")[0];
    var nb = val.split("X")[1];
    if (getCurrency() != "PLN") {
        valmoney = converterToDefaultCurrency(valmoney);
    }
    if (nb != undefined && nb != 0) {
        val = valmoney * nb;
    }
    else {
        val = valmoney;
    }
    var id = localStorage.getItem('DbID');
    var type = getType();    
    var date = new Date();
    var strDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
    if (id == null)
    {
        id = 1;
        localStorage.setItem('DbID', id);
    }
    if (val != "" && type !== 'Othere') {
        objExpenses = { id: id, type: type, value: val, date: strDate };
        listOfExpenses.push(objExpenses);    
        localStorage.setItem('DbID', ++id); 
        refreshExpenseValue();
        setMoney(true);
        putInList(objExpenses);
    }
    else
    {
        objExpenses = { id: id, type: 'Othere', value: val, date: strDate };
        listOfExpenses.push(objExpenses);
        localStorage.setItem('DbID', ++id);
        refreshExpenseValue();
        setMoney(true);
        putInList(objExpenses);
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

function setFromAmount()
{
    var expMon = $("#setExpense").val();
    $('#moneysLeft').val(expMon);
}

function buttonSpecialSign(et){
  var expense = getExpenseValue();
  var e = expense.toString();
  if (checkstring(expense, et.innerHTML)) {
      if ((e == '') || (e == '0')) {
          if (et.innerHTML != ",") {
              var new_value = "0" + et.innerHTML;
          }
          else {
              var new_value = "0" + ".";
          }
      }
      else {
          if (et.innerHTML != ",") {
              var new_value = e + et.innerHTML;
          }
          else {
              var new_value = e + ".";
          }          
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
        var str = val.substring(val.indexOf(".") + 1);
        if (val.includes("."))
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
    $('#hdShopping').click();
}

function setSettings() {
    var sett = localStorage.getItem('dbSettings', settings);
    if (sett != "undefined") {
        var setobj = $.parseJSON(sett);
        $("#balance").val(setobj.balance);
        $("#expense").val(setobj.expense);      
    }
}

function saveSetting()
{
    settings.balance = $("#balance").val();
    settings.expense = $("#expense").val();
    localStorage.setItem('dbSettings', JSON.stringify(settings));
    if (curentMoney != null) {
        localStorage.setItem('dbMoney', JSON.stringify(curentMoney));
    }
    else {
        localStorage.setItem('dbMoney', JSON.stringify(settings.balance));
    }
    $('#lastExpenses').val(settings.expense);
}

function setBalance(monLimit)
{
    var spentVal = 0;
    for (var x = 0; x < listOfExpenses.length; x++)
    {
        spentVal +=  listOfExpenses[x].value;
    }    
   /* if (monLimit > 0) {
        navigator.notification.alert(
            'You spent ' + parseFloat(spentVal).toFixed(2) + '\n' + 'Monthly limit ' + parseFloat(monLimit).toFixed(2),
            null,
            '',
            'Ok'
        );
    }
    else {
        navigator.notification.alert(
            'You spent ' + parseFloat(spentVal).toFixed(2) + '\n' + 'Monthly limit ' + parseFloat(monLimit).toFixed(2) + '\n' + 'Limit exceeded!',
            null,
            '',
            'Ok'
        );
    }*/
    balanceVal = spentVal;
}
//DB functions
function insertExpensesToDatabase() {
    localStorage.setItem('dbExpense', JSON.stringify(listOfExpenses));
    var bal = $.parseJSON(localStorage.getItem('dbMoney'));
    setBalance(bal.val - balanceVal);
    localStorage.setItem('dbBalance', JSON.stringify(bal.val - balanceVal));    
    localStorage.setItem('dbMoney', JSON.stringify(curentMoney));
} 