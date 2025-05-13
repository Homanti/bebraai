import styles from './Header.module.scss';
import Dropdown from "../../../../components/Dropdown/Dropdown.tsx";
import { models } from "../../../../data/models.tsx";
import {getSettings, saveSettings} from "../../../../utils/settingsStorage.tsx";
import { useSidebar } from "../../../../store/sidebar.tsx";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import {Menu} from "lucide-react";

const Header = () => {
    const { sidebarOpened, setSidebarOpened } = useSidebar();

    const setModel = (value: string) => {
        const settings = getSettings();

        const updatedSettings = {
            ...settings,
            modelName: value,
        };

        saveSettings(updatedSettings);
    }

    return (
        <header className={styles.header}>
            {!sidebarOpened && (
                <div>
                    <SvgButton onClick={() => setSidebarOpened(!sidebarOpened)}>
                        <Menu />
                    </SvgButton>
                </div>
            )}
            <Dropdown onSelect={(value => setModel(value))} value={getSettings().modelName}>
                {models.map((m) => m.name)}
            </Dropdown>
        </header>
    );
}

export default Header;