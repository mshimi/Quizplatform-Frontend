import api from "./api.ts";
import type {SessionStateDto, StartLiveSessionResponseDto, SubmitLiveAnswerDto} from "../types";


export const startLiveSession = async (lobbyId: string) => {
    const { data } = await api.post<StartLiveSessionResponseDto>(`/lobbies/${lobbyId}/start`);
    return data;
};

export const submitLiveAnswer = async (sessionId: string, body: SubmitLiveAnswerDto) => {
    await api.post<void>(`/sessions/${sessionId}/answers`, body);
};

export const getLiveSessionState = async (sessionId: string) => {
    const { data } = await api.get<SessionStateDto>(`/sessions/${sessionId}/state`);
    return data;
};
