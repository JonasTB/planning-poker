'use client';

interface Player {
  id: string;
  name: string;
  avatar?: string;
}

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string | null;
}

export default function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        👥 Jogadores ({players.length})
      </h3>
      
      <div className="space-y-3">
        {players.map((player) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          
          return (
            <div
              key={player.id}
              className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
                isCurrentPlayer
                  ? 'border-primary-300 bg-primary-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-2xl mr-3">
                {player.avatar || '👤'}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {player.name}
                  {isCurrentPlayer && ' (Você)'}
                </div>
                <div className="text-sm text-gray-600">
                  {isCurrentPlayer ? 'Jogador Atual' : 'Participante'}
                </div>
              </div>
              {isCurrentPlayer && (
                <div className="text-primary-600 text-sm font-medium">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {players.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">👤</div>
          <p>Nenhum jogador na sala ainda</p>
        </div>
      )}
    </div>
  );
}
