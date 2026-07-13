import { userRepository } from "../database/index.js";
import { hashPassword, comparePassword } from "./utils/password.js";
import { generateToken } from "./utils/jwt.js";

export class AuthService {
  async register(username: string, email: string, password: string) {
    const existingEmail = await userRepository.findByEmail(email);

    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const existingUsername = await userRepository.findByUsername(username);

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const validPassword = await comparePassword(
      password,
      user.password
    );

    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}

export const authService = new AuthService();