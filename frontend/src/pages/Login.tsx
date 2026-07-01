import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { MessageSquareCode, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-card border p-8 rounded-3xl shadow-xl relative z-10">
        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="inline-flex bg-gradient-to-tr from-primary to-indigo-500 p-3 rounded-2xl text-primary-foreground mx-auto">
            <MessageSquareCode className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Sign in to your account</h2>
          <p className="text-sm text-muted-foreground">
            Or{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-indigo-500 transition-colors">
              create a new account for free
            </Link>
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-center space-x-2 text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-2xl border border-destructive/20">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 bg-muted/40 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.email ? 'border-destructive focus:ring-destructive' : 'border-border'
                }`}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>
            {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-muted-foreground" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-primary hover:text-indigo-500 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 bg-muted/40 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                  errors.password ? 'border-destructive focus:ring-destructive' : 'border-border'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
            </div>
            {errors.password && <p className="text-xs text-destructive font-medium">{errors.password.message}</p>}
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center space-x-2 bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary/95 transition-all duration-300 disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
