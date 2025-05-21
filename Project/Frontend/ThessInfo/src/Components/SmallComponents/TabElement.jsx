import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Map from '../SmallComponents/map';
import styles from './TabElements.module.css';
import Board from '../SmallComponents/Board';

export default function TabElements({ onChangeView }) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (onChangeView) onChangeView(newValue);
    };

    return (
        <Box sx={{ width: '100%' }} classes={{ root: styles.container }}>
            {/* Tabs για εναλλαγή view */}
            <Tabs
                value={value}
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
                {value === 0 ? (
                    <Board /> // Πίνακας δεδομένων
                ) : (
                    <Map /> // Χάρτης
                )}
            </div>
        </Box>
    );
}