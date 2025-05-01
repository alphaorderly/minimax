import { TranslatedGameRoute } from '@/consts/game/game-route';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GamepadIcon, HelpCircle } from 'lucide-react';
import SEO from '@/components/ui/seo';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ComponentType } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type GameWrapperProps = {
    gameInfo: TranslatedGameRoute;
    component: ComponentType;
};

/**
 * GameWrapper component that provides consistent styling and displays
 * title and description for all game components with responsive design
 */
const GameWrapper = ({ gameInfo, component: Component }: GameWrapperProps) => {
    const isMobile = useIsMobile();

    return (
        <>
            <SEO
                title={gameInfo.title}
                description={gameInfo.description}
                keywords={['game', 'minimax', gameInfo.title.toLowerCase()]}
                ogTitle={`Play ${gameInfo.title} | MiniMax Games`}
                ogDescription={gameInfo.description}
            />
            <Card className="mx-auto w-full max-w-4xl shadow-lg">
                <CardHeader className="space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <GamepadIcon className="text-primary h-5 w-5" />
                            <CardTitle className="text-xl sm:text-2xl">
                                {gameInfo.title}
                            </CardTitle>
                        </div>

                        {isMobile ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <HelpCircle className="text-muted-foreground h-5 w-5 cursor-pointer" />
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {gameInfo.title}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {gameInfo.description}
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <CardDescription className="hidden max-w-md text-right text-sm sm:block">
                                {gameInfo.description}
                            </CardDescription>
                        )}
                    </div>

                    {!isMobile && (
                        <CardDescription className="block text-sm sm:hidden">
                            {gameInfo.description}
                        </CardDescription>
                    )}

                    <Separator />
                </CardHeader>

                <CardContent className="py-4">
                    <Component />{' '}
                </CardContent>
            </Card>
        </>
    );
};

export default GameWrapper;
