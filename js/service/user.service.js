import { User, UserDTO } from "../model/user.model";
import { Generator } from "../utils/generator";
import { Validator } from "../utils/validator";

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
        if (!userDTO) throw new Error('User data is required');
        if (!(userDTO instanceof UserDTO)) throw new Error('User data must be an instance of UserDTO');

        const user = Validator.user(userDTO);
        user.id = Generator.id();

        return this.userRepository.create(user);
    }

    async update(id, user) {
        if (!id) {
            throw new Error('ID is required');
        }
        if (!this.userRepository.getById(id)) {
            throw new Error('User not found');
        }
        if (!user) throw new Error('User data is required');
        if (!(user instanceof User)) throw new Error('User data must be an instance of User');

        Validator.user(user);
        return this.userRepository.update(id, user);
    }

    async delete(id) {
        if (!id) {
            throw new Error('ID is required');
        }
        if (!this.userRepository.getById(id)) {
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
