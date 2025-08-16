import { useState, useCallback, useEffect } from 'react';

const INITIAL_PLAYERS = [];

const EMOJIS = ['🏓', '⚡', '🔥', '💪', '🎯', '🚀', '⭐', '🏆', '💎', '🎪'];
const COLORS = [
  'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
  'bg-teal-500', 'bg-cyan-500'
];

export const useTournament = () => {
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [matches, setMatches] = useState([]);
  const [phase, setPhase] = useState('setup'); // setup, group, playoffs, finished
  const [playoffMatches, setPlayoffMatches] = useState([]);

  const addPlayer = useCallback((name) => {
    if (!name.trim() || players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      return false;
    }

    const newPlayer = {
      id: Date.now(),
      name: name.trim(),
      emoji: EMOJIS[players.length % EMOJIS.length],
      color: COLORS[players.length % COLORS.length],
      matches: 0,
      wins: 0,
      losses: 0,
      setsWon: 0,
      setsLost: 0,
      pointsWon: 0,
      pointsLost: 0,
      points: 0
    };

    setPlayers(prev => [...prev, newPlayer]);
    return true;
  }, [players]);

  const removePlayer = useCallback((playerId) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  }, []);

  const generateMatches = useCallback(() => {
    if (players.length < 2) return;

    const newMatches = [];
    let matchId = 1;

    // Double round-robin
    for (let round = 1; round <= 2; round++) {
      for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
          newMatches.push({
            id: matchId++,
            player1Id: players[i].id,
            player2Id: players[j].id,
            player1: players[i],
            player2: players[j],
            round: round,
            status: 'pending',
            sets: [],
            winnerId: null,
            isPlayoff: false
          });
        }
      }
    }

    setMatches(newMatches);
    setPhase('group');
  }, [players]);

  // Separate function to update player statistics
  const updatePlayerStatistics = useCallback(() => {
    setPlayers(prevPlayers => {
      return prevPlayers.map(player => {
        const playerMatches = matches.filter(m => 
          (m.player1Id === player.id || m.player2Id === player.id) && m.status === 'completed'
        );

        let wins = 0, losses = 0, setsWon = 0, setsLost = 0, pointsWon = 0, pointsLost = 0;

        playerMatches.forEach(match => {
          if (match.winnerId === player.id) {
            wins++;
          } else if (match.winnerId) {
            losses++;
          }

          match.sets?.forEach(set => {
            if (match.player1Id === player.id) {
              setsWon += set.player1Score > set.player2Score ? 1 : 0;
              setsLost += set.player2Score > set.player1Score ? 1 : 0;
              pointsWon += set.player1Score;
              pointsLost += set.player2Score;
            } else {
              setsWon += set.player2Score > set.player1Score ? 1 : 0;
              setsLost += set.player1Score > set.player2Score ? 1 : 0;
              pointsWon += set.player2Score;
              pointsLost += set.player1Score;
            }
          });
        });

        return {
          ...player,
          matches: playerMatches.length,
          wins,
          losses,
          setsWon,
          setsLost,
          pointsWon,
          pointsLost,
          points: wins * 2
        };
      });
    });
  }, [matches]);

  // Update player statistics whenever matches change
  useEffect(() => {
    updatePlayerStatistics();
  }, [matches, updatePlayerStatistics]);

  const recordMatchResult = useCallback((matchId, sets) => {
    setMatches(prev => prev.map(match => {
      if (match.id !== matchId) return match;

      const player1Sets = sets.filter(set => set.player1Score > set.player2Score).length;
      const player2Sets = sets.filter(set => set.player2Score > set.player1Score).length;
      const winnerId = player1Sets > player2Sets ? match.player1Id : match.player2Id;

      return {
        ...match,
        sets,
        winnerId,
        status: 'completed'
      };
    }));
  }, []);

  const getStandings = useCallback(() => {
    return [...players].sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      if ((a.setsWon - a.setsLost) !== (b.setsWon - b.setsLost)) {
        return (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost);
      }
      return (b.pointsWon - b.pointsLost) - (a.pointsWon - a.pointsLost);
    });
  }, [players]);

  const generatePlayoffs = useCallback(() => {
    const standings = getStandings();
    if (standings.length < 4) return;

    const newPlayoffMatches = [
      {
        id: 'semi1',
        player1: standings[0],
        player2: standings[3],
        player1Id: standings[0].id,
        player2Id: standings[3].id,
        round: 'semifinal',
        status: 'pending',
        sets: [],
        winnerId: null,
        isPlayoff: true,
        title: 'Semifinale 1'
      },
      {
        id: 'semi2',
        player1: standings[1],
        player2: standings[2],
        player1Id: standings[1].id,
        player2Id: standings[2].id,
        round: 'semifinal',
        status: 'pending',
        sets: [],
        winnerId: null,
        isPlayoff: true,
        title: 'Semifinale 2'
      }
    ];

    setPlayoffMatches(newPlayoffMatches);
    setPhase('playoffs');
  }, [getStandings]);

  const recordPlayoffResult = useCallback((matchId, sets) => {
    setPlayoffMatches(prev => {
      const updated = prev.map(match => {
        if (match.id !== matchId) return match;

        const player1Sets = sets.filter(set => set.player1Score > set.player2Score).length;
        const player2Sets = sets.filter(set => set.player2Score > set.player1Score).length;
        const winnerId = player1Sets > player2Sets ? match.player1Id : match.player2Id;
        const winner = player1Sets > player2Sets ? match.player1 : match.player2;

        return {
          ...match,
          sets,
          winnerId,
          winner,
          status: 'completed'
        };
      });

      // Check if we need to generate final
      const completedSemis = updated.filter(m => m.round === 'semifinal' && m.status === 'completed');
      if (completedSemis.length === 2 && !updated.some(m => m.round === 'final')) {
        updated.push({
          id: 'final',
          player1: completedSemis[0].winner,
          player2: completedSemis[1].winner,
          player1Id: completedSemis[0].winnerId,
          player2Id: completedSemis[1].winnerId,
          round: 'final',
          status: 'pending',
          sets: [],
          winnerId: null,
          isPlayoff: true,
          title: 'Finale'
        });
      }

      return updated;
    });
  }, []);

  const resetTournament = useCallback(() => {
    setPlayers([]);
    setMatches([]);
    setPlayoffMatches([]);
    setPhase('setup');
  }, []);

  const simulateMatch = useCallback((matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    // Generate realistic sets (best of 5)
    const sets = [];
    let player1Sets = 0;
    let player2Sets = 0;

    while (player1Sets < 3 && player2Sets < 3) {
      const player1Score = Math.random() > 0.5 ? 
        Math.floor(Math.random() * 5) + 11 : 
        Math.floor(Math.random() * 10) + 1;
      
      const player2Score = player1Score >= 11 ? 
        Math.floor(Math.random() * (player1Score - 2)) + 1 :
        Math.floor(Math.random() * 5) + 11;

      sets.push({
        player1Score: Math.max(player1Score, player2Score === player1Score + 1 ? player1Score + 2 : player1Score),
        player2Score: Math.max(player2Score, player1Score === player2Score + 1 ? player2Score + 2 : player2Score)
      });

      if (sets[sets.length - 1].player1Score > sets[sets.length - 1].player2Score) {
        player1Sets++;
      } else {
        player2Sets++;
      }
    }

    recordMatchResult(matchId, sets);
  }, [matches, recordMatchResult]);

  return {
    players,
    matches,
    playoffMatches,
    phase,
    addPlayer,
    removePlayer,
    generateMatches,
    recordMatchResult,
    recordPlayoffResult,
    getStandings,
    generatePlayoffs,
    resetTournament,
    simulateMatch
  };
};

