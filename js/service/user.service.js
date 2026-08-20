import { Generator } from "../utils/generator.js";
import { Validator } from "../utils/Validator.js";

export class UserService {    
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getAll() {
        return this.userRepository.getAll();
    }

    async getById(id) {
        if (!id) throw new Error('ID is required');
        const user = this.userRepository.getById(id);
        if (!user) throw new Error('User not found');
        return user;
    }

    async create(userDTO) {
        const user = Validator.user(userDTO);
        user.id = Generator.id();
        return this.userRepository.create(user);
    }

    async update(userId, user) {
        if (!userId) throw new Error('User ID is required');

        if (!this.userRepository.getById(userId)) {
            throw new Error('User not found');
        }
        
        Validator.user(user);
        return this.userRepository.update(userId, user);
    }

    async delete(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!this.userRepository.getById(userId)) {
            throw new Error('User not found');
        }
        return this.userRepository.delete(id);
    }

    async getByEmail(email) {
        if (!email) throw new Error('Email is required');

        const user = this.userRepository.getByEmail(email);
        if (!user) throw new Error('User not found');

        return user;
    }
}
