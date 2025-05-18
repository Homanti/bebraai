import flagUS from '../assets/flags/flag_us.png';
import flagRU from '../assets/flags/flag_ru.png';
import flagES from '../assets/flags/flag_es.png';
import flagDE from '../assets/flags/flag_de.png';
import flagFR from '../assets/flags/flag_fr.png';
import flagUA from '../assets/flags/flag_ua.png';

type Language = {
    name: string;
    code: string;
    icon: string;
}

export const languages: Language[] = [
    { name: "Deutsch", code: "de", icon: flagDE },
    { name: "English", code: "en", icon: flagUS },
    { name: "Español", code: "es", icon: flagES },
    { name: "Français", code: "fr", icon: flagFR },
    { name: "Русский", code: "ru", icon: flagRU },
    { name: "Українська", code: "ua", icon: flagUA },
];