import { AnswerResult, TriviaGameQuestion, TriviaGameState } from './TriviaGameTypeDefs';

export type createGameResponse = string;
export type checkGameStateResponse = TriviaGameState;
export type currentQuestionResponse = Omit<TriviaGameQuestion, "answer">;
export type submitAnswerResponse = AnswerResult;
export type endGameResponse = boolean;
export type gameExistsResponse = boolean;