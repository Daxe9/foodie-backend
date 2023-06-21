import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1686815288244 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`person\` (
\t\`id\` INT AUTO_INCREMENT NOT NULL,
\t\`email\` VARCHAR(255) NOT NULL UNIQUE, 
\t\`password\` VARCHAR(255) NOT NULL, 
\t\`phone\` VARCHAR(15) NOT NULL, 
\t\`address\` VARCHAR(255) NOT NULL,
\t\`role\` ENUM('user', 'restaurant', 'rider') NOT NULL,
    PRIMARY KEY(\`id\`)
);`);

        await queryRunner.query(`CREATE TABLE \`user\` ( 
\t\`id\` INT AUTO_INCREMENT NOT NULL,
\t\`firstName\` VARCHAR(255) NOT NULL, 
\t\`lastName\` VARCHAR(255) NOT NULL, 
    \`personId\` INT NOT NULL,
\tCONSTRAINT \`FK_user_person\` FOREIGN KEY (\`personId\`) REFERENCES \`person\` (\`id\`),
\tPRIMARY KEY(\`id\`)    
); `);

        await queryRunner.query(`CREATE TABLE \`singleDay\` (
\t\`id\` INT NOT NULL AUTO_INCREMENT,
    \`opening1\` TIME ,
    \`closing1\` TIME,
    \`opening2\` TIME,
    \`closing2\` TIME,
    PRIMARY KEY(\`id\`)
);`);

        await queryRunner.query(`CREATE TABLE \`timetable\` (
\t\`id\` INT NOT NULL AUTO_INCREMENT,
\t\`mondayId\` INT,
    \`tuesdayId\` INT,
    \`wednesdayId\` INT,
    \`thursdayId\` INT,
    \`fridayId\` INT,
    \`saturdayId\` INT,
    \`sundayId\` INT,
    CONSTRAINT \`FK_timetable_singleDay1\` FOREIGN KEY (\`mondayId\`) REFERENCES \`singleDay\`(\`id\`),
\tCONSTRAINT \`FK_timetable_singleDay2\` FOREIGN KEY (\`tuesdayId\`) REFERENCES \`singleDay\`(\`id\`),
    CONSTRAINT \`FK_timetable_singleDay3\` FOREIGN KEY (\`wednesdayId\`) REFERENCES \`singleDay\`(\`id\`),
    CONSTRAINT \`FK_timetable_singleDay4\` FOREIGN KEY (\`thursdayId\`) REFERENCES \`singleDay\`(\`id\`),
    CONSTRAINT \`FK_timetable_singleDay5\` FOREIGN KEY (\`fridayId\`) REFERENCES \`singleDay\`(\`id\`),
    CONSTRAINT \`FK_timetable_singleDay6\` FOREIGN KEY (\`saturdayId\`) REFERENCES \`singleDay\`(\`id\`),
    CONSTRAINT \`FK_timetable_singleDay7\` FOREIGN KEY (\`sundayId\`) REFERENCES \`singleDay\`(\`id\`),
    PRIMARY KEY(\`id\`)
);`);

        await queryRunner.query(`CREATE TABLE \`restaurant\` ( 
\t\`id\` INT AUTO_INCREMENT NOT NULL,
\t\`name\` VARCHAR(255) NOT NULL UNIQUE,
\t\`url\` VARCHAR(2048) NOT NULL,
\t\`category\` VARCHAR(255) NOT NULL,
\t\`personId\` INT NOT NULL,
\t\`timetableId\` INT,
\tCONSTRAINT \`FK_restaurant_person\` FOREIGN KEY (\`personId\`) REFERENCES \`person\` (\`id\`),
\tCONSTRAINT \`FK_restaurant_timetable\` FOREIGN KEY (\`timetableId\`) REFERENCES \`timetable\`(\`id\`),
    PRIMARY KEY(\`id\`)
); `);

        await queryRunner.query(`CREATE TABLE \`rider\` (
\t\`id\` INT AUTO_INCREMENT NOT NULL,
\t\`personId\` INT NOT NULL,
\t\`isAvailable\` BOOLEAN NOT NULL,
\tCONSTRAINT \`FK_rider_person\` FOREIGN KEY (\`personId\`) REFERENCES \`person\` (\`id\`),
    PRIMARY KEY(\`id\`)
);`);
        await queryRunner.query(`CREATE TABLE \`item\` ( 
\t\`id\` INT NOT NULL AUTO_INCREMENT, 
\t\`name\` VARCHAR(255) NOT NULL, 
\t\`description\` VARCHAR(255) NOT NULL, 
\t\`preparationTimeMinutes\` INT NOT NULL, 
\t\`restaurantId\` INT NOT NULL, 
\t\`price\` DECIMAL(10, 2) NOT NULL, PRIMARY KEY (\`id\`), 
\tCONSTRAINT  \`FK_item_restaurant\` FOREIGN KEY (\`restaurantId\`) REFERENCES \`restaurant\` (\`id\`) 
);
`);
        await queryRunner.query(`CREATE TABLE \`order\` ( 
\t\`id\` INT NOT NULL AUTO_INCREMENT, 
\t\`address\` VARCHAR(255) NOT NULL,
\t\`phone\` VARCHAR(15) NOT NULL,
\t\`timestamp\` DATETIME NOT NULL,
\t\`status\` ENUM('pending', 'preparationStart', 'preparationEnd', 'deliveryStart', 'deliveryEnd') NOT NULL,
\t\`total\` DECIMAL(10, 2) NOT NULL,
\t\`userId\`  INT NOT NULL,
\t\`restaurantId\`  INT NOT NULL,
\t\`riderId\` INT NULL, 
    PRIMARY KEY (\`id\`), 
\tCONSTRAINT \`FK_order_userId\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`), 
\tCONSTRAINT \`FK_order_riderId\` FOREIGN KEY (\`riderId\`) REFERENCES \`rider\` (\`id\`),
\tCONSTRAINT \`FK_order_restaurantId\` FOREIGN KEY (\`restaurantId\`) REFERENCES \`restaurant\` (\`id\`)
);
`);
        await queryRunner.query(`CREATE TABLE \`itemOrder\` ( 
\t\`id\` INT NOT NULL AUTO_INCREMENT,
\t\`itemId\` INT NOT NULL, 
\t\`orderId\` INT NOT NULL, 
\tPRIMARY KEY (\`id\`), 
\tCONSTRAINT \`FK_itemOrder_itemId\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\` (\`id\`), 
\tCONSTRAINT \`FK_itemOrder_orderId\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\` (\`id\`) 
); 
`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "person";
            DROP TABLE "timetable";
            DROP TABLE "singleDay"; 
            DROP TABLE "itemOrder"; 
            DROP TABLE "user";
            DROP Table "restaurant";
            DROP Table "item";
            DROP Table "order";
            DROP Table "rider"; 
        `);
    }
}
