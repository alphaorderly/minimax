import { atomWithStorage } from 'jotai/utils';
import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

const localStorage: SyncStorage<number> = {
    getItem(key, initialValue) {
        const value = window.localStorage.getItem(key);
        if (value === null) {
            return initialValue;
        }
        return JSON.parse(value);
    },
    setItem(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem(key) {
        window.localStorage.removeItem(key);
    },
};

const current_game = atomWithStorage<number>('current_game', 0, localStorage, {
    getOnInit: true,
});

export default current_game;
