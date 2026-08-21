import { Store } from "../utils/store.js";


export class UserRepository {
    constructor() {
        this.storageKey = 'users';
    }
    
    getAll() {
        return Store.get(this.storageKey, []);
    }

    getById(id) {
        const users = this.getAll();
        return users.find(user => user.id === id)
    }

    delete(id) {
        const users = this.getAll();
        const updatedUsers = users.filter(user => user.id !== id);
        Store.save(this.storageKey, updatedUsers);
    }
    
    update(id, user) {
        const users = this.getAll();
        const updatedUsers = users.map(u => u.id === id ? user : u);
        Store.save(this.storageKey, updatedUsers);
    }
    
    create(user) {
        const users = this.getAll();
        users.push(user);
        Store.save(this.storageKey, users);
        return user;
    }
    
    getByEmail(email) {
        const users = this.getAll();
        return users.find(user => user.email === email);
    }
}
