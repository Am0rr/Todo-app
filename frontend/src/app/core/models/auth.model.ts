import { UserRole } from "./user.model";

export interface AuthResponse{
    accessToken: string;
    refreshToken: string;
    userId: string;
    username: string;
    role: UserRole;
}

export interface LoginRequest{
    email: string;
    password: string;
}