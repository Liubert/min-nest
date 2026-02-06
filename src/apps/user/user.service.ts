import { Injectable } from "../../nest/decorators";

type User = {
  id: number;
  age: number;
  name: string;
  status: string;
  body?: any;
};

@Injectable()
export class UserService {
  createUser(user: User): User {
    const { id, age, name, status, body } = user;

    console.log("-- Service: running user service");
    return {
      id,
      age,
      name,
      status,
      body,
    };
  }
}
