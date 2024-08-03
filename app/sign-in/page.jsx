'use client';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config.js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';  // Import Link for navigation

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [authError, setAuthError] = useState('');
  const [isFormValid, setIsFormValid] = useState(true); // New state for form validation
  const router = useRouter();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSignIn = async () => {
    setAuthError(''); // Reset the authentication error state
    
    if (!validateEmail(email)) {
      setAuthError('Invalid email format.');
      setIsFormValid(false); // Form is not valid
      console.log('Invalid email format.');
      return;
    }
    
    if (!validatePassword(password)) {
      setAuthError('Password must be at least 6 characters long.');
      setIsFormValid(false); // Form is not valid
      console.log('Invalid password.');
      return;
    }
    
    setIsFormValid(true); // Form is valid, proceed with sign-in
    
    try {
      // Attempt to sign in with email and password
      const res = await signInWithEmailAndPassword(email, password);
      console.log('Sign-in response:', res);
      
      // Check if sign-in was successful
      if (res) {
        sessionStorage.setItem('user', true);
        setEmail('');
        setPassword('');
        router.push('/');
      }
    } catch (e) {
      // Enhanced error handling
      console.error('Sign-in error details:', e);
      
      // Handle specific Firebase authentication errors
      if (e.code === 'auth/user-not-found') {
        setAuthError("You don't have an account yet. Please sign up.");
      } else if (e.code === 'auth/wrong-password') {
        setAuthError('Incorrect password. Please try again.');
      } else if (e.code === 'auth/invalid-email') {
        setAuthError('Invalid email format.');
      } else {
        setAuthError('An error occurred. Please try again.');
      }
      setIsFormValid(false); // Form is not valid
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
        {authError && (
          <p style={{
            color: '#f44336',
            marginBottom: '16px',
            textAlign: 'center',
            fontSize: '14px',
          }}>
            {authError}
          </p>
        )}
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
          disabled={loading || !isFormValid} // Disable button if loading or form is invalid
        >
          {loading ? 'Logging In...' : 'Log In'}
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
