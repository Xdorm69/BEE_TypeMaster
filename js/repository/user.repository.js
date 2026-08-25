import { Store } from "../utils/store.js";

/*
    CURRENT MODEL
    [
        {
            avatarUrl:
            email:
            id:
            password: 
            username: 
        }    
    ]

    New model should be a map so that i can get userBy id in O(1) time;
    {
        "4oe80mkzf": {
            avatarUrl:
            email:
            id:
            password: 
            username: 
        }
    }
    
*/ 

export class UserRepository {
    constructor() {
        this.storageKey = 'users';
    }
    
    getAll() {
        return Store.get(this.storageKey, {});
    }

    getById(id) {
        const users = this.getAll();
        return users[id];
    }

    delete(id) {
        const users = this.getAll();
        delete users[id];
        Store.save(this.storageKey, users);
    }
    
    update(id, user) {
        const users = this.getAll();
        users[id] = user;
        Store.save(this.storageKey, users);
    }
    
    create(user) {
        const users = this.getAll();
        users[user.id] = user;
        Store.save(this.storageKey, users);
        return user;
    }
    
    getByEmail(email) {
        const users = this.getAll();
        return Object.values(users).find(user => user.email === email);
    }
    
    getByUsername(username) {
        const users = this.getAll();
        return Object.values(users).find(user => user.username === username);
    }
}
