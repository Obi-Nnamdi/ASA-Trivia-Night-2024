// File for defining data types and ADTs needed for the Trivia Game.
import { strict as assert } from 'assert';
import { arrayDifference, arrayIntersection, randomChoice } from './helpers';

/**
 * Class representing a single Trivia Game.
 * TODO: Add documentation for trivia game rules.
 */
export class TriviaGame {
    private readonly players: readonly Player[];
    private readonly questionList: readonly Question[];

    // Game state trackers
    private gameStatus: TriviaGameStatus;
    private currentQuestion: Question | undefined;
    private currentPlayerIndex: number;
    private currentRound: number;
    private winner: Player | undefined;
    private usedQuestions: Set<Question>;
    private playersAnsweringCorrectlyThisRound: Player[];

    // Trackers only used for sudden death
    private suddenDeathPlayers: Player[];

    /**
     * Create a new Trivia Game instance.
     * 
     * @param playerNames List of player names. Must have length greater than 0.
     * @param questionList List of questions to use in the player games. Must have length greater than 0. All questions must be valid.
     */
    constructor(playerNames: string[], questionList: Question[]) {
        // Enforce preconditions
        assert(playerNames.length > 0, "Number of players must be greater than 0.")
        assert(questionList.length > 0, "Question list length must be greater than 0.")
        assert(questionList.every(isValidQuestion))

        // Create list of players.
        this.players = playerNames.map(name => new Player(name));

        // Copy over list of questions.
        this.questionList = questionList.slice();

        // Initialize game state variables
        this.currentPlayerIndex = 0 // Set our current player index to be the first player
        this.currentRound = 0
        this.gameStatus = TriviaGameStatus.IN_PROGRESS
        this.usedQuestions = new Set()
        this.playersAnsweringCorrectlyThisRound = []
        this.suddenDeathPlayers = []

        // Queue up first question
        this.chooseNextQuestion()

        this.checkRep()
    }

    // ------- Helper methods for dealing with questions -------:

    /** 
     * Get the questions in questionList that aren't in usedQuestions.
     */
    private getAvailiableQuestions(): Question[] {
        return arrayDifference(this.questionList, Array.from(this.usedQuestions));
    }

    /**
     * Extract categories from questions.
     * 
     * @param questions Questions to extract categories from.
     * @returns a list of categories present in questions, such that each category has at least one question corresponding to it.
     */
    private extractCategoriesFromQuestions(questions: readonly Question[]): string[] {
        const categorySet = questions.reduce((categories: Set<string>, question: Question) => {
            categories.add(question.category)
            return categories
        }, new Set())

        return Array.from(categorySet)
    }

    /**
     * Get the question categories from the questions not in usedQuestions. 
     */
    private getAvailiableQuestionCategories(): string[] {
        return this.extractCategoriesFromQuestions(this.getAvailiableQuestions())
    }

    /** 
     * Get the question categories from questionList.
     */
    private getAllQuestionCategories(): string[] {
        return this.extractCategoriesFromQuestions(this.questionList);
    }

    /**`
     * Get questions by category.
     * 
     * @param category Category to get questions from
     * @param questions Questions to search.
     * @returns list of questions in `questions` with category matching `category`.
     */
    private getQuestionsByCategory(category: string, questions: readonly Question[]): Question[] {
        return questions.filter(question => question.category === category);
    }

    /**
     * Get the questions from questionList that belong to category `category`.
     */
    private getAllGameQuestionsByCategory(category: string): Question[] {
        return this.getQuestionsByCategory(category, this.questionList);
    }

    /**
     * Get the availiable questions that belong to category `category`.
     */
    private getAvailiableGameQuestionsByCategory(category: string): Question[] {
        return this.getQuestionsByCategory(category, this.getAvailiableQuestions())
    }

    // Methods for manipulating the `usedQuestions` set.

    /**
     * Clear the set of used questions.
     */
    private refreshAllQuestions() {
        this.usedQuestions.clear()
    }

    /**
     * Remove all questions of category `category` from usedQuestions.
     * 
     * @param category category of questions to refresh.
     */
    private refreshQuestionCategory(category: string) {
        const questionsToRemove = this.getAllGameQuestionsByCategory(category)
        questionsToRemove.forEach(question => this.usedQuestions.delete(question))
    }

