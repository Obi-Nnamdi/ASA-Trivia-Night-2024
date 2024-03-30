import { strict as assert } from 'assert';
import { TriviaGame } from '../TriviaGame';
import { TriviaGameStatus, AnswerResult, Question } from '../TriviaGameTypeDefs';

/**
 * Answer a game's question correctly.
 * @param game Game to answer question correctly for
 */
function answerGameQuestionCorrectly(game: TriviaGame): AnswerResult {
    const triviaQuestion = game.getCurrentQuestion()
    const givenAnswer = triviaQuestion.answer;
    return game.recordAnswer(triviaQuestion.id, givenAnswer);
}

/**
 * Answer a game's question incorrectly.
 * @param game Game to answer question incorrectly for
 */
function answerGameQuestionIncorrectly(game: TriviaGame): AnswerResult {
    const triviaQuestion = game.getCurrentQuestion()
    const givenAnswer = triviaQuestion.answer + "wrong";
    return game.recordAnswer(triviaQuestion.id, givenAnswer);
}

describe('TriviaGame', () => {
    let game: TriviaGame;
    let questions: Question[];

    beforeEach(() => {
        questions = [
            {
                category: 'Geography',
                questionText: 'What is the capital of France?',
                possibleAnswers: ['London', 'Paris', 'Rome', 'Madrid'],
                answer: 'Paris'
            },
            {
                category: 'History',
                questionText: 'Who was the first president of the United States?',
                possibleAnswers: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'],
                answer: 'George Washington'
            },
            {
                category: 'Geography',
                questionText: 'What is the largest ocean in the world?',
                possibleAnswers: ['Atlantic Ocean', 'Pacific Ocean', 'Indian Ocean', 'Arctic Ocean'],
                answer: 'Pacific Ocean'
            }
        ];

        game = new TriviaGame(['Player 1', 'Player 2'], questions);
    });

    describe('getCurrentQuestion', () => {
        it('should return a question from our defined questions', () => {
            const triviaQuestion = game.getCurrentQuestion();
            assert(questions.some(question => question.questionText === triviaQuestion.questionText))
            assert.strictEqual(triviaQuestion.id, questions.findIndex(question => question.questionText === triviaQuestion.questionText));
        });
    });

    describe('getGameState', () => {
        it('should return the game state', () => {
            const gameState = game.getGameState();
            assert.strictEqual(gameState.numPlayers, 2);
            assert.deepStrictEqual(new Set(gameState.questionCategories), new Set(['History', 'Geography']));
            assert.deepStrictEqual(gameState.playerStates, [
                {
                    name: 'Player 1',
                    questionsAnswered: 0,
                    numCorrectAnswers: 0,
                    completedCategories: []
                },
                {
                    name: 'Player 2',
                    questionsAnswered: 0,
                    numCorrectAnswers: 0,
                    completedCategories: []
                }
            ]);
            assert.strictEqual(gameState.gameStatus, TriviaGameStatus.IN_PROGRESS);
            assert.strictEqual(gameState.currentPlayerIndex, 0);
            assert.strictEqual(gameState.currentRound, 0);
        });
    });

    describe('recordAnswer', () => {
        it('should record an answer and update the game state for incorrect answers', () => {
            const triviaQuestion = game.getCurrentQuestion();
            const givenAnswer = "wronganswer"
            const answerResult = game.recordAnswer(triviaQuestion.id, givenAnswer);
            assert.strictEqual(answerResult.questionId, triviaQuestion.id);
            assert.strictEqual(answerResult.givenAnswer, givenAnswer);
            assert.strictEqual(answerResult.correctAnswer, triviaQuestion.answer);
            assert.strictEqual(answerResult.correct, false);
            assert.strictEqual(answerResult.correctAnswerIndex, triviaQuestion.possibleAnswers.indexOf(triviaQuestion.answer));

            const gameState = game.getGameState();
            assert.strictEqual(gameState.playerStates[0]?.questionsAnswered, 1);
            assert.strictEqual(gameState.playerStates[0]?.numCorrectAnswers, 0);
            assert.deepStrictEqual(gameState.playerStates[0].completedCategories, []);
        });

        it('should record an answer and update the game state for correct answers', () => {
            const triviaQuestion = game.getCurrentQuestion();
            const givenAnswer = triviaQuestion.answer;
            const answerResult = game.recordAnswer(triviaQuestion.id, givenAnswer);
            assert.strictEqual(answerResult.questionId, triviaQuestion.id);
            assert.strictEqual(answerResult.givenAnswer, givenAnswer);
            assert.strictEqual(answerResult.correctAnswer, triviaQuestion.answer);
            assert.strictEqual(answerResult.correct, true);
            assert.strictEqual(answerResult.correctAnswerIndex, triviaQuestion.possibleAnswers.indexOf(triviaQuestion.answer));

            const gameState = game.getGameState();
            assert.strictEqual(gameState.playerStates[0]?.questionsAnswered, 1);
            assert.strictEqual(gameState.playerStates[0]?.numCorrectAnswers, 1);
            assert.deepStrictEqual(gameState.playerStates[0]?.completedCategories, [triviaQuestion.category]);
        });

        it('should not update the game state if the question is not the current question', () => {
            const triviaQuestion = game.getCurrentQuestion();
            const wrongId = questions.findIndex(question => question.questionText !== triviaQuestion.questionText);
            const givenAnswer = 'wronganswer';
            const answerResult = game.recordAnswer(wrongId, givenAnswer);
            assert.strictEqual(answerResult.questionId, triviaQuestion.id);
            assert.strictEqual(answerResult.givenAnswer, givenAnswer);
            assert.strictEqual(answerResult.correctAnswer, triviaQuestion.answer);
            assert.strictEqual(answerResult.correct, false);

            const gameState = game.getGameState();
            assert.strictEqual(gameState.playerStates[0]?.questionsAnswered, 0);
            assert.strictEqual(gameState.playerStates[0]?.numCorrectAnswers, 0);
            assert.deepStrictEqual(gameState.playerStates[0]?.completedCategories, []);
        });

        it('should not update the game state if the question id is invalid', () => {
            assert.throws(() => game.recordAnswer(3, 'London'));
        });
    });

    describe('Inter-round functionality', () => {
        it('Should correctly move to the next round and update the game state', () => {
            // Answer a question correctly and incorrectly, and check the resulting game state
            answerGameQuestionCorrectly(game)
            answerGameQuestionIncorrectly(game)

            const gameState = game.getGameState()
            assert.strictEqual(gameState.currentRound, 1);
            assert.strictEqual(gameState.currentPlayerIndex, 0);
            assert.strictEqual(gameState.gameStatus, TriviaGameStatus.IN_PROGRESS);

            // Check first player's stats
            assert.strictEqual(gameState.playerStates[0]?.questionsAnswered, 1);
            assert.strictEqual(gameState.playerStates[0]?.numCorrectAnswers, 1);
            assert.strictEqual(gameState.playerStates[0]?.completedCategories.length, 1);

            // Check second player's stats
            assert.strictEqual(gameState.playerStates[1]?.questionsAnswered, 1);
            assert.strictEqual(gameState.playerStates[1]?.numCorrectAnswers, 0);
            assert.strictEqual(gameState.playerStates[1]?.completedCategories.length, 0);
        });
    });

    describe('Winning', () => {
        // TODO.
        it('Should correctly understand when the game is won and end the game.', () => {
            // Player 1 should answer correctly twice while player 2 answers correctly once, so player 1 wins.

            // P1
            answerGameQuestionCorrectly(game)
            // P2
            answerGameQuestionIncorrectly(game)
            // P1
            answerGameQuestionCorrectly(game)
            // P2
            answerGameQuestionCorrectly(game)

            // This should not do anything since the game should be finished by this point.
            answerGameQuestionCorrectly(game)

            const gameState = game.getGameState()
            assert.strictEqual(gameState.currentRound, 2);
            assert.strictEqual(gameState.currentPlayerIndex, 0);
            assert.strictEqual(gameState.gameStatus, TriviaGameStatus.FINISHED);
            assert.strictEqual(gameState.winner?.name, 'Player 1');


            // Check first player's stats
            assert.strictEqual(gameState.playerStates[0]?.questionsAnswered, 2);
            assert.strictEqual(gameState.playerStates[0]?.numCorrectAnswers, 2);
            assert.strictEqual(gameState.playerStates[0]?.completedCategories.length, 2);

            // Check second player's stats
            assert.strictEqual(gameState.playerStates[1]?.questionsAnswered, 2);
            assert.strictEqual(gameState.playerStates[1]?.numCorrectAnswers, 1);
            assert.strictEqual(gameState.playerStates[1]?.completedCategories.length, 1);
        });
    });

    describe('Sudden Death', () => {
        // TODO.
        it('Should correctly handle sudden death rules.', () => {
            // Both players should answer correctly twice so the game goes into sudden death.

            // 1st round (0)
            answerGameQuestionCorrectly(game)
            answerGameQuestionCorrectly(game)

            // 2nd round (1)
            answerGameQuestionCorrectly(game)
            answerGameQuestionCorrectly(game)

            // Sudden death rounds
            const firstGameState = game.getGameState()
            assert.strictEqual(firstGameState.currentRound, 2);
            assert.strictEqual(firstGameState.currentPlayerIndex, 0);
            assert.strictEqual(firstGameState.gameStatus, TriviaGameStatus.SUDDEN_DEATH);

            // Both players get a question right (2)
            answerGameQuestionCorrectly(game)
            answerGameQuestionCorrectly(game)

            const secondGameState = game.getGameState()
            assert.strictEqual(secondGameState.currentRound, 3);
            assert.strictEqual(secondGameState.currentPlayerIndex, 0);
            assert.strictEqual(secondGameState.gameStatus, TriviaGameStatus.SUDDEN_DEATH);

            // Both players get the question wrong (3)
            answerGameQuestionIncorrectly(game)
            answerGameQuestionIncorrectly(game)

            const thirdGameState = game.getGameState()
            assert.strictEqual(thirdGameState.currentRound, 4);
            assert.strictEqual(thirdGameState.currentPlayerIndex, 0);
            assert.strictEqual(thirdGameState.gameStatus, TriviaGameStatus.SUDDEN_DEATH);

            // Player two gets the question right and player one doesn't so player one wins (4).
            answerGameQuestionIncorrectly(game)
            answerGameQuestionCorrectly(game)

            const fourthGameState = game.getGameState()
            assert.strictEqual(fourthGameState.currentRound, 5);
            assert.strictEqual(fourthGameState.currentPlayerIndex, 0);
            assert.strictEqual(fourthGameState.gameStatus, TriviaGameStatus.FINISHED);
            assert.strictEqual(fourthGameState.winner?.name, 'Player 2');


            const finalGameState = game.getGameState()
            // Check first player's stats
            assert.strictEqual(finalGameState.playerStates[0]?.questionsAnswered, 5);
            assert.strictEqual(finalGameState.playerStates[0]?.numCorrectAnswers, 3);
            assert.strictEqual(finalGameState.playerStates[0]?.completedCategories.length, 2);

            // Check second player's stats
            assert.strictEqual(finalGameState.playerStates[1]?.questionsAnswered, 5);
            assert.strictEqual(finalGameState.playerStates[1]?.numCorrectAnswers, 4);
            assert.strictEqual(finalGameState.playerStates[1]?.completedCategories.length, 2);
        });
    });
});
