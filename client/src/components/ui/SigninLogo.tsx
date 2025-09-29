import { useTranslation } from 'react-i18next';

const SigninLogo: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-[#6795df] text-white p-4 md:pt-20 rounded-md flex gap-4 items-center">
            <img src="/imprffct.svg" alt="Logo Imprffct Games" draggable="false" className="w-16 h-auto" />
            <div className=" flex flex-col p-2 items-start justify-start">
                <h1 className="text-3xl">
                    <span className="error-underline neon-text">imprffct</span> games
                </h1>
                <a
                    href="https://adriananta.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex opacity-60 hover:opacity-75 transition-opacity ease-in-out duration-250"
                >
                    {t('globals.by')} Adrián Anta
                </a>
            </div>
        </div>
    );
};

export default SigninLogo;
