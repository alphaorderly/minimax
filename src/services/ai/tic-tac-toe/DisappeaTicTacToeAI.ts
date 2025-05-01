import {
    GameState,
    TTTPlace,
    TTTPiece,
} from '@/types/game/disappear-tic-tac-toe';

// Type for representing a move in the game
type Move = {
    row: TTTPlace;
    col: TTTPlace;
    score: number;
};

export class DisappeaTicTacToeAI {
    /**
     * Find the best move for the AI player using minimax algorithm
     * @param gameState Current state of the game
     * @param difficulty AI difficulty level (0: Easy, 1: Medium, 2: Hard)
     * @param aiPlayer Whether AI is 'first' (X) or 'second' (O) player
     * @returns The best move coordinates {row, col}
     */
    findBestMove(
        gameState: GameState,
        difficulty: number = 2,
        aiPlayer: 'first' | 'second' = 'second'
    ): { row: TTTPlace; col: TTTPlace } {
        // For easy difficulty, make random moves sometimes
        if (difficulty === 0 && Math.random() < 0.7) {
            return this.getRandomMove(gameState);
        }

        // For medium difficulty, make random moves occasionally
        if (difficulty === 1 && Math.random() < 0.3) {
            return this.getRandomMove(gameState);
        }

        // Get all valid moves
        const validMoves = this.getValidMoves(gameState);

        // If no valid moves, return a random position (shouldn't happen in a real game)
        if (validMoves.length === 0) {
            return { row: 1, col: 1 };
        }

        // Calculate score for each valid move
        const scoredMoves: Move[] = validMoves.map((move) => {
            // Create a new game state with this move
            const newState = this.simulateMove(
                gameState,
                move.row,
                move.col,
                aiPlayer
            );

            // Get the score for this move using minimax
            const score = this.minimax(
                newState,
                // Limit depth based on difficulty
                difficulty === 0 ? 1 : difficulty === 1 ? 2 : 5,
                false,
                aiPlayer,
                -Infinity,
                Infinity
            );

            return { ...move, score };
        });

        // Sort moves by score (descending)
        scoredMoves.sort((a, b) => b.score - a.score);

        // Return the move with the highest score
        return scoredMoves[0];
    }

