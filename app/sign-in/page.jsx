'use client';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config.js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';  // Import Link for navigation

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      padding: '0 16px', // Add some padding for smaller screens
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px', // Adjust the max width
        width: '100%', // Make it full width within max-width
        boxSizing: 'border-box',
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: '24px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: 'calc(16px + 2vw)', // Responsive font size
        }}>Log In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#333',
            borderRadius: '4px',
            border: 'none',
            color: '#fff',
            fontSize: '16px',
            boxSizing: 'border-box',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#333',
            borderRadius: '4px',
            border: 'none',
            color: '#fff',
            fontSize: '16px',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleSignIn}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'darkred',
            borderRadius: '4px',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s',
            boxSizing: 'border-box',
          }}
        >
          Log In
        </button>
       
        <div style={{
          marginTop: '16px',
          textAlign: 'center',
        }}>
          <p style={{
            color: '#fff',
            margin: 0,
            fontSize: '16px',
          }}>
            Not a member?{' '}
            <Link href="/sign-up" style={{
              color: 'darkred',
              textDecoration: 'underline',
            }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
