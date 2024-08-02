'use client';

import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config.js';
import Link from 'next/link';  // Import Link for navigation

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
      <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '384px' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px', textAlign: 'center'}}>Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '16px', backgroundColor: '#333', borderRadius: '4px', border: 'none', color: '#fff', placeholderColor: '#777' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '16px', backgroundColor: '#333', borderRadius: '4px', border: 'none', color: '#fff', placeholderColor: '#777' }}
        />
        <button
          onClick={handleSignUp}
          style={{ width: '100%', padding: '12px', backgroundColor: 'darkred', borderRadius: '4px', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s' }}
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        {error && <p style={{ color: '#f44336', marginTop: '12px' }}>{error.message}</p>}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <p style={{ color: '#fff' }}>
            Already a member?{' '}
            <Link href="/sign-in" style={{ color: 'darkred', textDecoration: 'underline' }}>Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
