import React from 'react'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import styles from '.././InfoAlert.module.css'

const RecycleAlert = () => {
    return (
        <>
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="info" >
                    <p className={styles.infoAlert}>
                        Σημείωση: Για κάθε δήμο αθροίζουμε τα κιλά ανακυκλώσιμων που αντιστοιχούν ανά κάτοικο, σε όλες τις διαθέσιμες μηνιαίες μετρήσεις του έτους.
                        <b>Η «Καλύτερη Περιοχή» είναι εκείνη με το μεγαλύτερο συνολικό kg/κάτοικο.</b>

                    </p>
                </Alert>
            </Stack>
        </>
    )
}

export default RecycleAlert