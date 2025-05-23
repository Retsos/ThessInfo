import React from 'react'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import styles from '.././InfoAlert.module.css'

const WaterAlert = () => {
    return (
        <>
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="info" >
                    <p className={styles.infoAlert}>
                        Σημείωση: Για κάθε δήμο αθροίζουμε τη μηνιαία συμμόρφωση (ποσοστό συμμορφωμένων μετρήσεων) σε όλες τις διαθέσιμες μετρήσεις του έτους και υπολογίζουμε τον μέσο όρο.
                        <b>Η «Καλύτερη Περιοχή Νερού» είναι αυτή με το υψηλότερο ποσοστό συμμόρφωσης.</b>
                    </p>
                </Alert>
            </Stack>
        </>
    )
}

export default WaterAlert