    /**
     * Choose the next question for the trivia game.
     * 
     * @returns True if a new question was picked, and false otherwise.
     * Note: still returns true if the same question was picked again, as long as the question picking process happened again.
     */
    private chooseNextQuestion(): boolean {
        this.checkRep()
        // If the game has been won, don't do anything.
        if (this.gameStatus == TriviaGameStatus.FINISHED) {
            return false;
        }

        // Get the categories that the current player needs
        const currentPlayer = this.players[this.currentPlayerIndex] ?? assert.fail("Bad player index.")
        const categoriesNeeded = arrayDifference(this.getAllQuestionCategories(), currentPlayer.getCompletedCategories())

        // Assert two rules before picking questions:
        // 1) If the game is in progress, the current player should be missing at least one category.
        if (this.gameStatus === TriviaGameStatus.IN_PROGRESS) {
            assert(categoriesNeeded.length > 0, "If the game is in progress, the current player should be missing at least one category.")
        }

        // 2) If the game is in sudden death, we shouldn't be picking questions for players that don't have all categories.
        else if (this.gameStatus === TriviaGameStatus.SUDDEN_DEATH && categoriesNeeded.length != 0) {
            return false
        }

        // Get the categories availiable to us based on the unused questions we have.
        const availiableCategories = this.getAvailiableQuestionCategories()

        // Compute the intersection between the categories we have availiable and the categories we need.
        const availiableAndNeededCategories = arrayIntersection(categoriesNeeded, availiableCategories);

        // Based on the length of availiableAndNeededCategories, use different strategies for picking our next question.

        // First strategy: if we have at least one category that is availiable and needed, choose our question from those categories.
        if (availiableAndNeededCategories.length > 0) {
            // Choose category, then question.
            const questionCategory = randomChoice(availiableAndNeededCategories);
            this.currentQuestion = randomChoice(this.getAvailiableGameQuestionsByCategory(questionCategory));
        }

        // Second strategy: if we have no categories that are availiable and needed, do differnent things depending on the game state:
        else {
            // If not in sudden death: choose our question from the categories the player needs
            // If in sudden death: choose our question from all possible categories.
            const categoriesToPickFrom = this.gameStatus !== TriviaGameStatus.SUDDEN_DEATH ? categoriesNeeded : this.getAllQuestionCategories()
            const questionCategory = randomChoice(categoriesToPickFrom);

            // Choose a question from all questions in that category.
            // TODO: think of a 'smarter' way to reuse questions than just randomly picking again?
            this.currentQuestion = randomChoice(this.getAllGameQuestionsByCategory(questionCategory))
        }

        // Clean up: Make sure we refresh our questions if they've all been used.
        // TODO: Is this needed?
        if (this.questionList.every(question => this.usedQuestions.has(question))) {
            this.refreshAllQuestions()
        }

        this.checkRep() // Check our rep after mutation.
        return true // we've picked a new question.
    }

    /**
     * Enforce certain properties as the game state changes.
     */
    private checkRep() {
        // Make sure that the currentPlayerIndex is always between 0 and the number of players.
        assert(this.currentPlayerIndex >= 0 && this.currentPlayerIndex < this.players.length,
            `currentPlayerIndex(${this.currentPlayerIndex}) outside of acceptable bounds.`)

        // Make sure all players only have completed categories that are in the actual question categories
        const questionCategories = new Set(this.getAllQuestionCategories())
        this.players.forEach(player => {
            assert(player.getCompletedCategories().every(category => questionCategories.has(category)))
        })
    }

    /**
     * Returns the current question for the Trivia Game. Also gives the id of the question along with it.
     */
    public getCurrentQuestion(): TriviaGameQuestion {
        // TODO: Should this be returning the question along with the answer?
        this.checkRep()
        assert(this.currentQuestion !== undefined, "No availiable question.");

        const questionId = this.getCurrentQuestionId()
        assert(questionId !== -1, "Chosen question does not exist in questionList (somehow).")

        return { ...this.currentQuestion, id: questionId }
    }

