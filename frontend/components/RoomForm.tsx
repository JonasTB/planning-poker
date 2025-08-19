'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function RoomForm() {
  const [formData, setFormData] = useState({
    roomName: '',
    playerName: '',
    maxPlayers: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<{
    roomId: string;
    playerId: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const playerId = uuidv4(); // Um único ID para ser dono e jogador

      // Criar sala
      const roomResponse = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.roomName,
          ownerId: playerId, // Usar o mesmo ID como dono e jogador
          maxPlayers: formData.maxPlayers,
        }),
      });

      if (!roomResponse.ok) {
        throw new Error('Erro ao criar sala');
      }

      const room = await roomResponse.json();

      // Adicionar jogador à sala (com ID específico para ser o dono)
      const playerResponse = await fetch(`/api/rooms/${room.id}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.playerName,
          playerId: playerId, // Usar o mesmo ID
        }),
      });

      if (!playerResponse.ok) {
        const errorData = await playerResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao adicionar jogador');
      }

      const player = await playerResponse.json();

      setCreatedRoom({
        roomId: room.id,
        playerId: player.id,
      });
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar sala. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (createdRoom) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Sala criada com sucesso!
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 mb-2">
            <strong>ID da Sala:</strong> {createdRoom.roomId}
          </p>
          <p className="text-green-800">
            <strong>Seu ID:</strong> {createdRoom.playerId}
          </p>
        </div>
        <p className="text-gray-600 mb-6">
          Compartilhe o ID da sala com sua equipe para que possam entrar.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              setCreatedRoom(null);
              setFormData({ roomName: '', playerName: '', maxPlayers: 10 });
            }}
            className="btn-secondary"
          >
            Criar Nova Sala
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = `/room/${createdRoom.roomId}?playerId=${createdRoom.playerId}&playerName=${encodeURIComponent(formData.playerName)}`;
            }}
            className="btn-primary"
          >
            🚪 Entrar na Sala
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Sala
        </label>
        <input
          type="text"
          id="roomName"
          value={formData.roomName}
          onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
          className="input-field"
          placeholder="Ex: Sprint 23 Planning"
          required
        />
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
          placeholder="Ex: João Silva"
          required
        />
      </div>

      <div>
        <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-700 mb-2">
          Máximo de Jogadores
        </label>
        <select
          id="maxPlayers"
          value={formData.maxPlayers}
          onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
          className="input-field"
        >
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num} jogadores
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Criando...' : '🏠 Criar Sala'}
      </button>
    </form>
  );
}
