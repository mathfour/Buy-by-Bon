/**
 * Created by SilverDash on 5/23/17.
 */
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");
var colors = require("colors");
var mod = require("./modules-bbb.js");
var clear = require('clear');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "buy_by_bon"
});

mod.launchMethod(mod.welcomeMat, "Manager", promptManager);

function promptManager() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "managerChoice",
        choices: ["View Catalog of Products", "Run report of low inventory", "Add to the inventory", "Create a new product", "Quit"]
    }).then(function (answer) {
        switch (answer.managerChoice) {
            case "View Catalog of Products":
                viewCatalog(promptManager);
                break;
            case "Run Report of Low Inventory":
                mod.welcomeMat("Manager", lowInventory, promptManager);
                // mod.doNothing();
                break;
            case "Add to the Inventory":
                mod.getAvailableItemList('id', 0, mod.promptForItemAndQuantity, mod.changeInventory, promptManager);
                break;
            case "Create a New Product":
                console.log("creating a new product");
                // mod.doNothing();
                createProduct();
                break;
            case "Quit":
                console.log("quitting");
                mod.doNothing();
        }
    });
}

function viewCatalog(doNext) {
    console.log("Here is our current catalog:".green);
    mod.displayProductList(0, "*", doNext);
}

function lowInventory(doNext) {
    console.log("Here is our low inventory:".green);
    mod.displayProductList(5, '*', doNext);
}

function createProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Unique Product ID: "
        },
        {
            type: "input",
            name: "name",
            message: 'Name of item: '
        },
        {
            type: 'list',
            name: 'department',
            message: 'Department: ',
            choices: ['Toys', 'Hardware', 'Household', 'Entertainment']
        },
        {
            type: 'input',
            name: 'price',
            message: 'Price: '
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'Quantity: '
        }
    ]).then(function (ans) {
        valueString = '("'
                + ans.id + '", "'
                + ans.name + '", "'
                + ans.department + '", "'
                + ans.price + '", "'
                + ans.quantity + '")';
        console.log(valueString);
        columnString = '(id, name, department, price, quantity)';
        mod.saveNewRecord('')
        mod.doNothing();
        // ans.forEach(function(answer, index) {
        //     console.log(product);
        //     valueString += answer + ', '
        // });
        // console.log(valueString);
        // for (var i = 0, i < ans.length, i++) {
        //     valueString += ans[i];
        // }
        // columnString = 'id, name, department, price, quantity';
    })
}

