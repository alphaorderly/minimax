import {
    GameAction,
    GameState,
    TTTPlace,
} from '@/types/game/disappear-tic-tac-toe';
import { cn } from '@/utils/cn/cn';
import { useEffect, useReducer, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DisappeaTicTacToeAI } from '@/services/ai/tic-tac-toe/DisappeaTicTacToeAI';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'ADD_FIRST_PLAYER': {
            const isOccupied =
                state.firstPlayer.some(
                    (p) =>
                        p.row === action.payload.row &&
                        p.col === action.payload.col
                ) ||
                state.secondPlayer.some(
                    (p) =>
                        p.row === action.payload.row &&
                        p.col === action.payload.col
                );

            if (isOccupied) {
                return state;
            }

            if (state.firstPlayer.length === 3) {
                const newFirstPlayer = [
                    ...state.firstPlayer.slice(1),
                    action.payload,
                ];
                return {
                    ...state,
                    firstPlayer: newFirstPlayer,
                    turn: 'second',
                };
            } else {
                return {
                    ...state,
                    firstPlayer: [...state.firstPlayer, action.payload],
                    turn: 'second',
                };
            }
        }
        case 'ADD_SECOND_PLAYER': {
            const isOccupied =
                state.firstPlayer.some(
                    (p) =>
                        p.row === action.payload.row &&
                        p.col === action.payload.col
                ) ||
                state.secondPlayer.some(
                    (p) =>
                        p.row === action.payload.row &&
                        p.col === action.payload.col
                );

            if (isOccupied) {
                return state;
            }

            if (state.secondPlayer.length === 3) {
                const newSecondPlayer = [
                    ...state.secondPlayer.slice(1),
                    action.payload,
                ];
                return {
                    ...state,
                    secondPlayer: newSecondPlayer,
                    turn: 'first',
                };
            } else {
                return {
                    ...state,
                    secondPlayer: [...state.secondPlayer, action.payload],
                    turn: 'first',
                };
            }
        }
        case 'RESET_GAME': {
            return { firstPlayer: [], secondPlayer: [], turn: 'first' };
        }
        default: {
            return state;
        }
    }
};

