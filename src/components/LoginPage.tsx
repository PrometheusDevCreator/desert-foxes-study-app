'use client';

import { useState, useEffect } from 'react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

interface StoredUser {
  username: string;
  createdAt: string;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);
  const [existingUsers, setExistingUsers] = useState<StoredUser[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load existing users from localStorage
    const users = localStorage.getItem('desert-foxes-users');
    if (users) {
      const parsed = JSON.parse(users) as StoredUser[];
      setExistingUsers(parsed);
      if (parsed.length > 0) {
        setIsNewUser(false);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }

    const trimmedUsername = username.trim();

    // Check if user exists
    const existingUser = existingUsers.find(
      u => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (existingUser) {
      // Existing user logging in
      onLogin(existingUser.username);
    } else {
      // New user - create account
      const newUser: StoredUser = {
        username: trimmedUsername,
        createdAt: new Date().toISOString(),
      };
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('desert-foxes-users', JSON.stringify(updatedUsers));
      onLogin(trimmedUsername);
    }
  };

  const handleSelectUser = (user: StoredUser) => {
    onLogin(user.username);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0a0806' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(20, 18, 15, 1) 0%, rgba(10, 8, 6, 1) 100%)',
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 200px 100px rgba(0,0,0,0.6)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{
              fontFamily: "'Palatino Linotype', 'Book Antiqua', Georgia, serif",
              color: '#d4a574',
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            The Desert Foxes
          </h1>
          <p
            className="text-sm tracking-widest uppercase"
            style={{
              color: '#8b7355',
              fontFamily: "'Georgia', serif",
            }}
          >
            Kevin&apos;s Study Room
          </p>
        </div>

        {/* Login Card */}
        <div
          className="p-6 rounded-lg"
          style={{
            background: 'rgba(30, 28, 25, 0.9)',
            border: '1px solid rgba(212, 165, 116, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {existingUsers.length > 0 && !isNewUser ? (
            <>
              <h2
                className="text-lg font-bold mb-4 text-center"
                style={{ color: '#e8dcc8' }}
              >
                Welcome Back, Soldier
              </h2>
              <p className="text-sm text-center mb-4" style={{ color: '#8b7355' }}>
                Select your profile to continue
              </p>

              {/* Existing users list */}
              <div className="space-y-2 mb-4">
                {existingUsers.map((user) => (
                  <button
                    key={user.username}
                    onClick={() => handleSelectUser(user)}
                    className="w-full p-3 rounded text-left transition-all hover:scale-[1.02]"
                    style={{
                      background: 'rgba(212, 165, 116, 0.1)',
                      border: '1px solid rgba(212, 165, 116, 0.3)',
                      color: '#d4a574',
                    }}
                  >
                    <span className="font-bold">{user.username}</span>
                  </button>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setIsNewUser(true)}
                  className="text-sm hover:underline"
                  style={{ color: '#8b7355' }}
                >
                  Create new profile
                </button>
              </div>
            </>
          ) : (
            <>
              <h2
                className="text-lg font-bold mb-4 text-center"
                style={{ color: '#e8dcc8' }}
              >
                {existingUsers.length > 0 ? 'Create New Profile' : 'Enter Your Name'}
              </h2>
              <p className="text-sm text-center mb-4" style={{ color: '#8b7355' }}>
                Your progress will be saved locally
              </p>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter username..."
                  className="w-full p-3 rounded mb-3 outline-none transition-all"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(212, 165, 116, 0.3)',
                    color: '#e8dcc8',
                    fontFamily: "'Georgia', serif",
                  }}
                  autoFocus
                />

                {error && (
                  <p className="text-sm mb-3" style={{ color: '#c45c5c' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full p-3 rounded font-bold uppercase tracking-wider transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #d4a574 0%, #a67c52 100%)',
                    color: '#1a1a2e',
                    border: 'none',
                    textShadow: '0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  Start Learning
                </button>
              </form>

              {existingUsers.length > 0 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setIsNewUser(false)}
                    className="text-sm hover:underline"
                    style={{ color: '#8b7355' }}
                  >
                    Back to profiles
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Decorative bottom text */}
        <p
          className="text-center mt-6 text-xs tracking-wider"
          style={{ color: '#5a4a3a' }}
        >
          North African Campaign Study App
        </p>
      </div>
    </div>
  );
}
