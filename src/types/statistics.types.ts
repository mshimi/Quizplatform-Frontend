// It's a good practice to have a dedicated file for these new types.

export interface OverallStats {
    averageScore: number;
    quizzesCompleted: number;
    totalQuestionsAnswered: number;
    correctAnswerRatio: number;
}

export interface ModuleStat {
    moduleId: string;
    moduleTitle: string;
    quizzesPlayed: number;
    averageScore: number;
    correctAnswers: number;
    totalAnswers: number;
}

export interface ActivityDataPoint {
    date: string;
    quizzes: number;
    avgScore: number;
}

export interface StatisticsData {
    overall: OverallStats;
    byModule: ModuleStat[];
    activity: ActivityDataPoint[];
}