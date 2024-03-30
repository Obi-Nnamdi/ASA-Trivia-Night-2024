
/**
 * Type for a Question with a category and possible answers.
 */

export type Question = {
    category: string;
    questionText: string;
    possibleAnswers: string[];
    answer: string;
};/**
 * Interface for a Trivia Game Question, which is a question with an added id for submitting answers.
 */

export type TriviaGameQuestion = Question & { id: number; assignedPlayer: PlayerState; };
/**
 * Enum representing the status of a TriviaGame.
 */

export enum TriviaGameStatus {
    IN_PROGRESS,
    SUDDEN_DEATH,
    FINISHED
}
/**
 * Type representing a TriviaGame's state.
 * Note that all of a player's completed categories are guaranteed to be a subset of `questionCategories`.
 */

export type TriviaGameState = {
    numPlayers: number;
    questionCategories: string[];
    playerStates: PlayerState[];
    gameStatus: TriviaGameStatus;
    currentPlayerIndex: number;
    currentRound: number;
    winner: PlayerState | undefined;
};
/**
 * Type representing the state of a player in a TriviaGame.
 */

export type PlayerState = {
    name: string;
    questionsAnswered: number;
    numCorrectAnswers: number;
    completedCategories: string[];
};
/**
 * Type representing an answer attempt to a TriviaGame.
 */

export type AnswerAttempt = {
    questionId: number;
    answer: string;
};
/**
 * Type representing an answer result after submitting an answer to a TriviaGame.
 * Gives information about the correct and given answer.
 */

export type AnswerResult = {
    questionId: number;
    givenAnswer: string;
    correctAnswer: string;
    correct: boolean;
    correctAnswerIndex: number;
};