    private getCurrentQuestionId() {
        assert(this.currentQuestion !== undefined, "No availiable question.");
        return this.questionList.indexOf(this.currentQuestion);
    }

    /**
     * Returns the TriviaGame's game state at the current moment in time.
     */
    public getGameState(): TriviaGameState {
        this.checkRep()
        // Return the game state from our internal variables.
        return {
            numPlayers: this.players.length,
            questionCategories: this.getAllQuestionCategories(),
            playerStates: this.players.map(player => player.getPlayerState()),
            gameStatus: this.gameStatus,
            currentPlayerIndex: this.currentPlayerIndex,
            currentRound: this.currentRound,
            winner: this.winner?.getPlayerState()
        }
    }

    private getCurrentPlayer(): Player {
        return this.players[this.currentPlayerIndex] ?? assert.fail("Bad current player index.")
    }

    /**
     * Records an answer based on the given question id and answer.
     * Doesn't do anything if the game is finished.
     * 
     * @param questionId id of the question the user is trying to answer. If not the current question,
     * the game is not updated and the questionId of the current question is given in the AnswerResult.
     * If the id doesn't map to a valid question at all, an error is raised.
     * @param answer string representing the user's answer to the question.
     */
    public recordAnswer(questionId: number, answer: string): AnswerResult {
        this.checkRep()

        // Get the question the user answered as well as the actual question
        const answeredQuestion = this.questionList[questionId] ?? assert.fail("Invalid question id.")
        const actualQuestion = this.currentQuestion ?? assert.fail("Current question does not exist.")

        // Determine if the question was answered correctly
        const playerAnsweredCorrectly = answer === actualQuestion.answer;

        // Update the game if the question answered is the one that the game is on and the game isn't finished.
        if (answeredQuestion === actualQuestion && !this.gameIsFinished()) {
            // Record the answer for the current player
            const currentPlayer = this.getCurrentPlayer()
            currentPlayer.answerQuestion(actualQuestion.category, playerAnsweredCorrectly)

            // Keep track of the player if they answered correctly.
            if (playerAnsweredCorrectly) {
                this.playersAnsweringCorrectlyThisRound.push(currentPlayer)
            }

            // Do a game state transition.
            this.takeGameStep()
        }
        this.checkRep()

        return {
            questionId: this.questionList.indexOf(actualQuestion),
            givenAnswer: answer,
            correctAnswer: actualQuestion.answer,
            correct: answer === actualQuestion.answer,
            correctAnswerIndex: actualQuestion.possibleAnswers.indexOf(actualQuestion.answer)
        }
    }

    /**
     * Increments the current player index (nmodulo number of players).
     * If we're at the end of numPlayers, set up the next round.
     */
    private goToNextPlayer() {
        // If we're in progress, increment the current index and go from there
        if (this.gameStatus === TriviaGameStatus.IN_PROGRESS) {
            this.currentPlayerIndex++;
            if (this.currentPlayerIndex === this.players.length) {
                this.currentPlayerIndex = 0
                this.setupNextRound();
            }
        }
        // If we're in sudden death, find the next sudden death player and go from there
        else if (this.gameStatus === TriviaGameStatus.SUDDEN_DEATH) {
            // Get current player and its index in the sudden death player list
            const currentPlayer = this.getCurrentPlayer()
            const suddenDeathPlayerIndex = this.suddenDeathPlayers.indexOf(currentPlayer)
            assert(suddenDeathPlayerIndex !== -1, "Current player should be in sudden death array during sudden death.")

            // Get next sudden death player
            let newSuddenDeathPlayerIndex = suddenDeathPlayerIndex + 1
            if (newSuddenDeathPlayerIndex === this.suddenDeathPlayers.length) {
                newSuddenDeathPlayerIndex = 0
                this.setupNextRound();
                // NOTE: setupNextRound() can mutate this object (i.e. change the sudden death players and change the game state to finished).
                // This shouldn't raise a problem if that happens, since there's always
                // at least one player in the sudden death array after sudden death starts.
            }

            // Turn sudden death player index to the actual player index
            const newSuddenDeathPlayer = this.suddenDeathPlayers[newSuddenDeathPlayerIndex] ?? assert.fail()
            this.currentPlayerIndex = this.players.indexOf(newSuddenDeathPlayer)
        }

    }

