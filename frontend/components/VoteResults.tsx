'use client';

interface Vote {
  playerId: string;
  playerName: string;
  value: number;
}

interface VoteResultsProps {
  votes: Vote[];
}

export default function VoteResults({ votes }: VoteResultsProps) {
  const calculateStats = () => {
    const values = votes.map(vote => vote.value);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const frequency: { [key: number]: number } = {};
    values.forEach(value => {
      frequency[value] = (frequency[value] || 0) + 1;
    });
    
    const mode = Object.entries(frequency).reduce((a: [string, number], b: [string, number]) => 
      frequency[parseInt(a[0])] > frequency[parseInt(b[0])] ? a : b
    )[0];

    return { average, min, max, mode: parseInt(mode) };
  };

  const stats = calculateStats();

  const getValueDescription = (value: number) => {
    const descriptions: { [key: number]: string } = {
      1: '4 horas',
      2: '1 dia',
      3: '1 dia e 4 horas',
      5: '2 dias e 4 horas',
      8: '3 dias e 4 horas',
      13: '1 semana',
    };
    return descriptions[value] || `${value} pontos`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        📊 Resultados da Votação
      </h3>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.average.toFixed(1)}</div>
          <div className="text-sm text-blue-700">Média</div>
        </div>
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.mode}</div>
          <div className="text-sm text-green-700">Moda</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.min}</div>
          <div className="text-sm text-yellow-700">Menor</div>
        </div>
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.max}</div>
          <div className="text-sm text-red-700">Maior</div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Votos dos Participantes:
        </h4>
        
        <div className="grid gap-3">
          {votes.map((vote) => (
            <div
              key={vote.playerId}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center">
                <div className="text-2xl mr-3">👤</div>
                <div>
                  <div className="font-medium text-gray-900">{vote.playerName}</div>
                  <div className="text-sm text-gray-600">
                    Votou em: {getValueDescription(vote.value)}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-primary-600 bg-white px-3 py-1 rounded-lg border border-primary-200">
                {vote.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-2">
          💡 Recomendação:
        </h4>
        <p className="text-purple-800">
          Com base nos votos, a equipe pode considerar{' '}
          <strong>{getValueDescription(stats.mode)}</strong> como ponto de partida para discussão.
          Discuta as diferenças de opinião e cheguem a um consenso sobre a estimativa final.
        </p>
      </div>
    </div>
  );
}
