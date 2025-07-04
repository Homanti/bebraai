import flagUS from '../assets/flags/flag_us.png';
import flagRU from '../assets/flags/flag_ru.png';
import flagES from '../assets/flags/flag_es.png';
import flagDE from '../assets/flags/flag_de.png';
import flagFR from '../assets/flags/flag_fr.png';
import flagUA from '../assets/flags/flag_ua.png';
import flagIT from '../assets/flags/flag_it.png';
import flagPT from '../assets/flags/flag_pt.png';
import flagJA from '../assets/flags/flag_ja.png';
import flagZH from '../assets/flags/flag_zh.png';
import flagKO from '../assets/flags/flag_ko.png';

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
    { name: "Italiano", code: "it", icon: flagIT },
    { name: "Português", code: "pt", icon: flagPT },
    { name: "Русский", code: "ru", icon: flagRU },
    { name: "Українська", code: "ua", icon: flagUA },
    { name: "日本語", code: "ja", icon: flagJA },
    { name: "中文", code: "zh", icon: flagZH },
    { name: "한국어", code: "ko", icon: flagKO },
];