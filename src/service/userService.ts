import type {UpdateProfileRequest, User} from "../types";
import api from "./api.ts";

export const updateProfile = async (profileData: UpdateProfileRequest): Promise<User> => {
    // This matches the PUT endpoint you created on the backend
    const { data } = await api.put<User>('/user/profile', profileData);
    return data;
};