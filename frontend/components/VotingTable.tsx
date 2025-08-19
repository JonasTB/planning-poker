'use client';

interface Player {
  id: string;
  name: string;
  avatar?: string;
}

interface Vote {
  playerId: string;
  playerName: string;
  value: number;
}

interface Room {
  id: string;
  name: string;
  status: 'waiting' | 'voting' | 'revealed';
  ownerId: string;
  maxPlayers: number;
  players: Player[];
}

interface VotingTableProps {
  room: Room;
  players: Player[];
  votes: Vote[];
  isOwner: boolean;
  hasVoted: boolean;
  onVote: (value: number) => void;
}

export default function VotingTable({
  room,
  players,
  votes,
  isOwner,
  hasVoted,
  onVote,
}: VotingTableProps) {
  const getVoteForPlayer = (playerId: string) => {
    return votes.find(vote => vote.playerId === playerId);
  };

  const getVoteDisplay = (vote: Vote | undefined, roomStatus: string) => {
    if (!vote) {
      return roomStatus === 'voting' ? '🤔' : '❌';
    }
    
    if (roomStatus === 'voting') {
      return '✅';
    }
    
    return vote.value;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🎯 Mesa de Votação
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player) => {
          const vote = getVoteForPlayer(player.id);
          const isCurrentPlayer = player.id === room.ownerId;
          
          return (
            <div
              key={player.id}
              className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                isCurrentPlayer
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-2">
                {player.avatar || '👤'}
              </div>
              <div className="font-medium text-gray-900 mb-1">
                {player.name}
                {isCurrentPlayer && ' 👑'}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {isCurrentPlayer ? 'Dono da Sala' : 'Jogador'}
              </div>
              <div className={`text-2xl font-bold ${
                room.status === 'revealed' && vote
                  ? 'text-primary-600'
                  : 'text-gray-400'
              }`}>
                {getVoteDisplay(vote, room.status)}
              </div>
              {room.status === 'voting' && !hasVoted && !isCurrentPlayer && (
                <div className="text-xs text-gray-500 mt-2">
                  Aguardando voto...
                </div>
              )}
            </div>
          );
        })}
      </div>

      {room.status === 'waiting' && (
        <div className="text-center mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            {isOwner 
              ? 'Clique em "Iniciar Planning" para começar a votação'
              : 'Aguardando o dono da sala iniciar a votação...'
            }
          </p>
        </div>
      )}

      {room.status === 'voting' && (
        <div className="text-center mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            Votação em andamento! Escolha sua carta abaixo.
          </p>
        </div>
      )}

      {room.status === 'revealed' && (
        <div className="text-center mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-purple-800">
            Votos revelados! Analise os resultados e discuta com a equipe.
          </p>
        </div>
      )}
    </div>
  );
}
