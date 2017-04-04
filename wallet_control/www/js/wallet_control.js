function refreshExpenseValue() {
    document.getElementById('lastExpenses').value  = 0;
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

function insertValueToExpense(new_value){
    document.getElementById('lastExpenses').value  = new_value;
}

function setNumber(e){
    var expense = getExpenseValue();
    if (decimalValue(expense))
    {
        var new_value = expense.toString() + e.innerHTML;
        insertValueToExpense(new_value);
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