import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room, RoomStatus } from '../entities/room.entity';
import { Player } from '../entities/player.entity';
import { Vote } from '../entities/vote.entity';
import { CreateRoomDto } from '../dto/create-room.dto';
import { JoinRoomDto } from '../dto/join-room.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    this.logger.log(`Criando sala: ${createRoomDto.name} por usuário: ${createRoomDto.ownerId}`);
    
    const room = this.roomRepository.create({
      ...createRoomDto,
      id: uuidv4(),
      status: RoomStatus.WAITING,
    });

    const savedRoom = await this.roomRepository.save(room);
    this.logger.log(`Sala criada com sucesso: ${savedRoom.id}`);
    
    return savedRoom;
  }

  async getRoom(roomId: string): Promise<Room> {
    this.logger.log(`Buscando sala: ${roomId}`);
    
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['players', 'votes'],
    });

    if (!room) {
      this.logger.warn(`Sala não encontrada: ${roomId}`);
      throw new NotFoundException('Sala não encontrada');
    }

    return room;
  }

  async joinRoom(roomId: string, joinRoomDto: JoinRoomDto, socketId?: string): Promise<Player> {
    this.logger.log(`Jogador ${joinRoomDto.name} tentando entrar na sala: ${roomId}`);
    
    const room = await this.getRoom(roomId);
    
    if (room.players.length >= room.maxPlayers) {
      this.logger.warn(`Sala ${roomId} está cheia`);
      throw new BadRequestException('Sala está cheia');
    }

    // Verificar se o jogador já existe na sala
    const existingPlayer = await this.playerRepository.findOne({
      where: { roomId, name: joinRoomDto.name }
    });

    if (existingPlayer) {
      // Atualizar o socketId se for o mesmo jogador
      if (socketId) {
        existingPlayer.socketId = socketId;
        const updatedPlayer = await this.playerRepository.save(existingPlayer);
        this.logger.log(`Jogador ${updatedPlayer.name} reconectou na sala ${roomId}`);
        return updatedPlayer;
      }
      return existingPlayer;
    }

    const player = this.playerRepository.create({
      id: joinRoomDto.playerId || uuidv4(), // Usar playerId específico se fornecido
      name: joinRoomDto.name,
      avatar: joinRoomDto.avatar,
      roomId,
      socketId: socketId || null,
    });

    const savedPlayer = await this.playerRepository.save(player);
    this.logger.log(`Jogador ${savedPlayer.name} entrou na sala ${roomId}`);
    
    return savedPlayer;
  }

  async startVoting(roomId: string, ownerId: string): Promise<Room> {
    this.logger.log(`Iniciando votação na sala: ${roomId} por usuário: ${ownerId}`);
    
    const room = await this.getRoom(roomId);
    
    if (room.ownerId !== ownerId) {
      this.logger.warn(`Usuário ${ownerId} não é dono da sala ${roomId}`);
      throw new BadRequestException('Apenas o dono da sala pode iniciar a votação');
    }

    if (room.status !== RoomStatus.WAITING && room.status !== RoomStatus.REVEALED) {
      this.logger.warn(`Sala ${roomId} não está no estado correto para iniciar votação`);
      throw new BadRequestException('Sala não está no estado correto para iniciar votação');
    }

    room.status = RoomStatus.VOTING;
    const updatedRoom = await this.roomRepository.save(room);
    
    this.logger.log(`Votação iniciada na sala: ${roomId}`);
    return updatedRoom;
  }

  async submitVote(roomId: string, playerId: string, voteValue: number): Promise<Vote> {
    this.logger.log(`Jogador ${playerId} votando ${voteValue} na sala: ${roomId}`);
    
    const room = await this.getRoom(roomId);
    
    if (room.status !== RoomStatus.VOTING) {
      this.logger.warn(`Sala ${roomId} não está em votação`);
      throw new BadRequestException('Sala não está em votação');
    }

    // Verificar se o jogador já votou
    const existingVote = await this.voteRepository.findOne({
      where: { roomId, playerId },
    });

    if (existingVote) {
      this.logger.warn(`Jogador ${playerId} já votou na sala ${roomId}`);
      throw new BadRequestException('Jogador já votou');
    }

    const vote = this.voteRepository.create({
      id: uuidv4(),
      roomId,
      playerId,
      value: voteValue,
    });

    const savedVote = await this.voteRepository.save(vote);
    this.logger.log(`Voto registrado: ${savedVote.id}`);
    
    return savedVote;
  }

  async revealVotes(roomId: string, ownerId: string): Promise<Room> {
    this.logger.log(`Revelando votos na sala: ${roomId} por usuário: ${ownerId}`);
    
    const room = await this.getRoom(roomId);
    
    if (room.ownerId !== ownerId) {
      this.logger.warn(`Usuário ${ownerId} não é dono da sala ${roomId}`);
      throw new BadRequestException('Apenas o dono da sala pode revelar os votos');
    }

    if (room.status !== RoomStatus.VOTING) {
      this.logger.warn(`Sala ${roomId} não está em votação`);
      throw new BadRequestException('Sala não está em votação');
    }

    room.status = RoomStatus.REVEALED;
    const updatedRoom = await this.roomRepository.save(room);
    
    this.logger.log(`Votos revelados na sala: ${roomId}`);
    return updatedRoom;
  }

  async resetVoting(roomId: string, ownerId: string): Promise<Room> {
    this.logger.log(`Reiniciando votação na sala: ${roomId} por usuário: ${ownerId}`);
    
    const room = await this.getRoom(roomId);
    
    if (room.ownerId !== ownerId) {
      this.logger.warn(`Usuário ${ownerId} não é dono da sala ${roomId}`);
      throw new BadRequestException('Apenas o dono da sala pode reiniciar a votação');
    }

    // Limpar votos
    await this.voteRepository.delete({ roomId });
    
    room.status = RoomStatus.WAITING;
    const updatedRoom = await this.roomRepository.save(room);
    
    this.logger.log(`Votação reiniciada na sala: ${roomId}`);
    return updatedRoom;
  }

  async getRoomVotes(roomId: string): Promise<Vote[]> {
    this.logger.log(`Buscando votos da sala: ${roomId}`);
    
    return await this.voteRepository.find({
      where: { roomId },
      relations: ['player'],
    });
  }

  async updatePlayerSocketId(playerId: string, socketId: string): Promise<Player> {
    this.logger.log(`Atualizando socketId do jogador: ${playerId}`);
    
    const player = await this.playerRepository.findOne({
      where: { id: playerId }
    });

    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }

    player.socketId = socketId;
    return await this.playerRepository.save(player);
  }

  async removePlayerFromRoom(playerId: string): Promise<void> {
    this.logger.log(`Removendo jogador da sala: ${playerId}`);
    
    const player = await this.playerRepository.findOne({
      where: { id: playerId }
    });

    if (player) {
      await this.playerRepository.remove(player);
      this.logger.log(`Jogador ${player.name} removido da sala`);
    }
  }
}
