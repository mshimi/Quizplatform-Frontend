// service/quizService.ts
import api from './api';
import type {Page, QuizDetail, QuizResult, QuizStatus, QuizSummary, SubmitAnswerRequest} from '../types';

/**
 * Fetches a paginated history of the current user's quiz attempts.
 * @param page - The page number to fetch.
 * @param size - The number of items per page.
 */
export const getQuizHistory = async (page = 0, size = 8, status: QuizStatus | null = null): Promise<Page<QuizSummary>> => {
    const {data} = await api.get('/quizzes', {
        params: {
            pageNumber: page,
            pageSize: size,
            ...(status && {status}),
        },
    });
    return data;
};


/**
 * Sends a request to the backend to create and start a new quiz for a module.
 * @param moduleId - The ID of the module for which to start the quiz.
 * @returns The detailed quiz object with questions and shuffled answers.
 */
export const startQuiz = async (moduleId: string): Promise<QuizDetail> => {
    const { data } = await api.post<QuizDetail>(`/quizzes/start/${moduleId}`);
    return data;
};


/**
 * Fetches the full details of a specific quiz by its ID.
 * The backend will return a different structure based on the quiz status.
 * @param quizId - The ID of the quiz to fetch.
 * @returns A promise that resolves to the quiz data (either QuizDetail or QuizResult).
 */
export const getQuizDetails = async (quizId: string): Promise<QuizDetail | QuizResult> => {
    const { data } = await api.get(`/quizzes/${quizId}`);
    return data;
};

/**
 * Submits a user's selected answer for a question to the backend.
 * This is a "fire-and-forget" call that does not return any data.
 * @param quizId - The ID of the current quiz.
 * @param questionId - The ID of the question being answered.
 * @param selectedAnswerId - The ID of the answer the user selected.
 */
export const submitAnswer = async (
    quizId: string,
    questionId: string,
    selectedAnswerId: string
): Promise<void> => {
    const payload: SubmitAnswerRequest = { questionId, selectedAnswerId };
    await api.post(`/quizzes/${quizId}/submit-answer`, payload);
};


export const finishQuiz = async (quizId: string): Promise<void> => {
    await api.post(`/quizzes/${quizId}/finish`);
};