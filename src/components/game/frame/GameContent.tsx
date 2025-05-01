import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { InfoIcon, GamepadIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface Game {
    id: string;
    title: string;
    component: ReactNode;
    description?: string;
}

interface GameContentProps {
    games: Game[];
    currentGame: number;
}

const GameContent = ({ games, currentGame }: GameContentProps) => {
    const currentGameData = games[currentGame];
    const [view, setView] = useState<'game' | 'info'>('game');

    return (
        <div className="mx-auto w-full">
            <Card className="mx-auto w-full max-w-2xl">
                <CardHeader className="relative pb-2">
                    <div className="bg-muted text-muted-foreground mb-10 flex items-center justify-center rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView('game')}
                            className={cn(
                                'flex flex-1 gap-1 rounded-md px-3',
                                view === 'game' &&
                                    'bg-background text-foreground shadow-sm'
                            )}
                        >
                            <GamepadIcon className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">Play</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView('info')}
                            className={cn(
                                'flex flex-1 gap-1 rounded-md px-3',
                                view === 'info' &&
                                    'bg-background text-foreground shadow-sm'
                            )}
                        >
                            <InfoIcon className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">Info</span>
                        </Button>
                    </div>

                    <CardTitle className="text-center">
                        {currentGameData.title}
                    </CardTitle>
                    {view === 'info' && (
                        <CardDescription className="pt-2 text-center">
                            Learn about how to play this game
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="pt-4">
                    {view === 'game' ? (
                        <div className="animate-in fade-in-0 zoom-in-95 duration-300">
                            {currentGameData.component}
                        </div>
                    ) : (
                        <div className="animate-in fade-in-0 zoom-in-95 space-y-4 duration-300">
                            <p>
                                {currentGameData.description ||
                                    'No description available.'}
                            </p>
                            <div className="flex justify-center pt-2">
                                <Button
                                    onClick={() => setView('game')}
                                    className="flex gap-2"
                                >
                                    <GamepadIcon className="h-4 w-4" />
                                    Start Playing
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default GameContent;
