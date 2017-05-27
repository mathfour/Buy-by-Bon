/**
 * Created by SilverDash on 5/23/17.
 */
var mysql = require("mysql");
require("console.table");
var colors = require("colors");
var inquirer = require("inquirer");
var clear = require('clear');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "buy_by_bon"
});

// bmc: this is the method that makes the connection and then launches the welcomeThem module with the whomToWelcome parameter (customer, manager, etc.) and with the callback showOptions and secondary callback promptForChoice
exports.launchMethod = function (welcomeThem, whomToWelcome, showOptions, promptForChoice) {
    connection.connect(function (err) {
    if (err) {throw err;}
    else {
       welcomeThem(whomToWelcome, showOptions, promptForChoice);
    }
});
};

// bmc: this method shows the header upon launch or restart of any of the app types
exports.welcomeMat = function (typeOfPerson, doNext, paramsForDoNext) {
    clear();
    console.log("--------------------------------------".rainbow);
    console.log('Welcome,', typeOfPerson + ',', 'to Buy, by Bon');
    console.log("--------------------------------------".rainbow);
    doNext(paramsForDoNext);
};

// bmc: this method allows the changing of inventory quantities; passing in a negative reduces the quantity, while a positive increases the inventory
exports.changeInventory = function (itemID, qty, doLast) {
    connection.query("SELECT quantity FROM products WHERE id=?", itemID, function (err, res) {
        if (err) {
            console.log(err);
        }
        else {
            var newQuantity = parseInt(res[0].quantity) + parseInt(qty);
            connection.query("UPDATE products SET quantity=? WHERE id=?", [newQuantity, itemID], function (err, res) {
                if (err) {
                    console.log(err);
                }
                console.log('Your inventory is updated!'.bold.red);
                doLast();
            })
        }
    })
};

// bmc: this method will display the desired columns of the inventory list
exports.displayProductList = function (minQty, columns, doNext) {
    queryString = 'SELECT '+ columns + ' FROM products WHERE quantity >= ' + minQty + ';';
    connection.query(queryString, function (err, res) {
        if (err) {
            console.log(err);
        }
        else {
            console.table(res);
            doNext();
        }
    })
};

// bmc: this method takes an array of item numbers
exports.promptForItemAndQuantity = function (items, doNext, doAfter) {
    inquirer.prompt([
        {
            type: "list",
            name: "item",
            message: "For which item?",
            choices: items
        },
        {
            type: "input",
            name: "quantity",
            message: "How many?"
        }]).then(function (a) {
            doNext(a.item, a.quantity, doAfter);
   });
};

// bmc: this method gets the available item list from database (based on column needed and the minQuantity so it can be used for subsequent methods
exports.getAvailableItemList = function (column, minQuantity, doNext, doAfter, doLast) {
    queryString = 'SELECT ' + column + ' FROM products WHERE quantity >= ' + minQuantity + ';';
// queryString = '"SELECT * FROM products WHERE quantity >= 0;"'
        connection.query(queryString, function (err, res) {
        if (err) {throw err;}
        else {
            JSON.stringify(res);
            var itemsToShow = [];
            for (var i = 0; i < res.length; i++) {
                itemsToShow.push(res[i].id);
            }
            // bmc: display the actual prompts
            // return itemsToShow;
            doNext(itemsToShow, doAfter, doLast);
        }
    })
};



exports.saveNewRecord = function (tableName, columnsString, valuesString) {
   connection.query('INSERT INTO ' + tableName + ' ' + columnsString + ' VALUES ' + valuesString + ';');
   // bmc: gotta take array of columns and make a columnsString. Likewise for values.
// (id, name, department, price, quantity)
// ('B00JEYV2NC', 'Bon Bon (Sweetie Drops) My Little Pony Vinyl Figure', 'Toys', 9.39, 7)
};


// bmc: for the supervisor part
    // (id, name, overhead, sales, profit)
    // (TOY, Toys, 477, 3892, subtract )
    // (ENT, Entertainment, 3888, 23883, subtract)
    // (HHD, Household, 1223, 7836, subtract)
    // (HDW, Hardware, 837, 5368, subtract)



// bmc: this is the function I use when I need to just have a placeholder
exports.doNothing = function () {
    console.log("I'm not doin' nothin'!");
    process.exit();

};

exports.sitStill = function () {
   // bmc: just a function to take up space
};
