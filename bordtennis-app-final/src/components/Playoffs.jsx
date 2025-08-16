import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const PlayoffMatchModal = ({ match, onSubmit, onClose }) => {
  const [sets, setSets] = useState([]);
  const [currentSet, setCurrentSet] = useState({ player1Score: '', player2Score: '' });

  const addSet = () => {
    const p1Score = parseInt(currentSet.player1Score);
    const p2Score = parseInt(currentSet.player2Score);

    if (isNaN(p1Score) || isNaN(p2Score) || p1Score < 0 || p2Score < 0) {
      alert('Vennligst skriv inn gyldige poeng');
      return;
    }

    const minScore = 11;
    const maxScore = Math.max(p1Score, p2Score);
    const minScoreInSet = Math.min(p1Score, p2Score);

    if (maxScore < minScore) {
      alert('Et sett må vinnes med minst 11 poeng');
      return;
    }

    if (maxScore - minScoreInSet < 2 && maxScore < 11) {
      alert('Vinneren må ha minst 2 poengs margin');
      return;
    }

    setSets([...sets, { player1Score: p1Score, player2Score: p2Score }]);
    setCurrentSet({ player1Score: '', player2Score: '' });
  };

  const removeSet = (index) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const submitResult = () => {
    if (sets.length < 3) {
      alert('En kamp må ha minst 3 sett');
      return;
    }

    const player1Sets = sets.filter(set => set.player1Score > set.player2Score).length;
    const player2Sets = sets.filter(set => set.player2Score > set.player1Score).length;

    if (Math.max(player1Sets, player2Sets) < 3) {
      alert('En spiller må vinne minst 3 sett');
      return;
    }

    onSubmit(match.id, sets);
    onClose();
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{match.title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="text-center">
              <div className="font-semibold">{match.player1.name}</div>
              <div className="text-sm text-gray-500">{match.player1.emoji}</div>
            </div>
            <div className="text-xl font-bold text-gray-400">VS</div>
            <div className="text-center">
              <div className="font-semibold">{match.player2.name}</div>
              <div className="text-sm text-gray-500">{match.player2.emoji}</div>
            </div>
          </div>
        </div>

        {sets.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Registrerte sett:</h4>
            {sets.map((set, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span>Sett {index + 1}: {set.player1Score} - {set.player2Score}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSet(index)}
                  className="text-red-500"
                >
                  Fjern
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Legg til sett:</h4>
          <div className="flex space-x-2">
            <Input
              placeholder={match.player1.name}
              value={currentSet.player1Score}
              onChange={(e) => setCurrentSet({ ...currentSet, player1Score: e.target.value })}
              type="number"
              min="0"
            />
            <Input
              placeholder={match.player2.name}
              value={currentSet.player2Score}
              onChange={(e) => setCurrentSet({ ...currentSet, player2Score: e.target.value })}
              type="number"
              min="0"
            />
            <Button onClick={addSet}>Legg til</Button>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={submitResult} className="flex-1" disabled={sets.length < 3}>
            Fullfør Kamp
          </Button>
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

const Playoffs = ({ tournament }) => {
  const { playoffMatches, recordPlayoffResult, phase } = tournament;
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (phase !== 'playoffs' && phase !== 'finished') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sluttspill</h1>
          <p className="text-gray-600">Sluttspillkamper vises her når grunnspillet er ferdig.</p>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              {phase === 'setup' 
                ? 'Start turneringen først for å se sluttspill.'
                : 'Fullfør grunnspillet for å starte sluttspill.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const semifinals = playoffMatches.filter(m => m.round === 'semifinal');
  const final = playoffMatches.find(m => m.round === 'final');

  const formatSets = (sets) => {
    return sets.map(set => `${set.player1Score}-${set.player2Score}`).join(', ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sluttspill</h1>
        <p className="text-gray-600">Semifinaler og finale i turneringen.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semifinals */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Semifinaler</h2>
          {semifinals.map((match) => (
            <Card key={match.id} className={match.status === 'completed' ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{match.title}</span>
                  <Badge variant={match.status === 'completed' ? 'default' : 'secondary'}>
                    {match.status === 'completed' ? 'Ferdig' : 'Venter'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <div className={`text-center ${match.winner?.id === match.player1.id ? 'font-bold text-green-600' : ''}`}>
                      <div className="font-semibold">{match.player1.name}</div>
                      <div className="text-sm text-gray-500">{match.player1.emoji}</div>
                    </div>
                    <div className="text-xl font-bold text-gray-400">VS</div>
                    <div className={`text-center ${match.winner?.id === match.player2.id ? 'font-bold text-green-600' : ''}`}>
                      <div className="font-semibold">{match.player2.name}</div>
                      <div className="text-sm text-gray-500">{match.player2.emoji}</div>
                    </div>
                  </div>

                  {match.status === 'completed' ? (
                    <div className="text-center">
                      <div className="font-semibold text-green-600 mb-1">
                        Vinner: {match.winner?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Sett: {formatSets(match.sets)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedMatch(match)}>
                            Registrer Resultat
                          </Button>
                        </DialogTrigger>
                        {selectedMatch && (
                          <PlayoffMatchModal
                            match={selectedMatch}
                            onSubmit={recordPlayoffResult}
                            onClose={() => setSelectedMatch(null)}
                          />
                        )}
                      </Dialog>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Final */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Finale</h2>
          {final ? (
            <Card className={final.status === 'completed' ? 'border-yellow-200 bg-yellow-50' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>🏆 {final.title}</span>
                  <Badge variant={final.status === 'completed' ? 'default' : 'secondary'}>
                    {final.status === 'completed' ? 'Ferdig' : 'Venter'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <div className={`text-center ${final.winner?.id === final.player1.id ? 'font-bold text-yellow-600' : ''}`}>
                      <div className="font-semibold">{final.player1.name}</div>
                      <div className="text-sm text-gray-500">{final.player1.emoji}</div>
                    </div>
                    <div className="text-xl font-bold text-gray-400">VS</div>
                    <div className={`text-center ${final.winner?.id === final.player2.id ? 'font-bold text-yellow-600' : ''}`}>
                      <div className="font-semibold">{final.player2.name}</div>
                      <div className="text-sm text-gray-500">{final.player2.emoji}</div>
                    </div>
                  </div>

                  {final.status === 'completed' ? (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">
                        🏆 MESTER: {final.winner?.name} 🏆
                      </div>
                      <div className="text-sm text-gray-500">
                        Sett: {formatSets(final.sets)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedMatch(final)} className="bg-yellow-600 hover:bg-yellow-700">
                            Registrer Finale
                          </Button>
                        </DialogTrigger>
                        {selectedMatch && (
                          <PlayoffMatchModal
                            match={selectedMatch}
                            onSubmit={recordPlayoffResult}
                            onClose={() => setSelectedMatch(null)}
                          />
                        )}
                      </Dialog>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">Finalen genereres når begge semifinalene er ferdig.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playoffs;

