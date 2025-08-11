import api from './api';
import type {ChoiceQuestion, CreateQuestionRequest} from '../types';

/**
 * Creates a new question for a given module.
 * @param moduleId - The ID of the module.
 * @param questionData - The data for the new question.
 * @returns The newly created question.
 */
export const createQuestion = async (
    moduleId: string,
    questionData: CreateQuestionRequest
): Promise<ChoiceQuestion> => {

 //   console.log(questionData);

    const {data} = await api.post(`/questions/${moduleId}`, questionData);
    return data;
};