const DisappearTicTacToe = () => {
    const { t } = useTranslation();

    const initialState: GameState = {
        firstPlayer: [],
        secondPlayer: [],
        turn: 'first',
    };
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const [isAI, setIsAI] = useState(false);
    const [playerFirst, setPlayerFirst] = useState(true);
    const [winner, setWinner] = useState<'first' | 'second' | null>(null);
    const [difficulty, setDifficulty] = useState(0); // AI 난이도 설정 (0: Easy, 1: Medium, 2: Hard)
    const ai = useState(() => new DisappeaTicTacToeAI())[0]; // Create a single instance of AI

    const checkEmpty = () => {
        return state.firstPlayer.length + state.secondPlayer.length === 0;
    };

    useEffect(() => {
        // If there's a winner, don't make an AI move
        if (winner) return;

        // If AI is enabled and it's AI's turn
        if (
            isAI &&
            ((playerFirst && state.turn === 'second') ||
                (!playerFirst && state.turn === 'first'))
        ) {
            // Short delay to make the AI move feel more natural
            const timer = setTimeout(() => {
                const aiPlayer = playerFirst ? 'second' : 'first';

                // Get the best move from the AI
                const bestMove = ai.findBestMove(state, difficulty, aiPlayer);

                // Make the move
                if (aiPlayer === 'first') {
                    dispatch({
                        type: 'ADD_FIRST_PLAYER',
                        payload: { ...bestMove, player: 'X' },
                    });
                } else {
                    dispatch({
                        type: 'ADD_SECOND_PLAYER',
                        payload: { ...bestMove, player: 'O' },
                    });
                }
            }, 500); // 500ms delay for a more natural feel

            return () => clearTimeout(timer);
        }

        // If AI is enabled and it's AI's turn
        if (
            isAI &&
            ((playerFirst && state.turn === 'second') ||
                (!playerFirst && state.turn === 'first'))
        ) {
            // Short delay to make the AI move feel more natural
            const timer = setTimeout(() => {
                const aiPlayer = playerFirst ? 'second' : 'first';

                // Get the best move from the AI
                const bestMove = ai.findBestMove(state, difficulty, aiPlayer);

                // Make the move
                if (aiPlayer === 'first') {
                    dispatch({
                        type: 'ADD_FIRST_PLAYER',
                        payload: { ...bestMove, player: 'X' },
                    });
                } else {
                    dispatch({
                        type: 'ADD_SECOND_PLAYER',
                        payload: { ...bestMove, player: 'O' },
                    });
                }
            }, 500); // 500ms delay for a more natural feel

            return () => clearTimeout(timer);
        }
    }, [isAI, state, state.turn, playerFirst, difficulty, winner, ai]);

    useEffect(() => {
        const checkWinner = () => {
            const firstPlayerPieces = state.firstPlayer.map(
                (p) => `${p.row},${p.col}`
            );
            const secondPlayerPieces = state.secondPlayer.map(
                (p) => `${p.row},${p.col}`
            );

            console.log('firstPlayerPieces', JSON.stringify(firstPlayerPieces));
            console.log(
                'secondPlayerPieces',
                JSON.stringify(secondPlayerPieces)
            );

            console.log(firstPlayerPieces.includes('0,0'));

            const winningCombinations: string[][] = [
                ['0,0', '0,1', '0,2'],
                ['1,0', '1,1', '1,2'],
                ['2,0', '2,1', '2,2'],
                ['0,0', '1,0', '2,0'],
                ['0,1', '1,1', '2,1'],
                ['0,2', '1,2', '2,2'],
                ['0,0', '1,1', '2,2'],
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
                    setWinner('first');
                    return;
                } else if (secondPlayerWins) {
                    setWinner('second');
                    return;
                }
            }
        };
        checkWinner();
    }, [state.turn, state.firstPlayer, state.secondPlayer]);

    const resetGame = () => {
        setWinner(null);
        dispatch({ type: 'RESET_GAME' });
    };

    const toggleAI = () => {
        resetGame();
        setIsAI(!isAI);
    };

    const togglePlayerFirst = () => {
        resetGame();
        setPlayerFirst(!playerFirst);
    };

    const handleCellClick = (row: TTTPlace, col: TTTPlace) => {
        if (winner) return;

        if (state.turn === 'first') {
            dispatch({
                type: 'ADD_FIRST_PLAYER',
                payload: { row, col, player: 'X' },
            });
        } else {
            dispatch({
                type: 'ADD_SECOND_PLAYER',
                payload: { row, col, player: 'O' },
            });
        }
    };

    const soonDisappear = (row: TTTPlace, col: TTTPlace) => {
        if (
            state.firstPlayer.length == 3 &&
            state.firstPlayer[0].row === row &&
            state.firstPlayer[0].col === col
        ) {
            return true;
        }

        if (
            state.secondPlayer.length == 3 &&
            state.secondPlayer[0].row === row &&
            state.secondPlayer[0].col === col
        ) {
            return true;
        }

        return false;
    };

    return (
        <div className="mx-auto w-full">
            <div className="space-y-4">
                <div className="mb-4 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="ai-toggle"
                            checked={isAI}
                            onCheckedChange={toggleAI}
                        />{' '}
                        <label
                            htmlFor="ai-toggle"
                            className="cursor-pointer text-sm font-medium"
                        >
                            {isAI
                                ? t('games.disappearTicTacToe.ai.on')
                                : t('games.disappearTicTacToe.ai.off')}
                        </label>
                    </div>

                    {isAI && (
                        <div className="flex flex-wrap items-center gap-2">
                            {' '}
                            <label
                                htmlFor="difficulty"
                                className="cursor-pointer text-sm font-medium"
                            >
                                {t('games.disappearTicTacToe.ai.difficulty')}
                            </label>
                            <Select
                                defaultValue={difficulty.toString()}
                                onValueChange={(value: string) => {
                                    setDifficulty(Number(value));
                                    resetGame();
                                }}
                            >
                                <SelectTrigger
                                    className="w-[100px]"
                                    aria-label="난이도 선택"
                                >
                                    {' '}
                                    <SelectValue>
                                        {difficulty === 0
                                            ? t(
                                                  'games.disappearTicTacToe.ai.easy'
                                              )
                                            : difficulty === 1
                                              ? t(
                                                    'games.disappearTicTacToe.ai.medium'
                                                )
                                              : t(
                                                    'games.disappearTicTacToe.ai.hard'
                                                )}
                                    </SelectValue>
                                </SelectTrigger>{' '}
                                <SelectContent>
                                    <SelectItem value="0">
                                        {t('games.disappearTicTacToe.ai.easy')}
                                    </SelectItem>
                                    <SelectItem value="1">
                                        {t(
                                            'games.disappearTicTacToe.ai.medium'
                                        )}
                                    </SelectItem>
                                    <SelectItem value="2">
                                        {t('games.disappearTicTacToe.ai.hard')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {isAI && (
                        <div className="mt-2 flex sm:mt-0">
                            <Button
                                onClick={
                                    playerFirst ? undefined : togglePlayerFirst
                                }
                                variant={playerFirst ? 'default' : 'outline'}
                                size="sm"
                                className={cn(
                                    'rounded-r-none',
                                    !playerFirst && 'border-r-0'
                                )}
                            >
                                {t('games.disappearTicTacToe.ai.playerFirst')}
                            </Button>
                            <Button
                                onClick={
                                    !playerFirst ? undefined : togglePlayerFirst
                                }
                                variant={!playerFirst ? 'default' : 'outline'}
                                size="sm"
                                className="rounded-l-none"
                            >
                                {t('games.disappearTicTacToe.ai.aiFirst')}
                            </Button>
                        </div>
                    )}
                </div>{' '}
                <div className="bg-accent/50 rounded-md px-4 py-2 text-center">
                    <h2 className="text-xl font-medium">
                        {state.turn === 'first'
                            ? t('games.disappearTicTacToe.status.xTurn')
                            : t('games.disappearTicTacToe.status.oTurn')}
                    </h2>
                </div>
                <div className="flex max-w-full flex-col items-center overflow-x-hidden">
                    <div className="mx-auto w-full max-w-[320px]">
                        {Array.from({ length: 3 }, (_, row) => (
                            <div
                                key={row}
                                className="flex items-center justify-center"
                            >
                                {Array.from({ length: 3 }, (_, col) => {
                                    const piece =
                                        state.firstPlayer.find(
                                            (p) =>
                                                p.row === row && p.col === col
                                        ) ||
                                        state.secondPlayer.find(
                                            (p) =>
                                                p.row === row && p.col === col
                                        );
                                    return (
                                        <div
                                            key={col}
                                            onClick={() =>
                                                handleCellClick(
                                                    row as TTTPlace,
                                                    col as TTTPlace
                                                )
                                            }
                                            className={cn(
                                                'max-size-24 min-size-12 flex size-[28vw] cursor-pointer items-center justify-center border-2 text-center text-lg font-bold transition-all sm:size-20 md:text-xl lg:size-24 lg:text-2xl',
                                                soonDisappear(
                                                    row as TTTPlace,
                                                    col as TTTPlace
                                                )
                                                    ? 'bg-muted text-muted-foreground'
                                                    : 'hover:bg-accent active:bg-accent/80',
                                                piece &&
                                                    piece.player === 'X' &&
                                                    'text-blue-600',
                                                piece &&
                                                    piece.player === 'O' &&
                                                    'text-red-600'
                                            )}
                                        >
                                            {piece ? piece.player : ''}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>{' '}
                {winner && (
                    <div className="bg-accent/50 rounded-md px-4 py-2 text-center">
                        <h2 className="text-xl font-medium">
                            {winner === 'first'
                                ? t('games.disappearTicTacToe.status.xWins')
                                : t('games.disappearTicTacToe.status.oWins')}
                        </h2>
                    </div>
                )}
                {checkEmpty() || (
                    <div className="mt-4 flex justify-center">
                        {' '}
                        <Button
                            onClick={resetGame}
                            variant="outline"
                            className="w-full"
                        >
                            {t('common.resetGame')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisappearTicTacToe;
