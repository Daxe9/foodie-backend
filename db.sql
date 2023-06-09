CREATE DATABASE FOODIE;

USE FOODIE;

CREATE TABLE RESTAURANTS (
	NAME_RESTAURANT VARCHAR(50) PRIMARY KEY NOT NULL,
    EMAIL VARCHAR(256) NOT NULL,
    PW VARCHAR(64) NOT NULL,
    ADDRESS VARCHAR(256) NOT NULL,
    PHONE BIGINT NOT NULL
);

CREATE TABLE USERS (
	NAME_USER VARCHAR(64) NOT NULL,
    SURNAME_USER VARCHAR(64) NOT NULL,
	EMAIL VARCHAR(256) PRIMARY KEY NOT NULL,
    PW VARCHAR(64) NOT NULL,
    ADDRESS VARCHAR(256) NOT NULL,
    PHONE BIGINT NOT NULL
);

CREATE TABLE ITEMS (
	ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	NAME_ITEM VARCHAR(50) NOT NULL,
    DESCRIPTION VARCHAR(256),
	NAME_RESTAURANT VARCHAR(50) NOT NULL,
    FOREIGN KEY(NAME_RESTAURANT) REFERENCES RESTAURANTS(NAME_RESTAURANT)
);

CREATE TABLE RIDERS (
	
    ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    PHONE BIGINT NOT NULL
);

CREATE TABLE ITEMSORDERS (
	ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    ID_ITEM INT NOT NULL,
    ID_ORDER INT NOT NULL,
    FOREIGN KEY(ID_ITEM) REFERENCES ITEMS(ID),
    FOREIGN KEY(ID_ORDER) REFERENCES ORDERS(ID)
);

CREATE TABLE ORDERS (
	ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    EMAIL_USER VARCHAR(256) NOT NULL,
    ID_RIDER INT,
    FOREIGN KEY(ID_RIDER) REFERENCES RIDERS(ID),
    FOREIGN KEY(EMAIL_USER) REFERENCES USERS(EMAIL)
);
/*
INSERT INTO RESTAURANTS (NAME_RESTAURANT, EMAIL, PW, ADDRESS, PHONE)
VALUES
    ('Restaurant A', 'restaurantA@example.com', 'passwordA', '123 Main Street', 1234567890),
    ('Restaurant B', 'restaurantB@example.com', 'passwordB', '456 Elm Street', 9876543210),
    ('Restaurant C', 'restaurantC@example.com', 'passwordC', '789 Oak Street', 5678901234),
    ('Restaurant D', 'restaurantD@example.com', 'passwordD', '321 Pine Street', 4321098765),
    ('Restaurant E', 'restaurantE@example.com', 'passwordE', '654 Cedar Street', 210987654305);

INSERT INTO USERS (NAME_USER, SURNAME_USER, EMAIL, PW, ADDRESS, PHONE)
VALUES
    ('Mario', 'Rossi', 'mariorossi@libero.it', 'mariorossi', 'via roma 1', 11111111),
    ('John', 'Doe', 'johndoe@example.com', 'password1', '123 Main Street', 1234567890),
    ('Jane', 'Smith', 'janesmith@example.com', 'password2', '456 Elm Street', 9876543210),
    ('Michael', 'Johnson', 'michaeljohnson@example.com', 'password3', '789 Oak Street', 5678901234),
    ('Emily', 'Davis', 'emilydavis@example.com', 'password4', '321 Pine Street', 4321098765);

INSERT INTO RIDERS (PHONE)
VALUES
    (1111111111),
    (2222222222),
    (3333333333),
    (4444444444),
    (5555555555);

INSERT INTO ITEMS (NAME_ITEM, DESCRIPTION, NAME_RESTAURANT)
VALUES
    ('Item A', 'Description A', 'Restaurant A'),
    ('Item B', 'Description B', 'Restaurant B'),
    ('Item C', 'Description C', 'Restaurant C'),
    ('Item D', 'Description D', 'Restaurant D'),
    ('Item E', 'Description E', 'Restaurant E');

    
INSERT INTO ORDERS (EMAIL_USER, ID_RIDER)
VALUES
    ('mariorossi@libero.it', 1),
    ('johndoe@example.com', 2),
    ('janesmith@example.com', 3),
    ('emilydavis@example.com', 5),
    ('michaeljohnson@example.com', 4);

*/
