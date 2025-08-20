'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinRoomForm() {
  const [formData, setFormData] = useState({
    roomId: '',
    playerName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const roomResponse = await fetch(`/api/rooms/${formData.roomId}`);
      
      if (!roomResponse.ok) {
        throw new Error('Sala não encontrada');
      }

      const room = await roomResponse.json();

      const playerResponse = await fetch(`/api/rooms/${formData.roomId}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.playerName,
        }),
      });

      if (!playerResponse.ok) {
        const errorData = await playerResponse.json();
        throw new Error(errorData.message || 'Erro ao entrar na sala');
      }

      const player = await playerResponse.json();

      const existingPlayer = room.players.find((p: { id: string; name: string }) => p.name === formData.playerName);
      
      if (existingPlayer) {
        router.push(`/room/${formData.roomId}?playerId=${existingPlayer.id}&playerName=${encodeURIComponent(formData.playerName)}`);
      } else {
        router.push(`/room/${formData.roomId}?playerId=${player.id}&playerName=${encodeURIComponent(formData.playerName)}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      setError(error instanceof Error ? error.message : 'Erro ao entrar na sala');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
          ID da Sala
        </label>
        <input
          type="text"
          id="roomId"
          value={formData.roomId}
          onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
          className="input-field"
          placeholder="Cole o ID da sala aqui"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Peça o ID da sala para quem a criou
        </p>
      </div>

      <div>
        <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
          Seu Nome
        </label>
        <input
          type="text"
          id="playerName"
          value={formData.playerName}
          onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
          className="input-field"
          placeholder="Ex: Maria Santos"
          required
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Entrando...' : '🚪 Entrar na Sala'}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Não tem uma sala?{' '}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Crie uma nova sala
          </button>
        </p>
      </div>
    </form>
  );
}
