import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import styles from './InfoAlert.module.css'

export default function InfoAlert() {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity="info" >
        <p >
          Σημείωση: Oι ελλείπουσες μετρήσεις δεν συμπεριλαμβάνονται στον υπολογισμό του μέσου όρο.
          <b>O υπολογισμός βασίζεται μόνο στις διαθέσιμες πραγματικές τιμές.</b>

        </p>
      </Alert>
    </Stack>
  );
}
