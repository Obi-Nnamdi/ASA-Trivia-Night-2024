// Trivia Game Server Backend.
import express, { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes"
import path from 'path';
import winston from 'winston';
import chalk from 'chalk';
import { DateTime } from 'luxon';
import { generateUniqueId, standardFormatDate } from './helpers';
import { TriviaGame } from './TriviaGame';
import { TriviaGameQuestion, Question } from './TriviaGameTypeDefs';
import * as fs from 'node:fs/promises';
import expressAsyncHandler from 'express-async-handler';
import { checkGameStateResponse, createGameResponse, currentQuestionResponse, endGameResponse, gameExistsResponse, submitAnswerResponse } from './serverTypeDefs';

// ----- Server Setup ------
const app = express();

// Logging setup
const MiBSize = 1024 * 1024;
const maxFileSize = 50 * MiBSize; // 50 MiB
const maxLogFiles = 3; // 3 log files max are created when logging.
const loggingTransports: winston.transport[] = [
  new winston.transports.File({ filename: path.resolve('logs/error.log'), level: 'error', maxFiles: maxLogFiles, maxsize: maxFileSize }),
  new winston.transports.File({ filename: path.resolve('logs/combined.log'), maxFiles: maxLogFiles, maxsize: maxFileSize }),
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),
];

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.errors({ stack: true }), winston.format.timestamp(), winston.format.json()),
  transports: loggingTransports
})

// Middleware
app.use(express.json()); // parse request bodies as JSON
app.use(express.urlencoded({ extended: true })); // parse url-encoded content

app.use((req: Request, _: Response, next: NextFunction) => {
  const dateString = `[${standardFormatDate(DateTime.now())}]`

  let endpointStringColor;
  const requestMethod = req.method.toUpperCase();
  if (requestMethod === "GET") {
    endpointStringColor = chalk.green;
  }
  else if (requestMethod === "POST") {
    endpointStringColor = chalk.yellow;
  }
  else {
    endpointStringColor = chalk.blue;
  }
  const endpointString = endpointStringColor(`${req.method.toUpperCase()}: ${req.path}`);
  logger.info(`${dateString} ${endpointString}`);
  next();
})

// Server State Variables
const gameMap = new Map<string, TriviaGame>(); // Keeps track of the games we have running on the server.
const questionFile = "gameQuestions.json"; // File where game questions are stored.

// ------ Server Routes ------
const gameRouter = express.Router();
app.use('/game', gameRouter);

// ----- Game Routes -----

/* POST (teamNames) -> string.
 * Starts game with specified parameters: number of teams and team names.
 * Returns the id of the game that is being started.
 */
gameRouter.post('/createNew', expressAsyncHandler(async (req: Request, res: Response) => {
  // Get server parameters and enforce preconditions (no empty team names).
  const teamNames: string[] = req.body.teamNames;
  if (teamNames === undefined || teamNames.some(teamName => teamName === '')) {
    res.status(StatusCodes.BAD_REQUEST).send("Team names cannot be empty.");
    return;
  }

  // Get list of questions from file.
  // TODO: is it worth it to actually hold on to the raw text throughout the server's
  // life instead of rereading the file every time?
  const questionFileData = await fs.readFile(path.join(__dirname, questionFile));
  const questions: Question[] = JSON.parse(questionFileData.toString())
  // Create new game.
  const gameId = generateUniqueId();
  const game = new TriviaGame(teamNames, questions);
  gameMap.set(gameId, game);

  const serverResponse: createGameResponse = gameId;
  logger.info(`Game ${gameId} started with players "${teamNames.join(', ')}".`);
  res.status(StatusCodes.OK).send(serverResponse);
}))

