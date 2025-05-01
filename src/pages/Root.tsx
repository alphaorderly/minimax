// filepath: g:\Created\MiniMax\src\pages\Root.tsx
import DisappearTicTacToe from '@/components/game/tic-tac-toe/DisappearTicTacToe';
import GameContent from '@/components/game/frame/GameContent';
import current_game from '@/stores/atoms/current_game';
import { useAtom } from 'jotai/react';
import { Button } from '@/components/ui/button';
import { GamepadIcon, Menu } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useState } from 'react';

const games = [
    {
        id: 'disappear-tic-tac-toe',
        title: 'Disappear Tic Tac Toe',
        component: <DisappearTicTacToe />,
        description:
            'A strategic variant of Tic-Tac-Toe where each player can only have 3 pieces on the board. When you place your 4th piece, the oldest piece disappears.',
    },
];

const Root = () => {
    const [currentGame, setCurrentGame] = useAtom(current_game);
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <div className="bg-background flex h-screen w-screen flex-col overflow-hidden">
            {/* Header with Navigation - enhanced for desktop */}
            <header className="bg-background flex h-16 items-center gap-4 border-b px-6">
                {/* Mobile Menu Trigger */}
                <div className="md:hidden">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <SheetHeader className="border-b p-4">
                                <SheetTitle className="flex items-center gap-2">
                                    <GamepadIcon className="h-5 w-5" />
                                    MiniMax Games
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex-1 overflow-auto py-2">
                                <div className="flex flex-col gap-1 px-2">
                                    {games.map(({ id, title }, index) => (
                                        <Button
                                            key={id}
                                            variant={
                                                currentGame === index
                                                    ? 'secondary'
                                                    : 'ghost'
                                            }
                                            className="h-10 justify-start gap-3"
                                            onClick={() => {
                                                setCurrentGame(index);
                                                setSheetOpen(false);
                                            }}
                                        >
                                            <GamepadIcon className="h-4 w-4" />
                                            <span className="capitalize">
                                                {title}
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t p-4">
                                <p className="text-muted-foreground text-xs">
                                    MiniMax Games - v1.0.0
                                </p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo for all devices */}
                <div className="flex items-center gap-2">
                    <GamepadIcon className="h-6 w-6" />
                    <h1 className="hidden text-lg font-semibold sm:inline-block">
                        MiniMax Games
                    </h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    Games
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="grid w-[400px] gap-3 p-4">
                                        <div className="grid gap-1">
                                            <h3 className="leading-none font-medium">
                                                Available Games
                                            </h3>
                                            <p className="text-muted-foreground text-sm">
                                                Select a game to play
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            {games.map(
                                                (
                                                    { id, title, description },
                                                    index
                                                ) => (
                                                    <Button
                                                        key={id}
                                                        variant={
                                                            currentGame ===
                                                            index
                                                                ? 'secondary'
                                                                : 'ghost'
                                                        }
                                                        className="h-auto w-[380px] justify-start gap-3 px-3 py-2 text-left"
                                                        onClick={() =>
                                                            setCurrentGame(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <GamepadIcon className="h-4 w-4" />
                                                                <span className="font-medium">
                                                                    {title}
                                                                </span>
                                                            </div>
                                                            <p className="text-muted-foreground mt-1 text-xs break-keep whitespace-normal">
                                                                {description}
                                                            </p>
                                                        </div>
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex flex-1 items-center justify-center overflow-auto p-4 md:p-6">
                <GameContent games={games} currentGame={currentGame} />
            </main>

            {/* Footer */}
            <footer className="text-muted-foreground border-t py-3 text-center text-sm">
                <div className="container">
                    <p>MiniMax Games - More Minigames Coming Soon!</p>
                </div>
            </footer>
        </div>
    );
};

export default Root;
