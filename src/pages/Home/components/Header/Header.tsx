import styles from './Header.module.scss';
import Dropdown from "../../../../components/Dropdown/Dropdown.tsx";
import { models } from "../../../../data/models.tsx";
import { useSidebar } from "../../../../store/sidebar.tsx";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import {Menu} from "lucide-react";
import {useSettingsStore} from "../../../../store/settingsStore.tsx";

const Header = () => {
    const { sidebarOpened, setSidebarOpened } = useSidebar();
    const { modelName, setModelName } = useSettingsStore();

    return (
        <header className={styles.header}>
            {!sidebarOpened && (
                <div>
                    <SvgButton onClick={() => setSidebarOpened(!sidebarOpened)}>
                        <Menu />
                    </SvgButton>
                </div>
            )}
            <Dropdown item={models.map((m) => m.name)} description={models.map((m) => m.description)} onSelect={(value => setModelName(value))} value={modelName} />
        </header>
    );
}

export default Header;