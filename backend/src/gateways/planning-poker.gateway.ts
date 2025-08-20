import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../services/room.service';
import { VoteDto } from '../dto/vote.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PlanningPokerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PlanningPokerGateway.name);

  constructor(private readonly roomService: RoomService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; playerName: string; avatar?: string; playerId?: string },
  ) {
    try {
      this.logger.log(`Jogador ${data.playerName} tentando entrar na sala: ${data.roomId}`);
      
      const player = await this.roomService.joinRoom(
        data.roomId,
        { name: data.playerName, avatar: data.avatar },
        client.id,
      );

      client.join(data.roomId);

      const room = await this.roomService.getRoom(data.roomId);

      this.server.to(data.roomId).emit('playerJoined', {
        player: {
          id: player.id,
          name: player.name,
          avatar: player.avatar,
        },
        room: {
          id: room.id,
          name: room.name,
          status: room.status,
          ownerId: room.ownerId,
          maxPlayers: room.maxPlayers,
          players: room.players,
        },
      });

      client.emit('joinedRoom', {
        success: true,
        player,
        room: {
          id: room.id,
          name: room.name,
          status: room.status,
          ownerId: room.ownerId,
          maxPlayers: room.maxPlayers,
          players: room.players,
        },
        message: 'Entrou na sala com sucesso',
      });

      this.logger.log(`Jogador ${player.name} entrou na sala ${data.roomId}`);
    } catch (error) {
      this.logger.error(`Erro ao entrar na sala: ${error.message}`);
      client.emit('joinedRoom', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('startVoting')
  async handleStartVoting(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; ownerId: string },
  ) {
    try {
      this.logger.log(`Iniciando votação na sala: ${data.roomId} por usuário: ${data.ownerId}`);
      
      const room = await this.roomService.startVoting(data.roomId, data.ownerId);

      const updatedRoom = await this.roomService.getRoom(data.roomId);

      this.server.to(data.roomId).emit('votingStarted', {
        roomId: updatedRoom.id,
        status: updatedRoom.status,
        room: updatedRoom,
        message: 'Votação iniciada! Escolha sua carta.',
      });

      this.logger.log(`Votação iniciada na sala ${data.roomId}`);
    } catch (error) {
      this.logger.error(`Erro ao iniciar votação: ${error.message}`);
      client.emit('votingStarted', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('submitVote')
  async handleSubmitVote(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; playerId: string; vote: VoteDto },
  ) {
    try {
      this.logger.log(`Jogador ${data.playerId} votando ${data.vote.value} na sala: ${data.roomId}`);
      
      const vote = await this.roomService.submitVote(
        data.roomId,
        data.playerId,
        data.vote.value,
      );

      client.emit('voteSubmitted', {
        success: true,
        message: 'Voto registrado com sucesso',
        vote: {
          id: vote.id,
          value: vote.value,
        },
      });

      client.to(data.roomId).emit('playerVoted', {
        playerId: data.playerId,
        message: 'Um jogador votou',
      });

      this.logger.log(`Voto registrado: ${vote.id}`);
    } catch (error) {
      this.logger.error(`Erro ao registrar voto: ${error.message}`);
      client.emit('voteSubmitted', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('revealVotes')
  async handleRevealVotes(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; ownerId: string },
  ) {
    try {
      this.logger.log(`Revelando votos na sala: ${data.roomId}`);
      
      const room = await this.roomService.revealVotes(data.roomId, data.ownerId);
      const votes = await this.roomService.getRoomVotes(data.roomId);

      this.server.to(data.roomId).emit('votesRevealed', {
        roomId: room.id,
        status: room.status,
        votes: votes.map(vote => ({
          playerId: vote.playerId,
          playerName: vote.player.name,
          value: vote.value,
        })),
        message: 'Votos revelados!',
      });

      this.logger.log(`Votos revelados na sala ${data.roomId}`);
    } catch (error) {
      this.logger.error(`Erro ao revelar votos: ${error.message}`);
      client.emit('votesRevealed', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('resetVoting')
  async handleResetVoting(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; ownerId: string },
  ) {
    try {
      this.logger.log(`Reiniciando votação na sala: ${data.roomId}`);
      
      const room = await this.roomService.resetVoting(data.roomId, data.ownerId);

      this.server.to(data.roomId).emit('votingReset', {
        roomId: room.id,
        status: room.status,
        message: 'Votação reiniciada!',
      });

      this.logger.log(`Votação reiniciada na sala ${data.roomId}`);
    } catch (error) {
      this.logger.error(`Erro ao reiniciar votação: ${error.message}`);
      client.emit('votingReset', {
        success: false,
        message: error.message,
      });
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; playerId: string },
  ) {
    this.logger.log(`Jogador ${data.playerId} saindo da sala: ${data.roomId}`);
    
    try {
      await this.roomService.removePlayerFromRoom(data.playerId);
      
      client.leave(data.roomId);
      
      const room = await this.roomService.getRoom(data.roomId);
      
      client.to(data.roomId).emit('playerLeft', {
        playerId: data.playerId,
        room: {
          id: room.id,
          name: room.name,
          status: room.status,
          ownerId: room.ownerId,
          maxPlayers: room.maxPlayers,
          players: room.players,
        },
        message: 'Um jogador saiu da sala',
      });

      this.logger.log(`Jogador ${data.playerId} saiu da sala ${data.roomId}`);
    } catch (error) {
      this.logger.error(`Erro ao remover jogador da sala: ${error.message}`);
    }
  }
}
