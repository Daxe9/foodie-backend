import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTables1686815288244 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`person\` (
\t\`id\` INT AUTO_INCREMENT NOT NULL,
\t\`email\` VARCHAR(255) NOT NULL UNIQUE, 
\t\`password\` VARCHAR(255) NOT NULL, 
\t\`phone\` VARCHAR(15) NOT NULL, 
\t\`address\` VARCHAR(255) NOT NULL,
    PRIMARY KEY(\`id\`)
);`)

        await queryRunner.query(`CREATE TABLE \`user\` ( 
\t\`id\` INT AUTO_INCREMENT NOT NULL,
\t\`firstName\` VARCHAR(255) NOT NULL, 
\t\`lastName\` VARCHAR(255) NOT NULL, 
    \`personId\` INT NOT NULL,
\tCONSTRAINT \`FK_user_person\` FOREIGN KEY (\`personId\`) REFERENCES \`person\` (\`id\`),
\tPRIMARY KEY(\`id\`)    
); `)

        await queryRunner.query(`CREATE TABLE \`singleDay\` (
\t\`id\` INT NOT NULL AUTO_INCREMENT,
    \`opening1\` TIME ,
    \`closing1\` TIME,
    \`opening2\` TIME,
    \`closing2\` TIME,
    PRIMARY KEY(\`id\`)
);`)


        await queryRunner.query(`CREATE TABLE \`timetable\` (
\t\`id\` INT NOT NULL AUTO_INCREMENT,
\t\`monday\` INT,
    \`tuesday\` INT,
    \`wednesday\` INT,
    \`thursday\` INT,
    \`friday\` INT,
    \`saturday\` INT,
    \`sunday\` INT,
    CONSTRAINT \`FK_timetable_singleDay1\` FOREIGN KEY (\`monday\`) REFERENCES \`singleDay\`(\`id\`),
\tCONSTRAINT \`FK_timetable_singleDay2\` FOREIGN KEY (\`tuesday\`) REFERENCES \`singleDay\`(\`id\`),
    CONSTRAINT \`FK_timetable_singleDay3\` FOREIGN KEY (\`wednesday\`) REFERENCES \`singleDay\`(\`id\`),
    CONSTRAINT \`FK_timetable_singleDay4\` FOREIGN KEY (\`thursday\`) REFERENCES \`singleDay\`(\`id\`),
    CONSTRAINT \`FK_timetable_singleDay5\` FOREIGN KEY (\`friday\`) REFERENCES \`singleDay\`(\`id\`),
    CONSTRAINT \`FK_timetable_singleDay6\` FOREIGN KEY (\`saturday\`) REFERENCES \`singleDay\`(\`id\`),
    CONSTRAINT \`FK_timetable_singleDay7\` FOREIGN KEY (\`sunday\`) REFERENCES \`singleDay\`(\`id\`),
    PRIMARY KEY(\`id\`)
);`)

        await queryRunner.query(`CREATE TABLE \`restaurant\` ( 
\t\`id\` INT AUTO_INCREMENT NOT NULL,
\t\`name\` VARCHAR(255) NOT NULL UNIQUE, 
\t -- \`timetable\` JSON,
\t\`personId\` INT NOT NULL,
\t\`timetableId\` INT,
\tCONSTRAINT \`FK_restaurant_person\` FOREIGN KEY (\`personId\`) REFERENCES \`person\` (\`id\`),
\tCONSTRAINT \`FK_restaurant_timetable\` FOREIGN KEY (\`timetableId\`) REFERENCES \`timetable\`(\`id\`),
    PRIMARY KEY(\`id\`)
); `)

        await queryRunner.query(`CREATE TABLE \`rider\` (
\t\`id\` INT AUTO_INCREMENT NOT NULL,
\t\`personId\` INT NOT NULL,
\tCONSTRAINT \`FK_rider_person\` FOREIGN KEY (\`personId\`) REFERENCES \`person\` (\`id\`),
    PRIMARY KEY(\`id\`)
);`)
        await queryRunner.query(`CREATE TABLE \`item\` ( 
\t\`id\` INT NOT NULL AUTO_INCREMENT, 
\t\`name\` VARCHAR(255) NOT NULL, 
\t\`description\` VARCHAR(255) NOT NULL, 
\t\`preparationTimeMinutes\` INT NOT NULL, 
\t\`restaurantId\` INT NOT NULL, 
\t\`price\` DECIMAL(10, 2) NOT NULL, PRIMARY KEY (\`id\`), 
\tCONSTRAINT  \`FK_item_restaurant\` FOREIGN KEY (\`restaurantId\`) REFERENCES \`restaurant\` (\`id\`) 
);
`)
        await queryRunner.query(`CREATE TABLE \`order\` ( 
\t\`id\` INT NOT NULL AUTO_INCREMENT, 
    \`address\` VARCHAR(255) NOT NULL,
\t\`userEmail\`  VARCHAR(255) NOT NULL, 
\t\`riderEmail\` VARCHAR(255) NOT NULL, 
    PRIMARY KEY (\`id\`), 
\tCONSTRAINT \`FK_order_userEmail\` FOREIGN KEY (\`userEmail\`) REFERENCES \`person\` (\`email\`), 
\tCONSTRAINT \`FK_order_riderEmail\` FOREIGN KEY (\`riderEmail\`) REFERENCES \`person\` (\`email\`) 
);
`)
        await queryRunner.query(`CREATE TABLE \`itemOrder\` ( 
\t\`itemId\` INT NOT NULL, 
\t\`orderId\` INT NOT NULL, 
\tPRIMARY KEY (\`itemId\`, \`orderId\`), 
\tCONSTRAINT \`FK_itemOrder_itemId\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\` (\`id\`), 
\tCONSTRAINT \`FK_itemOrder_orderId\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\` (\`id\`) 
); 
`)
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
        `)
    }

}