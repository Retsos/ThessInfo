import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Map from '../SmallComponents/map';
import styles from './TabElements.module.css';
import Board from '../SmallComponents/Board';
import Alert from './InfoAlert';

export default function TabElements({
    initialView = 0,
    initialCategory = 'Water'
}) {
    const [view, setView] = React.useState(initialView);

    const handleChange = (_, newVal) => {
        setView(newVal);
    };

    return (
        <Box sx={{ width: '100%' }} classes={{ root: styles.container }}>
            {/* Tabs για εναλλαγή view */}
            <Tabs
                value={view}
                onChange={handleChange}
                centered
                classes={{
                    root: styles.tabsRoot,
                    indicator: styles.indicator,
                }}
            >
                <Tab
                    label="Πίνακας"
                    classes={{
                        root: styles.tabRoot,
                        selected: styles.tabSelected,
                    }}
                />
                <Tab
                    label="Χάρτης"
                    classes={{
                        root: styles.tabRoot,
                        selected: styles.tabSelected,
                    }}
                />
            </Tabs>

            {/* Conditional rendering based on tab */}
            <div className={styles.contentContainer}>
                <Alert />
                {view === 0 ? (
                    <>
                        <Board initialCategory={initialCategory} />
                    </>
                ) : (
                    <Map initialCategory={initialCategory} />
                )}
            </div>
        </Box>
    );
}