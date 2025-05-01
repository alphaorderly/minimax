export type TTTPlace = 0 | 1 | 2;

export type TTTPiece = {
    row: TTTPlace;
    col: TTTPlace;
    player: 'X' | 'O';
};

export type GameState = {
    firstPlayer: TTTPiece[];
    secondPlayer: TTTPiece[];
    turn: 'first' | 'second';
};

export type GameAction =
    | { type: 'ADD_FIRST_PLAYER'; payload: TTTPiece }
    | { type: 'ADD_SECOND_PLAYER'; payload: TTTPiece }
    | { type: 'RESET_GAME' };
