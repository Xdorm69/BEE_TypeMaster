import { User } from "../../model/user.model";
import { Validator } from "../validator";


const user = new User("John", "john@example.com", "Password12!", "avatar.png");
console.log("Test 1: good obj");
console.log(user);
try {
    Validator.user(user);
} catch (error) {
    console.log(error.message);
}

const user2 = new User("", "", "", "avatar.png");
console.log("Test 2: multiple missing");
console.log(user2);
try {
    Validator.user(user2);
} catch (error) {
    console.log(error.message);
}

const user3 = new User("u", "e@mail.com", "password", "avatar.png");
console.log("Test 3: bad password");
console.log(user3);
try {
    Validator.user(user3);
} catch (error) {
    console.log(error.message);
}