/* GET (gameId) -> GameState.
* Returns the current state of the game with the specified id.
* Tells if the game is finished, and provides information about the teams' progress.
* If the game is finished, also gives information about the game’s winner.
*/
gameRouter.get('/:gameId/gameState', (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  if (gameId === undefined) {
    res.status(StatusCodes.BAD_REQUEST).send("Game id not specified.");
    return;
  }

  // Get the specified game.
  const game = gameMap.get(gameId);
  if (game === undefined) {
    res.status(StatusCodes.NOT_FOUND).send(`Game ${gameId} not found.`);
    return;
  }

  // Get game's state.
  logger.verbose(`Information retrieved for game ${gameId}.`);
  const gameState = game.getGameState();

  // Send response back.
  const serverResponse: checkGameStateResponse = gameState;
  res.status(StatusCodes.OK).send(serverResponse);
})


/* GET (gameId) -> UnansweredQuestion.
 * Returns the next question for the trivia game (and the team it’s associated with).
 * Until “submit answer” is called, it keeps returning the same question for the same team.
 * Tries to avoid reusing questions as much as possible, but if all questions have been used, will recycle questions.
 */
gameRouter.get('/:gameId/currentQuestion', (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  if (gameId === undefined) {
    res.status(StatusCodes.BAD_REQUEST).send("Game id not specified.");
    return;
  }

  // Get the specified game.
  const game = gameMap.get(gameId);
  if (game === undefined) {
    res.status(StatusCodes.NOT_FOUND).send(`Game ${gameId} not found.`);
    return;
  }

  // Return the game's current question (without its answer).
  logger.verbose(`Current question retrieved for game ${gameId}.`);
  const fullTriviaQuestion: TriviaGameQuestion = game.getCurrentQuestion();
  const { answer: _, ...rest } = fullTriviaQuestion
  const serverResponse: currentQuestionResponse = rest;
  res.status(StatusCodes.OK).send(serverResponse);
})

/* POST (gameId, questionId, answer) -> AnswerResult
 * Takes in a (text) answer input, and updates the game state internally
 * (moving to the next question for the next team or picking a winner).
 * Returns if the answer was correct, as well as the correct answer (as both text and a multiple choice array index).
 * 
 * NOTE: For a specific question, it should only affect the game state one time regardless of the number of api calls.
 * (To prevent bugs.)
 */
gameRouter.post('/:gameId/submitAnswer', (req: Request, res: Response) => {
  // Get parameters.
  const gameId = req.params.gameId;
  const questionId = req.body.questionId;
  const answer = req.body.answer;

  if (gameId === undefined || questionId === undefined || answer === undefined) {
    res.status(StatusCodes.BAD_REQUEST).send("Missing required parameters.");
    return;
  }

  // Get the specified game.
  const game = gameMap.get(gameId);
  if (game === undefined) {
    res.status(StatusCodes.NOT_FOUND).send(`Game ${gameId} not found.`);
    return;
  }

  // Submit the answer to the game and get its response.
  logger.verbose(`Answer submitted for game ${gameId}.`);
  const serverResponse: submitAnswerResponse = game.recordAnswer(questionId, answer);
  res.status(StatusCodes.OK).send(serverResponse);
})

/* POST (gameId) -> Boolean
 * Takes in a gameId and tries to end the game associated with it (i.e. remove it from the server.) (text) answer input, and updates the game state internally.
 * Returns true if the game existed and was properly ended, and false if otherwise.
 */
gameRouter.post('/:gameId/endGame', (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  if (gameId === undefined) {
    res.status(StatusCodes.BAD_REQUEST).send("Game id not specified.");
    return;
  }
  const deletionResult = gameMap.delete(gameId);
  if (deletionResult) {
    logger.verbose(`Game ${gameId} ended.`);
  }

  const serverResponse: endGameResponse = deletionResult;
  res.status(StatusCodes.OK).send(serverResponse);
})

/**
 * GET (gameId) -> Boolean
 * Takes in a gameId and returns a boolean corresponding to if it exists on the server.
 */
gameRouter.get('/:gameId/exists', (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  if (gameId === undefined) {
    res.status(StatusCodes.BAD_REQUEST).send("Game id not specified.");
    return;
  }
  const gameExists = gameMap.has(gameId);
  const serverResponse: gameExistsResponse = gameExists;
  res.status(StatusCodes.OK).send(serverResponse);
})


// Start Server.
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
