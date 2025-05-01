import { useTranslation } from 'react-i18next';
import { Button } from './button';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ko' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-sm font-medium"
        >
            {i18n.language === 'en' ? '한국어' : 'English'}
        </Button>
    );
};

export default LanguageSwitcher;
