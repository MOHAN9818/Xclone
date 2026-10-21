import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerRequest({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password
      });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="auth-header">
          <div className="auth-logo">𝕏</div>
          <h2>Join TwitterClone today</h2>
          <p className="auth-subtitle">Create an account to start sharing and following</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="input-field"
              type="text"
              placeholder="e.g. johndoe"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input-field"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input-field"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
