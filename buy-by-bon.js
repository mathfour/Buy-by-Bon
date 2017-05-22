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
            // bmc: create an array with only the item id's
            // var itemIDsAvailable = ["823", "bon", "yup23"];
            // cbPrompt(itemIDsAvailable);
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
                    // + " - " + response[i].name);
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

function sellItem(itemID, quantity, cbUpdateInventory) {
    console.log("selling", itemID, "at this many", quantity);
    // bmc: todo calculate amount to be billed (
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