    /**
     * Get all valid moves in the current game state
     */
    private getValidMoves(
        gameState: GameState
    ): { row: TTTPlace; col: TTTPlace }[] {
        const validMoves: { row: TTTPlace; col: TTTPlace }[] = [];

        // Check each cell on the board
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                // Check if the cell is empty
                if (
                    !this.isOccupied(
                        gameState,
                        row as TTTPlace,
                        col as TTTPlace
                    )
                ) {
                    validMoves.push({
                        row: row as TTTPlace,
                        col: col as TTTPlace,
                    });
                }
            }
        }

        return validMoves;
    }

    /**
     * Check if a cell is occupied
     */
    private isOccupied(
        gameState: GameState,
        row: TTTPlace,
        col: TTTPlace
    ): boolean {
        return (
            gameState.firstPlayer.some((p) => p.row === row && p.col === col) ||
            gameState.secondPlayer.some((p) => p.row === row && p.col === col)
        );
    }

    /**
     * Get a random valid move
     */
    private getRandomMove(gameState: GameState): {
        row: TTTPlace;
        col: TTTPlace;
    } {
        const validMoves = this.getValidMoves(gameState);

        if (validMoves.length === 0) {
            return { row: 1, col: 1 }; // Default move if no valid moves (shouldn't happen)
        }

        const randomIndex = Math.floor(Math.random() * validMoves.length);
        return validMoves[randomIndex];
    }

    /**
     * Create a new game state by simulating a move
     */
    private simulateMove(
        gameState: GameState,
        row: TTTPlace,
        col: TTTPlace,
        player: 'first' | 'second'
    ): GameState {
        const newGameState = JSON.parse(JSON.stringify(gameState)) as GameState;

        // Add the piece based on the player
        const piece: TTTPiece = {
            row,
            col,
            player: player === 'first' ? 'X' : 'O',
        };

        if (player === 'first') {
            // Check if first player already has 3 pieces and needs to remove the oldest
            if (newGameState.firstPlayer.length === 3) {
                newGameState.firstPlayer = [
                    ...newGameState.firstPlayer.slice(1),
                    piece,
                ];
            } else {
                newGameState.firstPlayer = [...newGameState.firstPlayer, piece];
            }
            newGameState.turn = 'second';
        } else {
            // Check if second player already has 3 pieces and needs to remove the oldest
            if (newGameState.secondPlayer.length === 3) {
                newGameState.secondPlayer = [
                    ...newGameState.secondPlayer.slice(1),
                    piece,
                ];
            } else {
                newGameState.secondPlayer = [
                    ...newGameState.secondPlayer,
                    piece,
                ];
            }
            newGameState.turn = 'first';
        }

        return newGameState;
    }

    /**
     * Check if there is a winner in the current game state
     * Returns 'first', 'second' or null
     */
    private checkWinner(gameState: GameState): 'first' | 'second' | null {
        const firstPlayerPieces = gameState.firstPlayer.map(
            (p) => `${p.row},${p.col}`
        );
        const secondPlayerPieces = gameState.secondPlayer.map(
            (p) => `${p.row},${p.col}`
        );

        const winningCombinations: string[][] = [
            ['0,0', '0,1', '0,2'], // Rows
            ['1,0', '1,1', '1,2'],
            ['2,0', '2,1', '2,2'],
            ['0,0', '1,0', '2,0'], // Columns
            ['0,1', '1,1', '2,1'],
            ['0,2', '1,2', '2,2'],
            ['0,0', '1,1', '2,2'], // Diagonals
            ['0,2', '1,1', '2,0'],
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            const firstPlayerWins =
                firstPlayerPieces.includes(a) &&
                firstPlayerPieces.includes(b) &&
                firstPlayerPieces.includes(c);
            const secondPlayerWins =
                secondPlayerPieces.includes(a) &&
                secondPlayerPieces.includes(b) &&
                secondPlayerPieces.includes(c);

            if (firstPlayerWins) {
                return 'first';
            } else if (secondPlayerWins) {
                return 'second';
            }
        }

        return null;
    }

    /**
     * Evaluate the position for the AI player
     * This gives scores for partial lines and strategic positions
     */
    private evaluatePosition(
        gameState: GameState,
        aiPlayer: 'first' | 'second'
    ): number {
        const aiPieces =
            aiPlayer === 'first'
                ? gameState.firstPlayer
                : gameState.secondPlayer;
        const opponentPieces =
            aiPlayer === 'first'
                ? gameState.secondPlayer
                : gameState.firstPlayer;

        let score = 0;

        // Convert pieces to string format for easier checking
        const aiPiecesStr = aiPieces.map((p) => `${p.row},${p.col}`);
        const opponentPiecesStr = opponentPieces.map(
            (p) => `${p.row},${p.col}`
        );

        // Check for potential lines (2 in a row with 3rd position empty)
        const winningCombinations: string[][] = [
            ['0,0', '0,1', '0,2'],
            ['1,0', '1,1', '1,2'],
            ['2,0', '2,1', '2,2'], // Rows
            ['0,0', '1,0', '2,0'],
            ['0,1', '1,1', '2,1'],
            ['0,2', '1,2', '2,2'], // Columns
            ['0,0', '1,1', '2,2'],
            ['0,2', '1,1', '2,0'], // Diagonals
        ];

        for (const combination of winningCombinations) {
            const aiCount = combination.filter((pos) =>
                aiPiecesStr.includes(pos)
            ).length;
            const opponentCount = combination.filter((pos) =>
                opponentPiecesStr.includes(pos)
            ).length;

            // AI has 2 in a line with third position empty
            if (aiCount === 2 && opponentCount === 0) {
                score += 5;
            }

            // Opponent has 2 in a line with third position empty (block this)
            if (opponentCount === 2 && aiCount === 0) {
                score -= 5;
            }

            // AI has 1 in a line with other positions empty
            if (aiCount === 1 && opponentCount === 0) {
                score += 1;
            }
        }

        // Bonus for center position
        if (aiPiecesStr.includes('1,1')) {
            score += 3;
        }

        return score;
    }

    /**
     * Minimax algorithm with alpha-beta pruning
     * @param gameState Current game state
     * @param depth Maximum depth to search
     * @param isMaximizing Whether this is a maximizing or minimizing node
     * @param aiPlayer The AI player ('first' or 'second')
     * @param alpha Alpha value for pruning
     * @param beta Beta value for pruning
     * @returns The score for the best move
     */
    private minimax(
        gameState: GameState,
        depth: number,
        isMaximizing: boolean,
        aiPlayer: 'first' | 'second',
        alpha: number,
        beta: number
    ): number {
        // Check if there's a winner or we've reached max depth
        const winner = this.checkWinner(gameState);

        if (winner === aiPlayer) {
            return 10 + depth; // Add depth to prefer quicker wins
        }

        if (winner && winner !== aiPlayer) {
            return -10 - depth; // Subtract depth to prefer later losses
        }

        if (depth === 0) {
            return this.evaluatePosition(gameState, aiPlayer);
        }

        // Get current player
        const currentPlayer = isMaximizing
            ? aiPlayer
            : aiPlayer === 'first'
              ? 'second'
              : 'first';

        // Get valid moves
        const validMoves = this.getValidMoves(gameState);

        if (validMoves.length === 0) {
            return 0; // Draw
        }

        if (isMaximizing) {
            let maxScore = -Infinity;

            for (const move of validMoves) {
                const newState = this.simulateMove(
                    gameState,
                    move.row,
                    move.col,
                    currentPlayer
                );
                const score = this.minimax(
                    newState,
                    depth - 1,
                    false,
                    aiPlayer,
                    alpha,
                    beta
                );
                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);

                if (beta <= alpha) {
                    break; // Beta cutoff
                }
            }

            return maxScore;
        } else {
            let minScore = Infinity;

            for (const move of validMoves) {
                const newState = this.simulateMove(
                    gameState,
                    move.row,
                    move.col,
                    currentPlayer
                );
                const score = this.minimax(
                    newState,
                    depth - 1,
                    true,
                    aiPlayer,
                    alpha,
                    beta
                );
                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);

                if (beta <= alpha) {
                    break; // Alpha cutoff
                }
            }

            return minScore;
        }
    }
}
