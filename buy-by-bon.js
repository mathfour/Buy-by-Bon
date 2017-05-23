/**
 * Created by SilverDash on 5/22/17.
 */

var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// var Table = require('cli-table'); // bmc: constructor

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "buy_by_bon"
});

function showCatalog(cbPrompt) {
    console.log("----------------------------");
    console.log("Welcome to Buy, by Bon")
    console.log("----------------------------");
    console.log("Here is our current catalog:");
    connection.connect(function (err) {
        if (err) {
            console.log(err);
        }

        connection.query("SELECT id, name, price FROM products;", function (err, res) {
            console.table(res);
            // var catalog = new Table();
            // catalog.push(res);
            // console.log(catalog);
        });
        connection.query("SELECT * FROM products WHERE quantity > 0;", function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                JSON.stringify(res);
                var itemsToShow = [];
                for (var i = 0; i < res.length; i++) {
                    itemsToShow.push(res[i].id);
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
            message: "Which item would you like to purchase? \n(If the item number is not shown, it's because \n we currently have no inventory.)",
            choices: items
        },
        {
            type: "input",
            name: "quantity",
            message: "How many of these would you like?"
        }]).then(function (a) {

        connection.query("SELECT * FROM products WHERE quantity > ? AND id = ?;", [a.quantity, a.item], function (err, res) {
            if (err) {
                console.log(err);
            }
            else {
                if (res.length > 0) {
                    console.log("We are happy to complete your order!");
                    sellItem(a.item, a.quantity);
                }
                else {
                    console.log("Unfortunately we do not have sufficient inventory to complete" +
                            " your order");
                    startOver();
                }
            }
        });
    });
}

function sellItem(itemID, qty) {
    connection.query("SELECT price FROM products WHERE id = ?", itemID, function (err, res) {
        if (err) {
            console.log(err);
        }
        else {
            var totalPrice = parseFloat(res[0].price) * parseFloat(qty);
            console.log("Your total is $", totalPrice);
            console.log("Send a check or money order to 1123 Fibonacci Lane, Houston, Texas");
            console.log("Allow 4-6 weeks for delivery");
            // bmc: confirm purchase?
            inquirer.prompt({
                type: "confirm",
                message: "Would you like to complete this order?",
                name: "confirmOrder",
                default: "yes"
            }).then(function (a) {
                if (a.confirmOrder === false) {
                    console.log("Your order has been cancelled.");
                }
                else {
                    console.log("Thank you for your order!");
                    connection.query("SELECT quantity FROM products WHERE id=?", itemID, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            var newQuantity = parseInt(res[0].quantity) - parseInt(qty);
                            connection.query("UPDATE products SET quantity=? WHERE id=?", [newQuantity, itemID], function (err, res) {
                                if (err) {
                                    console.log(err);
                                }
                            })
                        }
                    })
                }
                startOver();
            });
        }

    })
}

function startOver() {
    inquirer.prompt({
        type: "list",
        message: "Would you like to order something else or quit?",
        name: "action",
        choices: ["Order", "Quit"]
    }).then(function (a) {
        if (a.action === "Order") {
            showCatalog(prompt);
        }
        else if (a.action === "Quit") {
            process.exit();
        }
    })
}

showCatalog(prompt);
