import { useNavigate } from 'react-router';
import { GamepadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslatedGames } from '@/consts/game/game-route';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/ui/seo';

const Landing = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const translatedGames = getTranslatedGames(t);

    return (
        <>
            <SEO
                title={t('landing.title') || 'MiniMax Games'}
                description={
                    t('landing.subtitle') ||
                    'Play a variety of mini-games including Tic-Tac-Toe and more'
                }
                keywords={[
                    'games',
                    'mini-games',
                    'tic-tac-toe',
                    'puzzle',
                    'brain games',
                ]}
            />
            <div className="flex w-full max-w-6xl flex-col items-center gap-8 py-8">
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center">
                    {' '}
                    <div className="mb-2 flex items-center gap-3">
                        <GamepadIcon className="text-primary h-8 w-8" />
                        <h1 className="text-4xl font-bold">
                            {t('landing.title')}
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        {t('landing.subtitle')}
                    </p>
                </div>
                {/* Games Grid */}
                <div className="w-full">
                    <h2 className="mb-6 text-center text-2xl font-bold">
                        {t('landing.ourGames')}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {translatedGames.map((game) => (
                            <Card
                                key={game.path}
                                className="hover:border-primary/60 flex h-full cursor-pointer flex-col transition-all hover:shadow-lg"
                                onClick={() => navigate(game.path)}
                            >
                                <CardContent className="flex flex-1 flex-col justify-between p-6">
                                    <div>
                                        <div className="mb-3 flex items-center gap-2">
                                            <GamepadIcon className="text-primary h-5 w-5" />
                                            <h3 className="font-semibold">
                                                {game.title}
                                            </h3>
                                        </div>
                                        <p className="text-muted-foreground text-sm">
                                            {game.description}
                                        </p>
                                    </div>{' '}
                                    <Button
                                        className="mt-4 w-full"
                                        variant="outline"
                                    >
                                        {t('common.playGame')}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>{' '}
            </div>
        </>
    );
};

export default Landing;
