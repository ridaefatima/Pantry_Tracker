'use client';
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config.js';
import Link from 'next/link';  // Import Link for navigation

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const [successMessage, setSuccessMessage] = useState(''); // Add state for success message
  const [validationError, setValidationError] = useState(''); // Add state for validation error

  const handleSignUp = async () => {
    setValidationError('');
    setSuccessMessage('');

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Invalid email format');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      setSuccessMessage('Signed up successfully! Proceed to '); // Set success message
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
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
        }}>Sign Up</h1>
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
        {validationError && <p style={{
          color: '#f44336',
          marginBottom: '16px',
          textAlign: 'center',
          fontSize: '14px',
        }}>{validationError}</p>}
        <button
          onClick={handleSignUp}
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
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        {successMessage && <p style={{
          color: '#4caf50', // Success message color
          marginTop: '12px',
          textAlign: 'center',
          fontSize: '14px',
        }}>
          {successMessage} <Link href="/sign-in" style={{
            color: 'darkred',
            textDecoration: 'underline',
          }}>Log In</Link>
        </p>}
        {error && <p style={{
          color: '#f44336',
          marginTop: '12px',
          textAlign: 'center',
          fontSize: '14px',
        }}>{error.message}</p>}
        <div style={{
          marginTop: '16px',
          textAlign: 'center',
        }}>
          <p style={{
            color: '#fff',
            fontSize: '16px',
            margin: 0,
          }}>
            Already a member?{' '}
            <Link href="/sign-in" style={{
              color: 'darkred',
              textDecoration: 'underline',
            }}>Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
