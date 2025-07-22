export type Role = 'STUDENT' | 'ADMIN';

export interface User {
    // The backend DTO does not include an ID, so it's removed here.
    firstName: string;
    name: string; // Corresponds to lastname in the backend
    email: string;
    role: Role;
}