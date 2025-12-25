import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import IDE from './pages/IDE';
import Notes from './pages/Notes';
import Queries from './pages/Queries';

type Page = 'home' | 'login' | 'signup' | 'dashboard' | 'leaderboard' | 'ide' | 'notes' | 'queries';

function App() {
  const { user, loading, signUp, signIn, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [error, setError] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleSignUp = async (email: string, password: string, username: string) => {
    const { error } = await signUp(email, password, username);
    if (error) {
      throw new Error(error.message);
    }
    setCurrentPage('dashboard');
  };

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) {
      throw new Error(error.message);
    }
    setCurrentPage('dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    if (page.startsWith('profile-')) {
      return;
    }
    setCurrentPage(page as Page);
  };

  if (!user) {
    if (currentPage === 'signup') {
      return <SignUpForm onSignUp={handleSignUp} onSwitchToLogin={() => setCurrentPage('login')} />;
    }
    if (currentPage === 'login') {
      return <LoginForm onLogin={handleSignIn} onSwitchToSignUp={() => setCurrentPage('signup')} />;
    }
    return <Home onGetStarted={() => setCurrentPage('signup')} />;
  }

  switch (currentPage) {
    case 'dashboard':
      return <Dashboard userId={user.id} onSignOut={handleSignOut} onNavigate={handleNavigate} />;
    case 'leaderboard':
      return <Leaderboard onNavigate={handleNavigate} />;
    case 'ide':
      return <IDE onNavigate={handleNavigate} userId={user.id} />;
    case 'notes':
      return <Notes onNavigate={handleNavigate} userId={user.id} />;
    case 'queries':
      return <Queries onNavigate={handleNavigate} userId={user.id} />;
    default:
      return <Dashboard userId={user.id} onSignOut={handleSignOut} onNavigate={handleNavigate} />;
  }
}

export default App;
