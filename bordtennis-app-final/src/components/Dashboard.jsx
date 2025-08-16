import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = ({ tournament }) => {
  const { players, matches, phase, generateMatches, generatePlayoffs, resetTournament } = tournament;

  const completedMatches = matches.filter(m => m.status === 'completed').length;
  const totalMatches = matches.length;
  const nextMatch = matches.find(m => m.status === 'pending');

  const getPhaseText = () => {
    switch (phase) {
      case 'setup': return 'Oppsett';
      case 'group': return 'Grunnspill';
      case 'playoffs': return 'Sluttspill';
      case 'finished': return 'Ferdig';
      default: return 'Ukjent';
    }
  };

  const canStartTournament = players.length >= 2 && phase === 'setup';
  const canStartPlayoffs = phase === 'group' && completedMatches === totalMatches && players.length >= 4;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bordtennis Turnering</h1>
        <p className="text-gray-600">
          {phase === 'setup' 
            ? 'Legg til spillere på "Spillere"-siden for å starte.'
            : `Velkommen til turneringen!`
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Fase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPhaseText()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Kamper</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMatches}/{totalMatches}</div>
            <p className="text-xs text-gray-500">
              {totalMatches > 0 ? `${Math.round((completedMatches / totalMatches) * 100)}% fullført` : 'Ingen kamper'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Spillere</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players.length}</div>
            <p className="text-xs text-gray-500">Aktive spillere</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Leder</CardTitle>
          </CardHeader>
          <CardContent>
            {players.length > 0 ? (
              <div>
                <div className="text-lg font-bold">{players.sort((a, b) => b.points - a.points)[0]?.name || '-'}</div>
                <p className="text-xs text-gray-500">
                  {players.sort((a, b) => b.points - a.points)[0]?.points || 0} poeng
                </p>
              </div>
            ) : (
              <div className="text-lg font-bold">-</div>
            )}
          </CardContent>
        </Card>
      </div>

      {phase === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle>Start Turnering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Legg til minst 2 spillere for å starte turneringen. Turneringen vil være en dobbel round-robin 
              (alle møter alle 2 ganger) etterfulgt av sluttspill hvis det er 4 eller flere spillere.
            </p>
            <Button 
              onClick={generateMatches} 
              disabled={!canStartTournament}
              className="w-full"
            >
              {canStartTournament ? 'Start Turnering' : `Trenger ${Math.max(0, 2 - players.length)} spillere til`}
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === 'group' && nextMatch && (
        <Card>
          <CardHeader>
            <CardTitle>Neste Kamp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">{nextMatch.player1.name}</div>
                  <div className="text-sm text-gray-500">{nextMatch.player1.emoji}</div>
                </div>
                <div className="text-2xl font-bold text-gray-400">VS</div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{nextMatch.player2.name}</div>
                  <div className="text-sm text-gray-500">{nextMatch.player2.emoji}</div>
                </div>
              </div>
              <Button asChild>
                <a href="/matches">Registrer Resultat</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {canStartPlayoffs && (
        <Card>
          <CardHeader>
            <CardTitle>Grunnspill Ferdig!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Alle grunnspillkamper er fullført. Klar for sluttspill?
            </p>
            <Button onClick={generatePlayoffs} className="w-full">
              Start Sluttspill
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === 'playoffs' && (
        <Card>
          <CardHeader>
            <CardTitle>Sluttspill i gang!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Sluttspillet har startet. Gå til "Sluttspill"-siden for å se kampene.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={resetTournament}
          className="text-red-600 hover:text-red-700"
        >
          Tilbakestill Turnering
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;

