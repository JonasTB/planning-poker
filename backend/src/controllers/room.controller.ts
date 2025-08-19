import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { RoomService } from '../services/room.service';
import { CreateRoomDto } from '../dto/create-room.dto';
import { JoinRoomDto } from '../dto/join-room.dto';
import { VoteDto } from '../dto/vote.dto';

@ApiTags('Salas de Planejamento')
@Controller('rooms')
export class RoomController {
  private readonly logger = new Logger(RoomController.name);

  constructor(private readonly roomService: RoomService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova sala de planejamento' })
  @ApiResponse({
    status: 201,
    description: 'Sala criada com sucesso',
    schema: {
      example: {
        id: 'uuid-da-sala',
        name: 'Sprint 23 Planning',
        status: 'waiting',
        ownerId: 'uuid-do-dono',
        maxPlayers: 10,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    this.logger.log(`Criando sala: ${createRoomDto.name}`);
    return await this.roomService.createRoom(createRoomDto);
  }

  @Get(':roomId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obter informações de uma sala específica' })
  @ApiParam({
    name: 'roomId',
    description: 'ID da sala',
    example: 'uuid-da-sala',
  })
  @ApiResponse({
    status: 200,
    description: 'Informações da sala retornadas com sucesso',
    schema: {
      example: {
        id: 'uuid-da-sala',
        name: 'Sprint 23 Planning',
        status: 'waiting',
        ownerId: 'uuid-do-dono',
        maxPlayers: 10,
        players: [
          {
            id: 'uuid-do-jogador',
            name: 'João Silva',
            avatar: 'https://example.com/avatar.jpg',
          },
        ],
        votes: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Sala não encontrada',
  })
  async getRoom(@Param('roomId') roomId: string) {
    this.logger.log(`Buscando sala: ${roomId}`);
    return await this.roomService.getRoom(roomId);
  }

  @Post(':roomId/players')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar um jogador a uma sala' })
  @ApiParam({
    name: 'roomId',
    description: 'ID da sala',
    example: 'uuid-da-sala',
  })
  @ApiResponse({
    status: 201,
    description: 'Jogador adicionado com sucesso',
    schema: {
      example: {
        id: 'uuid-do-jogador',
        name: 'João Silva',
        avatar: 'https://example.com/avatar.jpg',
        roomId: 'uuid-da-sala',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Sala cheia ou dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Sala não encontrada',
  })
  async joinRoom(
    @Param('roomId') roomId: string,
    @Body() joinRoomDto: JoinRoomDto,
  ) {
    this.logger.log(`Jogador ${joinRoomDto.name} tentando entrar na sala: ${roomId}`);
    // Note: socketId será gerenciado pelo WebSocket quando o jogador conectar
    return await this.roomService.joinRoom(roomId, joinRoomDto);
  }

  @Post(':roomId/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar votação em uma sala' })
  @ApiParam({
    name: 'roomId',
    description: 'ID da sala',
    example: 'uuid-da-sala',
  })
  @ApiResponse({
    status: 200,
    description: 'Votação iniciada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Apenas o dono pode iniciar a votação ou sala não está no estado correto',
  })
  @ApiResponse({
    status: 404,
    description: 'Sala não encontrada',
  })
  async startVoting(
    @Param('roomId') roomId: string,
    @Body() body: { ownerId: string },
  ) {
    this.logger.log(`Iniciando votação na sala: ${roomId} por usuário: ${body.ownerId}`);
    return await this.roomService.startVoting(roomId, body.ownerId);
  }

  @Post(':roomId/vote')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar voto de um jogador' })
  @ApiParam({
    name: 'roomId',
    description: 'ID da sala',
    example: 'uuid-da-sala',
  })
  @ApiResponse({
    status: 201,
    description: 'Voto registrado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Sala não está em votação ou jogador já votou',
  })
  @ApiResponse({
    status: 404,
    description: 'Sala não encontrada',
  })
  async submitVote(
    @Param('roomId') roomId: string,
    @Body() body: { playerId: string; vote: VoteDto },
  ) {
    this.logger.log(`Jogador ${body.playerId} votando ${body.vote.value} na sala: ${roomId}`);
    return await this.roomService.submitVote(roomId, body.playerId, body.vote.value);
  }

  @Post(':roomId/reveal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revelar votos de uma sala' })
  @ApiParam({
    name: 'roomId',
    description: 'ID da sala',
    example: 'uuid-da-sala',
  })
  @ApiResponse({
    status: 200,
    description: 'Votos revelados com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Apenas o dono pode revelar os votos ou sala não está em votação',
  })
  @ApiResponse({
    status: 404,
    description: 'Sala não encontrada',
  })
  async revealVotes(
    @Param('roomId') roomId: string,
    @Body() body: { ownerId: string },
  ) {
    this.logger.log(`Revelando votos na sala: ${roomId} por usuário: ${body.ownerId}`);
    return await this.roomService.revealVotes(roomId, body.ownerId);
  }

  @Post(':roomId/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reiniciar votação em uma sala' })
  @ApiParam({
    name: 'roomId',
    description: 'ID da sala',
    example: 'uuid-da-sala',
  })
  @ApiResponse({
    status: 200,
    description: 'Votação reiniciada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Apenas o dono pode reiniciar a votação',
  })
  @ApiResponse({
    status: 404,
    description: 'Sala não encontrada',
  })
  async resetVoting(
    @Param('roomId') roomId: string,
    @Body() body: { ownerId: string },
  ) {
    this.logger.log(`Reiniciando votação na sala: ${roomId} por usuário: ${body.ownerId}`);
    return await this.roomService.resetVoting(roomId, body.ownerId);
  }

  @Get(':roomId/votes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obter votos de uma sala' })
  @ApiParam({
    name: 'roomId',
    description: 'ID da sala',
    example: 'uuid-da-sala',
  })
  @ApiResponse({
    status: 200,
    description: 'Votos retornados com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Sala não encontrada',
  })
  async getRoomVotes(@Param('roomId') roomId: string) {
    this.logger.log(`Buscando votos da sala: ${roomId}`);
    return await this.roomService.getRoomVotes(roomId);
  }

  @Post(':roomId/players/:playerId/socket')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar socketId de um jogador' })
  @ApiParam({
    name: 'roomId',
    description: 'ID da sala',
    example: 'uuid-da-sala',
  })
  @ApiParam({
    name: 'playerId',
    description: 'ID do jogador',
    example: 'uuid-do-jogador',
  })
  @ApiResponse({
    status: 200,
    description: 'SocketId atualizado com sucesso',
  })
  async updatePlayerSocket(
    @Param('roomId') roomId: string,
    @Param('playerId') playerId: string,
    @Body() body: { socketId: string },
  ) {
    this.logger.log(`Atualizando socketId do jogador ${playerId} na sala ${roomId}`);
    return await this.roomService.updatePlayerSocketId(playerId, body.socketId);
  }

  @Delete(':roomId/players/:playerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover jogador da sala' })
  @ApiParam({
    name: 'roomId',
    description: 'ID da sala',
    example: 'uuid-da-sala',
  })
  @ApiParam({
    name: 'playerId',
    description: 'ID do jogador',
    example: 'uuid-do-jogador',
  })
  @ApiResponse({
    status: 204,
    description: 'Jogador removido com sucesso',
  })
  async removePlayer(
    @Param('roomId') roomId: string,
    @Param('playerId') playerId: string,
  ) {
    this.logger.log(`Removendo jogador ${playerId} da sala ${roomId}`);
    await this.roomService.removePlayerFromRoom(playerId);
  }
}
