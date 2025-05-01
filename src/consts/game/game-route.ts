import React from 'react';
import { TFunction } from 'i18next';

export type GameRoute = {
    path: string;
    titleKey: string;
    descriptionKey: string;
    translationKey: string;
    component: React.LazyExoticComponent<React.FC>;
};

export type TranslatedGameRoute = {
    path: string;
    title: string;
    description: string;
    translationKey: string;
    component: React.LazyExoticComponent<React.FC>;
};

export const games: GameRoute[] = [
    {
        path: '/game/disappear-tic-tac-toe',
        titleKey: 'games.disappearTicTacToe.title',
        descriptionKey: 'games.disappearTicTacToe.description',
        translationKey: 'games.disappearTicTacToe',
        component: React.lazy(
            () => import('@/components/game/tic-tac-toe/DisappearTicTacToe')
        ),
    },
];

export const getTranslatedGames = (t: TFunction): TranslatedGameRoute[] => {
    return games.map((game) => ({
        path: game.path,
        title: t(game.titleKey),
        description: t(game.descriptionKey),
        translationKey: game.translationKey,
        component: game.component,
    }));
};
