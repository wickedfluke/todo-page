import { UserExistsError } from "../../errors/user-exist";
import { UserIdentityModel } from "../../utils/auth/local/user-identity-model";
import { User } from "./user.entity";
import { UserModel } from "./user.model";
import * as bcrypt from 'bcrypt';

export class UserService {

    async add(user: User, credentials: { username: string, password: string }): Promise<User> {
        const existingIdentity = await UserIdentityModel.findOne({ 'credentials.username': credentials.username });
        if (existingIdentity) {
            throw new UserExistsError();
        }

        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        const newUser = await UserModel.create(user);
        await UserIdentityModel.create({
            provider: 'local',
            user: newUser.id,
            credentials: {
                username: credentials.username,
                hashedPassword
            }
        });

        return newUser;
    }
    async list(): Promise<User[]> {
        let query: any = {};
        return UserModel.find(query);
    }

    async getUserById(userId: string) {
        return UserModel.findById(userId);
    };
    

}
export default new UserService();