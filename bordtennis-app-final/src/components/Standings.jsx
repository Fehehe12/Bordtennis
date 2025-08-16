import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Standings = ({ tournament }) => {
  const { getStandings, players } = tournament;
  const standings = getStandings();

  if (players.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tabell</h1>
          <p className="text-gray-600">Oversikt over spillernes plassering i turneringen.</p>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Ingen spillere ennå. Legg til spillere for å se tabellen.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tabell</h1>
        <p className="text-gray-600">Oversikt over spillernes plassering i turneringen.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grunnspilltabell</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Pos</th>
                  <th className="text-left py-2 px-2">Spiller</th>
                  <th className="text-center py-2 px-2">K</th>
                  <th className="text-center py-2 px-2">S</th>
                  <th className="text-center py-2 px-2">T</th>
                  <th className="text-center py-2 px-2">Sett</th>
                  <th className="text-center py-2 px-2">+/-</th>
                  <th className="text-center py-2 px-2">Poeng</th>
                  <th className="text-center py-2 px-2">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((player, index) => (
                  <tr key={player.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        {index < 4 && (
                          <Badge 
                            variant={index === 0 ? "default" : "secondary"}
                            className="mr-2"
                          >
                            {index + 1}
                          </Badge>
                        )}
                        {index >= 4 && (
                          <span className="text-gray-500 mr-2">{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full ${player.color} flex items-center justify-center text-white text-sm`}>
                          {player.emoji}
                        </div>
                        <span className="font-medium">{player.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-2">{player.matches}</td>
                    <td className="text-center py-3 px-2 text-green-600 font-medium">{player.wins}</td>
                    <td className="text-center py-3 px-2 text-red-600 font-medium">{player.losses}</td>
                    <td className="text-center py-3 px-2">
                      {player.setsWon}-{player.setsLost}
                    </td>
                    <td className={`text-center py-3 px-2 font-medium ${
                      player.setsWon - player.setsLost > 0 ? 'text-green-600' : 
                      player.setsWon - player.setsLost < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {player.setsWon - player.setsLost > 0 ? '+' : ''}{player.setsWon - player.setsLost}
                    </td>
                    <td className="text-center py-3 px-2">
                      {player.pointsWon}-{player.pointsLost}
                    </td>
                    <td className="text-center py-3 px-2 font-bold text-blue-600">
                      {player.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forklaring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <div><strong>K:</strong> Kamper spilt</div>
          <div><strong>S:</strong> Seire</div>
          <div><strong>T:</strong> Tap</div>
          <div><strong>Sett:</strong> Sett vunnet - Sett tapt</div>
          <div><strong>+/-:</strong> Settdifferanse</div>
          <div><strong>Poeng:</strong> Poeng vunnet - Poeng tapt</div>
          <div><strong>Pts:</strong> Turneringspoeng (2 per seier)</div>
          <div className="pt-2 border-t">
            <strong>Tiebreak-regler:</strong> 1) Turneringspoeng, 2) Innbyrdes oppgjør, 3) Settdifferanse, 4) Poengdifferanse
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Standings;

