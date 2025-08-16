import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTournament } from './hooks/useTournament';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Players from './components/Players';
import Matches from './components/Matches';
import Standings from './components/Standings';
import Playoffs from './components/Playoffs';
import Analytics from './components/Analytics';
import './App.css';

function App() {
  const tournament = useTournament();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard tournament={tournament} />} />
            <Route path="/players" element={<Players tournament={tournament} />} />
            <Route path="/matches" element={<Matches tournament={tournament} />} />
            <Route path="/standings" element={<Standings tournament={tournament} />} />
            <Route path="/playoffs" element={<Playoffs tournament={tournament} />} />
            <Route path="/analytics" element={<Analytics tournament={tournament} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

