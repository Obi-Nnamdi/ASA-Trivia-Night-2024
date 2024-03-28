// Trivia Game Server Backend.
import express, { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes"
import path from 'path';
import winston from 'winston';
import chalk from 'chalk';
import { DateTime } from 'luxon';
import { standardFormatDate } from './helpers';

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

app.use((req: Request, res: Response, next: NextFunction) => {
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

// ------ Server Routes ------

/* POST (numPlayers, teamNames) -> number.
 * Starts game with specified parameters: number of teams and team names.
 * Returns the id of the game that is being started.
 */
app.post('/startGame', (req: Request, res: Response) => {
  // TODO.
  res.status(StatusCodes.OK).send();
})

/* GET (gameId) -> GameState.
* Returns the current state of the game with the specified id.
* Tells if the game is finished, and provides information about the teams' progress.
* If the game is finished, also gives information about the game’s winner.
*/
app.get('/checkGameState/:gameId', (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  // TODO.
  res.status(StatusCodes.OK).send(gameId);
})


/* GET (gameId) -> UnansweredQuestion.
 * Returns the next question for the trivia game (and the team it’s associated with).
 * Until “submit answer” is called, it keeps returning the same question for the same team.
 * Tries to avoid reusing questions as much as possible, but if all questions have been used, will recycle questions.
 * Gives an error if there are no questions to use.
 */
app.get('/nextQuestion', (req: Request, res: Response) => {
  // TODO.
  res.status(StatusCodes.OK).send();
})

/* POST (gameId, questionId, answer) -> AnswerResult
 * Takes in a (text) answer input, and updates the game state internally
 * (moving to the next question for the next team or picking a winner).
 * Returns if the answer was correct, as well as the correct answer (as both text and a multiple choice array index).
 * 
 * NOTE: For a specific question, it should only affect the game state one time regardless of the number of api calls.
 * (To prevent bugs.)
 */
app.post('submitAnswer', (req: Request, res: Response) => {
  // TODO.
  res.status(StatusCodes.OK).send();
})


// Start Server.

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
