import flagUS from '../assets/flags/flag_us.png';
import flagRU from '../assets/flags/flag_ru.png';

type Language = {
    name: string;
    code: string;
    icon: string;
}

export const languages: Language[] = [
    { name: "English", code: "en", icon: flagUS},
    { name: "Русский", code: "ru", icon: flagRU},
];