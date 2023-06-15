import { CreateUserDto } from "./user/dto/create-user.dto";
import { CreateRestaurantDto } from "./restaurant/dto/create-restaurant.dto";

export const users = [
    {
        firstName: "Mario",
        lastName: "Rossi",
        email: "mariorossi@libero.it",
        password: "mariorossi",
        address: "via roma 1",
        phone: "11111111"
    },
    {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "password1",
        address: "123 Main Street",
        phone: "1234567890"
    },
    {
        firstName: "Jane",
        lastName: "Smith",
        email: "janesmith@example.com",
        password: "password2",
        address: "456 Elm Street",
        phone: "9876543210"
    },
    {
        firstName: "Michael",
        lastName: "Johnson",
        email: "michaeljohnson@example.com",
        password: "password3",
        address: "789 Oak Street",
        phone: "5678901234"
    },
    {
        firstName: "Emily",
        lastName: "Davis",
        email: "emilydavis@example.com",
        password: "password4",
        address: "321 Pine Street",
        phone: "4321098765"
    }
];

export const restaurants = [
    {
        name: "Restaurant A",
        email: "restaurantA@example.com",
        password: "passwordA",
        address: "123 Main Street",
        phone: "1234567890"
    },
    {
        name: "Restaurant B",
        email: "restaurantB@example.com",
        password: "passwordB",
        address: "456 Elm Street",
        phone: "9876543210"
    },
    {
        name: "Restaurant C",
        email: "restaurantC@example.com",
        password: "passwordC",
        address: "789 Oak Street",
        phone: "5678901234"
    },
    {
        name: "Restaurant D",
        email: "restaurantD@example.com",
        password: "passwordD",
        address: "321 Pine Street",
        phone: "4321098765"
    },
    {
        name: "Restaurant E",
        email: "restaurantE@example.com",
        password: "passwordE",
        address: "654 Cedar Street",
        phone: "210987654305"
    }
];

export const items = [
    {
        name: "Item A",
        description: "Description A",
        price: 8.0,
        preparationTimeMinutes: 12
    },
    {
        name: "Item B",
        description: "Description B",
        price: 10.0,
        preparationTimeMinutes: 5
    },
    {
        name: "Item C",
        description: "Description C",
        price: 6.5,
        preparationTimeMinutes: 2
    },
    {
        name: "Item D",
        description: "Description D",
        price: 14.0,
        preparationTimeMinutes: 20
    },
    {
        name: "Item E",
        description: "Description E",
        price: 20.0,
        preparationTimeMinutes: 10
    }
];

export const riders = [
    {
        email: "rider1@example.com",
        password: "password1",
        phone: "+1234567890",
        workingSite: "Site 1"
    },
    {
        email: "rider2@example.com",
        password: "password2",
        phone: "+9876543210",
        workingSite: "Site 2"
    },
    {
        email: "rider3@example.com",
        password: "password3",
        phone: "+1112223333",
        workingSite: "Site 3"
    },
    {
        email: "rider4@example.com",
        password: "password4",
        phone: "+4445556666",
        workingSite: "Site 4"
    },
    {
        email: "rider5@example.com",
        password: "password5",
        phone: "+7778889999",
        workingSite: "Site 5"
    }
];

const specialUsers: CreateUserDto[] = [
    {
        firstName: "Andrew",
        lastName: "Tate",
        email: "andrew@tate.com",
        password: "Iamfinallyfree123!",
        phone: "3333333333",
        address: "Via G 42"
    },
    {
        firstName: "Matteo",
        lastName: "Falli",
        email: "matteo@falli.com",
        password: "Pitonearrabbiato0@",
        phone: "3333333333",
        address: "Via G 43"
    }
];

const specialRestaurant: CreateRestaurantDto[] = [
    {
        name: "La casa dei proci",
        email: "casa@proci.com",
        password: "Wlatopa!1!",
        phone: "3392361538",
        address: "via di itaca 91",
        timetable: {
            monday: {
                opening1: "12:00",
                closing1: "15:00",
                opening2: "19:00",
                closing2: "23:00"
            },
            tuesday: {
                opening1: "12:00",
                closing1: "15:00",
                opening2: "19:00",
                closing2: "23:00"
            },
            wednesday: {
                opening1: "12:00",
                closing1: "15:00",
                opening2: "19:00",
                closing2: "23:00"
            },
            thursday: {
                opening1: "12:00",
                closing1: "15:00",
                opening2: "19:00",
                closing2: "23:00"
            },
            friday: {
                opening1: "12:00",
                closing1: "15:00",
                opening2: "19:00",
                closing2: "23:00"
            },
            saturday: {
                opening1: "12:00",
                closing1: "15:00",
                opening2: "19:00",
                closing2: "23:00"
            },
            sunday: {
                opening1: "12:00",
                closing1: "15:00",
                opening2: "19:00",
                closing2: "23:00"
            },
        }
    }
];
