import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginRequest } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginRequest({
        email: form.email.trim(),
        password: form.password
      });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
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
          <h2>Log in to TwitterClone</h2>
          <p className="auth-subtitle">Welcome back! Sign in to continue</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={submit} className="auth-form">
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
              autoFocus
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
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
