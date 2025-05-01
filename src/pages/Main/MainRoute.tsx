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
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { getTranslatedGames } from '@/consts/game/game-route';
import GameWrapper from '@/components/game/wrapper/GameWrapper';
import Landing from './Landing';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/ui/language-switcher';

const Root = () => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const { t } = useTranslation();
    const translatedGames = getTranslatedGames(t);

    const navigate = useNavigate();

    return (
        <div className="bg-background flex h-screen w-screen flex-col overflow-hidden">
            {/* Header with Navigation - enhanced for desktop */}
            <header className="bg-background flex h-16 items-center gap-4 border-b px-6">
                {/* Mobile Menu Trigger */}
                <div className="md:hidden">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                {' '}
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">
                                    {t('navigation.menu')}
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <SheetHeader
                                className="cursor-pointer border-b p-4"
                                onClick={() => navigate('/')}
                            >
                                {' '}
                                <SheetTitle className="flex items-center gap-2">
                                    <GamepadIcon className="h-5 w-5" />
                                    {t('common.appName')}
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex-1 overflow-auto py-2">
                                <div className="flex flex-col gap-1 px-2">
                                    {translatedGames.map(({ path, title }) => (
                                        <Button
                                            key={path}
                                            variant={'secondary'}
                                            className="h-10 justify-start gap-3"
                                            onClick={() => {
                                                navigate(path);
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
                            </div>{' '}
                            <div className="border-t p-4">
                                <p className="text-muted-foreground text-xs">
                                    {t('common.appName')} -{' '}
                                    {t('common.version')}
                                </p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                {/* Logo for all devices */}{' '}
                <div
                    className="flex cursor-pointer items-center gap-2"
                    onClick={() => navigate('/')}
                >
                    <GamepadIcon className="h-6 w-6" />
                    <h1 className="hidden text-lg font-semibold sm:inline-block">
                        {t('common.appName')}
                    </h1>{' '}
                </div>
                {/* Desktop Navigation */}
                <div className="hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                {' '}
                                <NavigationMenuTrigger>
                                    {t('navigation.games')}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="grid gap-3 p-4">
                                        {' '}
                                        <div className="grid gap-1">
                                            <h3 className="leading-none font-medium">
                                                {t('navigation.availableGames')}
                                            </h3>
                                            <p className="text-muted-foreground text-sm">
                                                {t('navigation.selectGame')}
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            {translatedGames.map(
                                                ({
                                                    path,
                                                    title,
                                                    description,
                                                }) => (
                                                    <Button
                                                        key={path}
                                                        variant="secondary"
                                                        className="h-auto w-[380px] justify-start gap-3 px-3 py-2 text-left"
                                                        onClick={() =>
                                                            navigate(path)
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
                {/* Language Switcher */}
                <div className="ml-auto">
                    <LanguageSwitcher />
                </div>
            </header>
            {/* Content Area */}
            <main className="flex flex-1 items-center justify-center overflow-auto p-4 md:p-6">
                <Routes>
                    <Route path="/" element={<Landing />} />{' '}
                    {translatedGames.map((gameInfo) => (
                        <Route
                            key={gameInfo.path}
                            path={gameInfo.path}
                            element={
                                <React.Suspense
                                    fallback={<div>Loading...</div>}
                                >
                                    <GameWrapper
                                        gameInfo={gameInfo}
                                        component={gameInfo.component}
                                    />
                                </React.Suspense>
                            }
                        />
                    ))}
                </Routes>
            </main>
            {/* Footer */}{' '}
            <footer className="text-muted-foreground border-t py-3 text-center text-sm">
                <div className="container">
                    <p>{t('footer.copyright')}</p>
                </div>
            </footer>
        </div>
    );
};

export default Root;
