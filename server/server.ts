// Trivia Game Server Backend.
import express, { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes"

const app = express();

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
  res.status(StatusCodes.OK).send();
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
