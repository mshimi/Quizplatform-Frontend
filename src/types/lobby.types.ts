import type { User } from './user.types';
import type { ModuleSummary } from './module.types';

export type QuizLobbyStatus = 'WAITING' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED';

export interface QuizLobby {
    id: string;
    host: User;
    module: ModuleSummary;
    participants: User[];
    status: QuizLobbyStatus;
    createdAt: string; // ISO date string
}