import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

const Players = ({ tournament }) => {
  const { players, addPlayer, removePlayer, phase } = tournament;
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (addPlayer(newPlayerName)) {
      setNewPlayerName('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Spillere</h1>
        <p className="text-gray-600">Administrer spillere i turneringen.</p>
      </div>

      {phase === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle>Legg til ny spiller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Spillernavn"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleAddPlayer}
                disabled={!newPlayerName.trim()}
              >
                Legg til
              </Button>
            </div>
            {players.length === 0 && (
              <p className="text-sm text-gray-500">
                Ingen spillere lagt til ennå. Bruk skjemaet over for å legge til spillere.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {players.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <Card key={player.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${player.color} flex items-center justify-center text-white text-lg`}>
                      {player.emoji}
                    </div>
                    <CardTitle className="text-lg">{player.name}</CardTitle>
                  </div>
                  {phase === 'setup' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(player.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Kamper spilt</div>
                    <div className="font-semibold">{player.matches}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Seier</div>
                    <div className="font-semibold text-green-600">{player.wins}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Tap</div>
                    <div className="font-semibold text-red-600">{player.losses}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Poeng</div>
                    <div className="font-semibold">{player.points}</div>
                  </div>
                </div>
                
                {player.matches > 0 && (
                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <div>Sett: {player.setsWon}-{player.setsLost}</div>
                        <div className={player.setsWon - player.setsLost >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ({player.setsWon - player.setsLost >= 0 ? '+' : ''}{player.setsWon - player.setsLost})
                        </div>
                      </div>
                      <div>
                        <div>Poeng: {player.pointsWon}-{player.pointsLost}</div>
                        <div className={player.pointsWon - player.pointsLost >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ({player.pointsWon - player.pointsLost >= 0 ? '+' : ''}{player.pointsWon - player.pointsLost})
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {phase !== 'setup' && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Turneringen er i gang. Spillere kan ikke endres under turneringen.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Players;

