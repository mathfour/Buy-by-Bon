/**
 * Created by SilverDash on 5/22/17.
 */

var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "buy_by_bon"
});

function showCatalog(cbPrompt) {
    connection.connect(function (error) {
        if (error) {
            // throw error;
            console.log(error);
        }

        connection.query("SELECT * FROM products;", function (err, response) {
            console.table(response);
        });
        connection.query("SELECT * FROM products WHERE quantity > 0;", function (error, response) {
            if (error) {
                console.log(error);
            }
            else {
                JSON.stringify(response);
                var itemsToShow = [];
                for (var i = 0; i < response.length; i++) {
                    itemsToShow.push(response[i].id);
                }
                cbPrompt(itemsToShow);
            }

        })
    });
}

function prompt(items) {
    inquirer.prompt([
        {
            type: "list",
            name: "item",
            message: "Which item would you like to purchase?",
            choices: items
        },
        {
            type: "input",
            name: "quantity",
            message: "How many of these would you like?"
        }]).then(function (answers) {

        connection.query("SELECT * FROM products WHERE quantity > ? AND id = ?;", [answers.quantity, answers.item], function (error, response) {
            if (error) {
                console.log(error);
            }
            else {
                if (response.length > 0) {
                    console.log("We have enough!");
                    sellItem(answers.item, answers.quantity);
                }
                else {
                    console.log("awe bummer, there aren't enough!");
                }
            }
        });
    });
}

function sellItem(itemID, quantity) {
    console.log("selling", itemID, "at this many", quantity);
    connection.query("SELECT price FROM products WHERE id = ?", itemID, function (error, response) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(response[0].price);
            console.log(quantity);
            var totalPrice = parseFloat(response[0].price) * parseFloat(quantity);
            console.log("Your total is $", totalPrice);
            console.log("Send a check or money order to 1123 Fibonacci Lane, Houston, Texas");
            console.log("Allow 4-6 weeks for delivery");
            // bmc: confirm purchase?
            cbStartOver();
        }
        connection.query("SELECT quantity FROM products WHERE id=?", itemID, function (e, r) {
            if (e) {
                console.log(e);
            }
            else {
                var newQuantity = parseInt(r[0].quantity) - parseInt(quantity);
                connection.query("UPDATE products SET quantity=? WHERE id=?", [newQuantity, itemID], function (error, response) {
                    if (error) {
                        console.log(error);
                    }
                })
            }
        })
    })
    // bmc: todo then reroute to a StartOver
}

function cbStartOver() {
    console.log("starting over");
    // bmc: prompt for quit or order something else
}

// bmc: this isn't used right now.
function checkInventory(item, thisMany) {
    connection.query("SELECT * FROM products WHERE quantity > ? AND id = ?;", [thisMany, item], function (error, response) {
        if (error) {
            console.log(error);
            return error;
            // bmc: not sure what to do here - do I return something else?
        }
        else {
            return (response.length > 0);
        }
    });
}

showCatalog(prompt);

