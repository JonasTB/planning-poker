'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import VotingTable from '../../../components/VotingTable';
import PlayerList from '../../../components/PlayerList';
import VoteCards from '../../../components/VoteCards';
import VoteResults from '../../../components/VoteResults';

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

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const playerId = searchParams.get('playerId');
  const playerName = searchParams.get('playerName');

  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState('');

  // Verificação direta de dono da sala
  const isRoomOwner = room?.ownerId === playerId;

  useEffect(() => {
    if (!roomId || !playerId || !playerName) {
      setError('Parâmetros inválidos');
      return;
    }

    // Conectar ao WebSocket
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Carregar informações da sala
    loadRoomInfo();

         // Eventos do WebSocket
     newSocket.on('connect', () => {
       // Atualizar socketId do jogador no backend
       if (playerId) {
         fetch(`/api/rooms/${roomId}/players/${playerId}/socket`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ socketId: newSocket.id }),
         }).catch(console.error);
       }
       
       // Só emitir joinRoom se não estivermos já na sala
       if (!room) {
         newSocket.emit('joinRoom', {
           roomId,
           playerName,
         });
       }
     });

         newSocket.on('joinedRoom', (data) => {
       if (data.success) {
         // Atualizar dados da sala e jogadores
         if (data.room) {
           setRoom(data.room);
           setPlayers(data.room.players || []);
           const ownerCheck = data.room.ownerId === playerId;
           setIsOwner(ownerCheck);
         }
       } else {
         setError(data.message);
       }
     });

     newSocket.on('playerJoined', (data) => {
       // Atualizar jogadores e dados da sala
       if (data.room) {
         setRoom(data.room);
         setPlayers(data.room.players || []);
       }
     });

    newSocket.on('playerLeft', (data) => {
      // Atualizar jogadores e dados da sala
      if (data.room) {
        setRoom(data.room);
        setPlayers(data.room.players || []);
      } else {
        // Fallback: remover apenas o jogador
        setPlayers(prev => prev.filter(p => p.id !== data.playerId));
      }
    });

       newSocket.on('votingStarted', (data) => {
       if (data.room) {
         setRoom(data.room);
         setPlayers(data.room.players || []);
       } else {
         setRoom(prev => prev ? { ...prev, status: data.status } : null);
       }
       setVotes([]);
       setHasVoted(false);
     });

    newSocket.on('votesRevealed', (data) => {
      setRoom(prev => prev ? { ...prev, status: data.status } : null);
      setVotes(data.votes);
    });

    newSocket.on('votingReset', (data) => {
      setRoom(prev => prev ? { ...prev, status: data.status } : null);
      setVotes([]);
      setHasVoted(false);
    });

    return () => {
      newSocket.close();
    };
  }, [roomId, playerId, playerName]);



  const handleStartVoting = () => {
    if (socket && isRoomOwner) {
      socket.emit('startVoting', { roomId, ownerId: playerId });
    } else {
    }
  };

  const handleVote = (voteValue: number) => {
    if (socket && room?.status === 'voting') {
      socket.emit('submitVote', {
        roomId,
        playerId,
        vote: { value: voteValue },
      });
      setHasVoted(true);
    } else {
    }
  };

  const handleRevealVotes = () => {
    if (socket && isRoomOwner) {
      socket.emit('revealVotes', { roomId, ownerId: playerId });
    } else {
    }
  };

  const handleResetVoting = () => {
    if (socket && isRoomOwner) {
      socket.emit('resetVoting', { roomId, ownerId: playerId });
    } else {
    }
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit('leaveRoom', { roomId, playerId });
    }
    // Sempre redirecionar, mesmo se não houver socket
    window.location.href = '/';
  };

  const loadRoomInfo = useCallback(async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar informações da sala');
      }
      
      const roomData = await response.json();
      setRoom(roomData);
      setPlayers(roomData.players || []);
      setIsOwner(roomData.ownerId === playerId);
    } catch (error) {
      console.error('Erro ao carregar sala:', error);
      setError('Erro ao carregar informações da sala');
    }
  }, [roomId, playerId]);

  if (error) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          type="button"
          onClick={() => window.location.href = '/'}
          className="btn-primary"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Carregando sala...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header da Sala */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
            <p className="text-gray-600">
              Status: <span className="font-medium">{room.status}</span> | 
              Jogadores: {players.length}/{room.maxPlayers}
            </p>
          </div>
          <div className="flex gap-3">
            {/* Debug: Mostrar informações na tela */}
            <div className="text-xs text-gray-500 mr-4">
              Owner: {room?.ownerId} | Player: {playerId} | IsOwner: {String(isRoomOwner)} | Status: {room?.status}
            </div>
            
            {isRoomOwner && room.status === 'waiting' && (
              <button
                type="button"
                onClick={handleStartVoting}
                className="btn-primary"
              >
                🚀 Iniciar Planning
              </button>
            )}
            
            {isRoomOwner && room.status === 'voting' && (
              <button
                type="button"
                onClick={handleRevealVotes}
                className="btn-primary"
              >
                👁️ Mostrar Votação
              </button>
            )}
            {isRoomOwner && room.status === 'revealed' && (
              <button
                type="button"
                onClick={handleResetVoting}
                className="btn-secondary"
              >
                🔄 Reiniciar
              </button>
            )}
            <button
              type="button"
              onClick={handleLeaveRoom}
              className="btn-danger"
            >
              🚪 Sair
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mesa de Votação */}
        <div className="lg:col-span-2">
          <VotingTable
            room={room}
            players={players}
            votes={votes}
            isOwner={isRoomOwner}
            hasVoted={hasVoted}
            onVote={handleVote}
          />
        </div>

        {/* Lista de Jogadores */}
        <div>
          <PlayerList players={players} currentPlayerId={playerId} />
        </div>
      </div>

      {/* Cartas de Votação */}
      {room.status === 'voting' && (
        <div className="mt-8">
          <VoteCards
            onVote={handleVote}
            hasVoted={hasVoted}
          />
        </div>
      )}

      {/* Resultados da Votação */}
      {room.status === 'revealed' && votes.length > 0 && (
        <div className="mt-8">
          <VoteResults votes={votes} />
        </div>
      )}
    </div>
  );
}
