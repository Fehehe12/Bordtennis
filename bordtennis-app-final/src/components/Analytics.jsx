import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Analytics = ({ tournament }) => {
  const { players, matches } = tournament;

  if (players.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Detaljert statistikk og analyse av turneringen.</p>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Ingen data ennå. Start turneringen for å se analytics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate MVP scores
  const playersWithMVP = players.map(player => {
    const winRate = player.matches > 0 ? (player.wins / player.matches) * 100 : 0;
    const setDiff = player.setsWon - player.setsLost;
    const pointDiff = player.pointsWon - player.pointsLost;
    
    // Normalize values for MVP calculation
    const maxSetDiff = Math.max(...players.map(p => Math.abs(p.setsWon - p.setsLost))) || 1;
    const maxPointDiff = Math.max(...players.map(p => Math.abs(p.pointsWon - p.pointsLost))) || 1;
    
    const normalizedSetDiff = (setDiff / maxSetDiff) * 50;
    const normalizedPointDiff = (pointDiff / maxPointDiff) * 50;
    
    const mvpScore = (winRate * 0.5) + (normalizedSetDiff * 0.3) + (normalizedPointDiff * 0.2);
    
    return {
      ...player,
      winRate,
      mvpScore: Math.round(mvpScore * 10) / 10
    };
  }).sort((a, b) => b.mvpScore - a.mvpScore);

  // Calculate head-to-head records
  const headToHead = {};
  players.forEach(p1 => {
    players.forEach(p2 => {
      if (p1.id !== p2.id) {
        const matchesBetween = matches.filter(m => 
          ((m.player1.id === p1.id && m.player2.id === p2.id) || 
           (m.player1.id === p2.id && m.player2.id === p1.id)) && 
          m.status === 'completed'
        );
        
        const p1Wins = matchesBetween.filter(m => m.winner?.id === p1.id).length;
        const p2Wins = matchesBetween.filter(m => m.winner?.id === p2.id).length;
        
        let p1Sets = 0, p2Sets = 0, p1Points = 0, p2Points = 0;
        
        matchesBetween.forEach(match => {
          match.sets?.forEach(set => {
            if (match.player1.id === p1.id) {
              p1Sets += set.player1Score > set.player2Score ? 1 : 0;
              p2Sets += set.player2Score > set.player1Score ? 1 : 0;
              p1Points += set.player1Score;
              p2Points += set.player2Score;
            } else {
              p1Sets += set.player2Score > set.player1Score ? 1 : 0;
              p2Sets += set.player1Score > set.player2Score ? 1 : 0;
              p1Points += set.player2Score;
              p2Points += set.player1Score;
            }
          });
        });
        
        const key = `${p1.id}-${p2.id}`;
        headToHead[key] = {
          player1: p1,
          player2: p2,
          matches: matchesBetween.length,
          p1Wins,
          p2Wins,
          p1Sets,
          p2Sets,
          p1Points,
          p2Points,
          avgPointsPerSet: matchesBetween.length > 0 ? Math.round(((p1Points + p2Points) / (p1Sets + p2Sets)) * 10) / 10 : 0
        };
      }
    });
  });

  // Calculate form (last 5 matches)
  const playersWithForm = players.map(player => {
    const playerMatches = matches
      .filter(m => (m.player1.id === player.id || m.player2.id === player.id) && m.status === 'completed')
      .sort((a, b) => a.id - b.id) // Sort by match order
      .slice(-5); // Last 5 matches
    
    const form = playerMatches.map(match => match.winner?.id === player.id ? 'W' : 'L');
    const wins = form.filter(result => result === 'W').length;
    const losses = form.filter(result => result === 'L').length;
    
    return {
      ...player,
      form,
      formSummary: `${wins}W-${losses}L`
    };
  });

  // Calculate streaks
  const playersWithStreaks = players.map(player => {
    const playerMatches = matches
      .filter(m => (m.player1.id === player.id || m.player2.id === player.id) && m.status === 'completed')
      .sort((a, b) => a.id - b.id);
    
    let currentStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let currentStreakType = null;
    
    for (let i = playerMatches.length - 1; i >= 0; i--) {
      const isWin = playerMatches[i].winner?.id === player.id;
      
      if (i === playerMatches.length - 1) {
        currentStreak = 1;
        currentStreakType = isWin ? 'W' : 'L';
      } else {
        const prevIsWin = playerMatches[i + 1].winner?.id === player.id;
        if (isWin === prevIsWin) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    // Calculate max streaks
    let tempWinStreak = 0;
    let tempLossStreak = 0;
    
    playerMatches.forEach(match => {
      const isWin = match.winner?.id === player.id;
      if (isWin) {
        tempWinStreak++;
        maxWinStreak = Math.max(maxWinStreak, tempWinStreak);
        tempLossStreak = 0;
      } else {
        tempLossStreak++;
        maxLossStreak = Math.max(maxLossStreak, tempLossStreak);
        tempWinStreak = 0;
      }
    });
    
    return {
      ...player,
      currentStreak: playerMatches.length > 0 ? currentStreak : 0,
      currentStreakType: playerMatches.length > 0 ? currentStreakType : null,
      maxWinStreak,
      maxLossStreak
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Detaljert statistikk og analyse av turneringen.</p>
      </div>

      {/* MVP Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>MVP Rangeringer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {playersWithMVP.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    #{index + 1}
                  </Badge>
                  <div className={`w-8 h-8 rounded-full ${player.color} flex items-center justify-center text-white text-sm`}>
                    {player.emoji}
                  </div>
                  <div>
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-sm text-gray-500">
                      {player.winRate.toFixed(1)}% seier, {player.setsWon - player.setsLost > 0 ? '+' : ''}{player.setsWon - player.setsLost} sett
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{player.mvpScore}</div>
                  <div className="text-xs text-gray-500">MVP Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Curve */}
      <Card>
        <CardHeader>
          <CardTitle>Formkurve (Siste 5 kamper)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {playersWithForm.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${player.color} flex items-center justify-center text-white text-sm`}>
                    {player.emoji}
                  </div>
                  <div>
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-sm text-gray-500">{player.formSummary}</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {player.form.map((result, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        result === 'W' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                  {Array.from({ length: 5 - player.form.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="w-6 h-6 rounded-full bg-gray-200"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Streaks */}
      <Card>
        <CardHeader>
          <CardTitle>Rekker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {playersWithStreaks.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${player.color} flex items-center justify-center text-white text-sm`}>
                    {player.emoji}
                  </div>
                  <div>
                    <div className="font-semibold">{player.name}</div>
                    <div className="text-sm text-gray-500">
                      Maks: {player.maxWinStreak}W / {player.maxLossStreak}L
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {player.currentStreak > 0 && (
                    <div className={`text-lg font-bold ${
                      player.currentStreakType === 'W' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {player.currentStreak}{player.currentStreakType}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">Nåværende</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Head-to-Head */}
      <Card>
        <CardHeader>
          <CardTitle>Innbyrdes Oppgjør</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.values(headToHead)
              .filter(h2h => h2h.matches > 0)
              .map((h2h, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{h2h.player1.name}</span>
                      <span className="text-gray-500">vs</span>
                      <span className="font-semibold">{h2h.player2.name}</span>
                    </div>
                    <Badge variant="outline">{h2h.matches} kamper</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Kamper</div>
                      <div className="font-semibold">{h2h.p1Wins}-{h2h.p2Wins}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Sett</div>
                      <div className="font-semibold">{h2h.p1Sets}-{h2h.p2Sets}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Snitt/sett</div>
                      <div className="font-semibold">{h2h.avgPointsPerSet}</div>
                    </div>
                  </div>
                </div>
              ))}
            {Object.values(headToHead).filter(h2h => h2h.matches > 0).length === 0 && (
              <p className="text-center text-gray-500">Ingen fullførte kamper ennå.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

