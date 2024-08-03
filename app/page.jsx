'use client';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config.js';
import PantryTracker from './components/PantryTracker.js';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { GlobalStyles } from '@mui/material'; // Import GlobalStyles

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userSession = sessionStorage.getItem('user');
      if (!user && !userSession) {
        router.push('/sign-up');
      }
    }
  }, [user, router]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <GlobalStyles
        styles={{
          '.custom-placeholder::placeholder': {
            color: 'white',
          },
        }}
      />
      <SpeedInsights />
      <main style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '24px', backgroundColor: 'black' }}>
        <div
          style={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'black',
            width: '100%',
            borderBottom: '2px solid darkred',
            position: 'fixed',
            top: 0,
            zIndex: 2,
            padding: '10px'
          }}
        >
          <h3 style={{ color: 'darkred'  }}>
            MyPantryApp
          </h3>
          <button
            onClick={() => {
              signOut(auth);
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('user');
              }
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: 'darkred',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex'
            }}
          >
            Log out
          </button>
        </div>
        <div style={{
          marginTop: '100px', // Adjusted to prevent overlap with fixed header
          position: 'relative',
          zIndex: 1,
        }}>
          <PantryTracker />
        </div>
      </main>
    </LocalizationProvider>
  );
}
