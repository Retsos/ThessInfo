import React from 'react'
import { CircularProgress, Box } from '@mui/material';
import styles from './loadingcomp.module.css'


const loadingcomp = () => {
    return (
        <div>
            <Box
                className={styles.loaderWrapper}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="60vh"
            >
                <CircularProgress size={60} />
                <Box mt={2} color="#555">
                    Φόρτωση δεδομένων...
                </Box>
            </Box>


        </div>
    )
}

export default loadingcomp