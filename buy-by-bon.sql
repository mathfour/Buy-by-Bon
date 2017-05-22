CREATE DATABASE buy_by_bon;

USE buy_by_Bon;

CREATE TABLE products (
  id varchar (20) NOT NULL,
  name varchar(100) DEFAULT NULL,
  department varchar(20) DEFAULT NULL,
  price DECIMAL (8, 2) DEFAULT NULL,
  quantity INT DEFAULT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (id, name, department, price, quantity) VALUES
('B00JEYV2NC', 'Bon Bon (Sweetie Drops) My Little Pony Vinyl Figure', 'Toys', 9.39, 7),
('B004A2V3K0', 'Bon Jovi Greatest Hits', 'Entertainment', 10.49, 2),
('B071V5R5RD', 'Bon Appétit by Katy Perry', 'Entertainment', 1.29, 3),
('B004PWPE6O', 'Bon Ami Polish and Cleanser Powder', 'Household', 4.72, 18),
('B0001L0DFA', 'Bon-Aire Original Ultimate Hose Nozzle', 'Hardware', 16.99, 4),
('B001D10EQA', 'Bon-Neem Insecticidal Soap', 'Household', 17.82, 9),
('B01LZRMTJK', 'Bon 22-801 8-Inch by 8-Inch Dirt Tamper', 'Hardware', 68.68, 8),
('B016NGCNYA', 'Bon Voyage, Charlie Brown Movie', 'Entertainment', 12.99, 14),
('B004ITQEZO', 'Bon Voyage Movie, 1962', 'Entertainment', 17.99, 3),
('B005GLOAFO', 'Bon Vital Original Massage Lotion for a Versatile Massage', 'Household', 26.52, 9),
('B00ULQJFAY', 'Bon Bon Rabbit Stuffed Animal', 'Toys', 12.96, 0),
('B01A2ODG9A', 'Cindy Bon Shopkins Figure', 'Toys', 5.95, 1);

SELECT * FROM products;

SELECT * FROM products WHERE products.quantity > 0;

