import React from 'react'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import styles from '.././InfoAlert.module.css'

const AirAlert = () => {
    return (
        <>
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="info" >
                    <p className={styles.infoAlert}>
                        Υπολογισμός: Υπολογίζουμε τον μηνιαίο μέσο όρο της συγκέντρωσης NO₂ για κάθε διαθέσιμη περιοχή και μετά παίρνουμε το ετήσιο μέσο όρο.
                        <b>Η «Καλύτερη Περιοχή Αέρα» είναι αυτή με τον χαμηλότερο μέσο όρο NO₂.</b>
                    </p>
                </Alert>
            </Stack>
        </>
    )
}

export default AirAlert