    private gameIsFinished(): boolean {
        return this.gameStatus === TriviaGameStatus.FINISHED
    }
    private gameInProgress(): boolean {
        return this.gameStatus === TriviaGameStatus.IN_PROGRESS
    }
    private gameInSuddenDeath(): boolean {
        return this.gameStatus === TriviaGameStatus.SUDDEN_DEATH
    }
    /**
     * Check if a player has finished the game.
     * 
     * @param player Player to check.
     * @returns True if the player has completed all question categories, and false if otherwise;.
     */
    private isPlayerFinished(player: Player): boolean {
        return this.getAllQuestionCategories().every(category => player.hasCompletedCategory(category))
    }

    /**
     * Evaluates the conditions of the game and transitions between rounds.
     * TODO: Include "mercy rule" that ends rounds early if a player mathmatically can't win by the end of the round?
     */
    private setupNextRound() {
        this.checkRep()

        // Don't do anything if the game is finished.
        if (this.gameIsFinished()) {
            return
        }

        // If we're in progress, check how many players have completed all the categories, and transition to a new state based on that
        if (this.gameInProgress()) {
            const finishedPlayers = this.players.filter(player => this.isPlayerFinished(player))
            const numFinishedPlayers = finishedPlayers.length

            if (numFinishedPlayers === 0) {
                // Don't do anything.
                // TODO: Should the index restting happen here or in gotToNextPlayer()>
            }

            else if (numFinishedPlayers === 1) {
                // If there's only one finished player at the end of the round, we have a winner!
                const finishedPlayer = finishedPlayers[0] ?? assert.fail();
                this.winner = finishedPlayer
                this.gameStatus = TriviaGameStatus.FINISHED
            }

            else {
                // If we have multiple finished players, enter sudden death with all the players who are finished.
                this.suddenDeathPlayers = finishedPlayers.slice()
                this.gameStatus = TriviaGameStatus.SUDDEN_DEATH
            }
        }
        // If the game is in sudden death, check the amount of players who have answered correctly this round and go from there.
        else if (this.gameInSuddenDeath()) {
            const numPlayersCorrect = this.playersAnsweringCorrectlyThisRound.length
            if (numPlayersCorrect === 0) {
                // Don't do anything.
            }
            else if (numPlayersCorrect === 1) {
                // We have a winner!
                const correctPlayer = this.playersAnsweringCorrectlyThisRound[0] ?? assert.fail()
                this.winner = correctPlayer
                this.gameStatus = TriviaGameStatus.FINISHED
            }

            else {
                // If we have multiple correct players, stay in sudden death with the players who were correct.
                this.suddenDeathPlayers = this.playersAnsweringCorrectlyThisRound.slice()
            }
        }
        else {
            throw Error("Unsupported Game State.")
        }

        // Increment the number of rounds, and clear the list of players who have answered correctly.
        this.currentRound++;
        this.playersAnsweringCorrectlyThisRound = [];
        this.checkRep()
    }

    /**
     * Handles transitions between entries in a game round.
     */
    private takeGameStep() {
        // If the game is finihsed, don't do anything.
        if (this.gameStatus === TriviaGameStatus.FINISHED) {
            return
        }
        // If the game is in progress or in sudden death, go to the next player and choose a new question.
        else {
            this.goToNextPlayer()
            this.chooseNextQuestion()
        }
    }
}

/**
 * Class representing a single TriviaGame Player.
 * 
 * This class stores a player's name and the categories they've completed.
 */
class Player {
    private readonly categoryCompletionMap: Map<string, boolean>;
    private numAnsweredQuestions: number;
    private correctlyAnsweredQuestions: number;
    constructor(public readonly name: string) {
        this.categoryCompletionMap = new Map();
        this.numAnsweredQuestions = 0;
        this.correctlyAnsweredQuestions = 0;
    }

    /**
     * Sets the completion status of the specified category to `true`.
     * 
     * @param categoryName category name.
     */
    private completeCategory(categoryName: string) {
        this.categoryCompletionMap.set(categoryName, true);
    }

