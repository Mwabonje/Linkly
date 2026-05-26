import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';

export function Auth({ type = 'login' }: { type?: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          navigate('/admin');
        }
      });
    }
  }, [navigate]);

  if (!supabase) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Supabase Configuration Required</h2>
          <p className="text-muted mb-8 leading-relaxed">
            You requested multi-user support with Supabase. To enable this, you need to add your 
            <strong className="text-white"> VITE_SUPABASE_URL</strong> and 
            <strong className="text-white"> VITE_SUPABASE_ANON_KEY</strong> to the environment variables via the Secrets menu.
            <br/><br/>
            <span className="text-rose-400">Important: Make sure the names start exactly with "VITE_" otherwise the app cannot read them.</span>
          </p>
          <div className="bg-background rounded-xl p-4 text-sm text-left border border-white/5 space-y-2 mb-6">
            <div className="text-muted">1. Open the Secrets panel in AI Studio</div>
            <div className="text-muted">2. Add the two variables with your project details</div>
            <div className="text-muted">3. Restart the preview</div>
          </div>
        </div>
      </div>
    );
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = type === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (authError) {
      setError(authError.message);
    } else if (type === 'login') {
      navigate('/admin');
    } else {
      setError('Check your email for the confirmation link.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            {type === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-muted">Manage your digital identity in one place.</p>
        </div>

        <form onSubmit={handleAuth} className="bg-surface border border-border p-8 rounded-3xl shadow-xl space-y-5">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5 ml-1">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/40"
                  placeholder="name@example.com"
                  required
                />
                <Mail className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5 ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/40"
                  placeholder="••••••••"
                  required
                />
                <Lock className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 mt-6"
          >
            <span>{loading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Sign Up')}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted">
              {type === 'login' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => navigate(type === 'login' ? '/signup' : '/login')}
              className="text-primary hover:text-white font-semibold transition-colors"
            >
              {type === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
