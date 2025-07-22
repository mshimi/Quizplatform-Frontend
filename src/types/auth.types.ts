// types/auth.types.ts

export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    name: string; // Corresponds to lastname
    email: string;
    password: string;
}

export interface AuthenticationResponse {
    // Matches the @JsonProperty("access_token") from the backend
    access_token: string;
}