    /**
     * Sets the completion status of the specified category to `false`.
     * 
     * @param categoryName category name.
     */
    private incompleteCategory(categoryName: string) {
        this.categoryCompletionMap.set(categoryName, false);
    }

    /**
     * Returns true if a player has completed a category, and false if they haven't.
     * @param categoryName question category.
     */
    public hasCompletedCategory(categoryName: string): boolean {
        return this.categoryCompletionMap.get(categoryName) ?? false
    }

    /**
     * Simulates a player answering a question of a specific category correct or not.
     * @param categoryName question category.
     * @param correct true if player answered the question correctly, false if not.
     */
    public answerQuestion(categoryName: string, correct: boolean) {
        // Increment the amount of questions we've answered
        this.numAnsweredQuestions++;

        // Mark the category as correct if we answered correct, but don't do anything if we're incorrect.
        if (correct) {
            this.correctlyAnsweredQuestions++;
            this.completeCategory(categoryName);
        }
    }

    /**
     * Returns all the categories a player has completed.
     */
    public getCompletedCategories(): string[] {
        // Use reduce to turn map into a list of completed categories
        return Array.from(this.categoryCompletionMap.entries()).reduce((prev: string[], value: [string, boolean]) => {
            const [category, completed] = value;
            // If the category has been completed, add our value to the array
            if (completed) {
                prev.push(category)
            }
            return prev
        }, [])
    }

    /**
     * Gets the PlayerState of a specified player.
     */
    public getPlayerState(): PlayerState {
        return {
            name: this.name,
            questionsAnswered: this.numAnsweredQuestions,
            numCorrectAnswers: this.correctlyAnsweredQuestions,
            completedCategories: this.getCompletedCategories()
        }
    }

}

/**
 * Type for a Question with a category and possible answers.
 */
export type Question = {
    category: string,
    questionText: string,
    possibleAnswers: string[],
    answer: string
}

/**
 * Check the validity of a question.
 * 
 * A valid question must have a non-empty question text and category,
 * At least one possible answer, and none of its possible answers must be empty.
 * Furthermore, the question's actual answer must appear in the list of possible answers.
 * 
 * @param question Question to validate
 * @returns true if the question is valid, and false if not.
 */
function isValidQuestion(question: Question) {
    // Non-empty category and answer
    if (question.category === "" || question.answer === "") {
        return false
    }

    // Valid possible answer list
    if (question.possibleAnswers.length === 0) {
        return false
    }
    if (question.possibleAnswers.some(possibleAnswer => possibleAnswer === "")) {
        return false
    }

    // Question's answer must appear in list of possible answers
    if (!question.possibleAnswers.includes(question.answer)) {
        return false
    }

    // All requirements are passed.
    return true
}

/**
 * Interface for a Trivia Game Question, which is a question with an added id for submitting answers.
 */
export type TriviaGameQuestion = Question & { id: number };

/**
 * Enum representing the status of a TriviaGame.
 */
export enum TriviaGameStatus {
    IN_PROGRESS,
    SUDDEN_DEATH,
    FINISHED,
}

/**
 * Type representing a TriviaGame's state.
 * Note that all of a player's completed categories are guaranteed to be a subset of `questionCategories`.
 */
export type TriviaGameState = {
    numPlayers: number,
    questionCategories: string[],
    playerStates: PlayerState[],
    gameStatus: TriviaGameStatus,
    currentPlayerIndex: number,
    currentRound: number,
    winner: PlayerState | undefined
}

/**
 * Type representing the state of a player in a TriviaGame.
 */
export type PlayerState = {
    name: string,
    questionsAnswered: number,
    numCorrectAnswers: number,
    completedCategories: string[],
}

/**
 * Type representing an answer attempt to a TriviaGame.
 */
export type AnswerAttempt = {
    questionId: number,
    answer: string
}

/**
 * Type representing an answer result after submitting an answer to a TriviaGame.
 * Gives information about the correct and given answer.
 */
export type AnswerResult = {
    questionId: number,
    givenAnswer: string,
    correctAnswer: string,
    correct: boolean
    correctAnswerIndex: number
}