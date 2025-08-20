'use client';

interface VoteCardsProps {
  onVote: (value: number) => void;
  hasVoted: boolean;
}

const VOTE_OPTIONS = [
  { value: 1, label: '1', description: '4h' },
  { value: 2, label: '2', description: '1d' },
  { value: 3, label: '3', description: '1d 4h' },
  { value: 5, label: '5', description: '2d 4h' },
  { value: 8, label: '8', description: '3d 4h' },
  { value: 13, label: '13', description: '1s' },
];

export default function VoteCards({ onVote, hasVoted }: VoteCardsProps) {
  if (hasVoted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Voto Registrado!
        </h3>
        <p className="text-gray-600">
          Aguarde o dono da sala revelar todos os votos.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        🃏 Escolha sua Carta
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {VOTE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onVote(option.value)}
            className="group relative p-4 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:text-blue-800">
                {option.label}
              </div>
              <div className="text-sm text-blue-700 font-medium">
                {option.description}
              </div>
            </div>
            
            <div className="absolute inset-0 bg-blue-200 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200" />
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Clique em uma carta para votar. Seu voto será secreto até ser revelado.</p>
      </div>
    </div>
  );
}
