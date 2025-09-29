import { Link } from 'react-router-dom';
import SocialLink from '@/components/ui/SocialLink';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './ui/LanguageSelector';

const Footer = () => {
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation();

    return (
        <footer className="md:w-full flex items-center justify-between text-[#f2f2f2] py-4 md:py-6 border-t border-[#f2f2f21a]">
            <div className="w-full flex flex-col md:flex-row-reverse md:justify-between md:items-center">
                <div className="flex gap-4 flex-wrap w-full md:justify-end">
                    <div className="">
                        <p className="text-xs opacity-50 tracking-wider mb-2 uppercase">{t('footer.main')}</p>
                        <div className="flex gap-4 md:gap-2">
                            <Link
                                to="/ranking"
                                className="capitalize w-full flex items-center justify-between gap-2 group md:px-3 md:py-1 rounded-lg md:bg-[#f2f2f20f] md:hover:bg-[#f2f2f233] md:border md:border-[#f2f2f20a] md:hover:border-[#f2f2f21a] md:backdrop-blur-md md:transition-all md:duration-400 ease-custom-ease-1"
                            >
                                {t('globals.ranking')}
                            </Link>
                            <Link
                                to="/terms"
                                className="capitalize w-full flex items-center justify-between gap-2 group md:px-3 md:py-1 rounded-lg md:bg-[#f2f2f20f] md:hover:bg-[#f2f2f233] md:border md:border-[#f2f2f20a] md:hover:border-[#f2f2f21a] md:backdrop-blur-md md:transition-all md:duration-400 ease-custom-ease-1"
                            >
                                {t('globals.terms')}
                            </Link>
                            {isAuthenticated ? (
                                <Link
                                    to="/profile"
                                    className="capitalize w-full flex items-center justify-between gap-2 group md:px-3 md:py-1 rounded-lg md:bg-[#f2f2f20f] md:hover:bg-[#f2f2f233] md:border md:border-[#f2f2f20a] md:hover:border-[#f2f2f21a] md:backdrop-blur-md md:transition-all md:duration-400 ease-custom-ease-1"
                                >
                                    {t('globals.profile')}
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="text-nowrap capitalize w-full flex items-center justify-between gap-2 group md:px-3 md:py-1 rounded-lg md:bg-[#f2f2f20f] md:hover:bg-[#f2f2f233] md:border md:border-[#f2f2f20a] md:hover:border-[#f2f2f21a] md:backdrop-blur-md md:transition-all md:duration-400 ease-custom-ease-1"
                                >
                                    {t('globals.login')}
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="">
                        <p className="text-xs opacity-50 tracking-wider mb-2 uppercase">{t('footer.contact')}</p>
                        <div className="flex gap-4 md:gap-2">
                            <SocialLink name="LinkedIn" link="https://www.linkedin.com/in/adrian-anta-gil/" />
                            <SocialLink name="GitHub" link="https://github.com/antaga04" />
                            <SocialLink name="Email" link="mailto:antaga04@gmail.com" />
                        </div>
                    </div>
                </div>
                <div className="logo flex items-center gap-4 w-full mt-4 md:m-0">
                    <div>
                        <p className="opacity-65 md:opacity-90">
                            {t('footer.author')}{' '}
                            <a
                                href="https://adriananta.dev/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="whitespace-nowrap devil-detail"
                            >
                                Adrián Anta.
                            </a>
                        </p>
                        <p className="opacity-65 text-sm hidden md:block">{t('footer.madewith')}</p>
                    </div>
                    <div className="w-fit">
                        <LanguageSelector />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
