use goods;


CREATE TABLE customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(50) UNIQUE NOT NULL,
    pw VARCHAR(50) not null,
    NAME VARCHAR(50) NOT NULL,
    moblie VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    adress1 VARCHAR(100) NOT NULL,
    adress2 VARCHAR(100),
    zipcode VARCHAR(10),
    regdate DATETIME NOT NULL
);

CREATE TABLE order (
  idx INT AUTO_INCREMENT PRIMARY KEY,
  FOREIGN KEY customer_idx references customer(idx),
  FOREIGN KEY item_idx references item(idx),
  amount INT,
  price INT,
  sent tinyint(1),
  tracking_number int,
  confirm_received tinyint(1)
);

CREATE TABLE cart (
  idx INT AUTO_INCREMENT PRIMARY KEY,
  FOREIGN KEY customer_idx references customer(idx),
  FOREIGN KEY item_idx references item(idx),
  amount INT
  totalPrice INT
);

CREATE TABLE review (
  idx INT AUTO_INCREMENT PRIMARY KEY,
  FOREIGN KEY customer_idx references customer(idx),
  FOREIGN KEY item_idx references item(idx),
  title VARCHAR(50),
  content TEXT,
  star tinyint(1),
  attach VARCHAR(100),
  regdate DATETIME
);