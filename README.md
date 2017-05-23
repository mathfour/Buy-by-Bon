# Buy, by Bon

*Buy, by Bon* is a Node.js and SQL command line app with an Amazon-like storefront and separate customer, manager and executive facing applications. The app uses a database of products and takes in orders from customers, which depletes stock from the store's inventory. Managers and executives can add more products to different departments and track profit.

 You can find the source files at [https://github.com/mathfour/buy-by-bon](https://github.com/mathfour/buy-by-bon)

## Dependencies

Clone this repo to your desktop and run `npm install` to install its 4 dependencies.

- [mySQL](https://www.npmjs.com/package/mysql): A node.js driver for mysql

- [Colors](https://www.npmjs.com/package/colors): Used to generate colored text in the console 

- [Inquirer](https://www.npmjs.com/package/inquirer): Used to user input

- [Console.table](https://www.npmjs.com/package/console.table): A method that prints an array of objects as a table in console

## Set Up
Once you are in the *Buy, by Bon* repository, run the following code in the command line to create the *Buy, by Bon* database and the Products and Departments tables.

- `mysql -u root`

- `source products.sql`

- `source departments.sql`

-  `exit`

Then use your text editor of choice to update buy-by-bon.js ~~, manager.js, and exec.js~~ with your mysql password, if you use one.

# Customer Use

- Run `node buy-by-bon.js` to start the customer facing *Buy, by Bon* app

- Customers are shown the catalog and may choose a product to purchase by its ID. If a product has no inventory, it **_will_** be shown in the catalog, but **_will not_** come up as an option to purchase.

- Customers are shown the total and are asked to confirm their purchase. After the purchase the catalog (via the mysql database) is updated to reflect new stock quantities.

- Customers are then prompted to either exit or make another purchase.

 
### Acknowledgements 

A big thanks to the following folks:
- [Stephanie Orpilla](https://github.com/stephorpilla) whose `README.md` helped me create this one.