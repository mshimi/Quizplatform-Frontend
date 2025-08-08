import type {ModuleSummary} from "./module.types.ts";
import type {Answer} from "./answer.type.ts";

export interface ChoiceQuestion {
    id: string;
    questionText: string;
    questionType: 'MULTI' | 'SINGLE';
    correctAnswerCount: number;
    incorrectAnswerCount: number;
    module: ModuleSummary;
    moduleId: string;
    answers: Answer[];
    changeRequestCounts: ChangeRequestCounts;
}

export interface ChangeRequestCounts {

    total: number;
    questionTextChange: number;
    answerChange: number;
    duplicationChange: number;
    deletionRequest: number;
}