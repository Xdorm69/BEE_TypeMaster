import { Store } from "../utils/store";


export class UserRepository {
    constructor() {
        this.storageKey = 'users';
    }
    
    getAll() {
        let users = Store.get(this.storageKey);
        users = users ? JSON.parse(users) : [];
        return users;
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
