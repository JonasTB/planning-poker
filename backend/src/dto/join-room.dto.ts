import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class JoinRoomDto {
  @ApiProperty({ description: 'Nome do jogador', example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Avatar do jogador (opcional)', example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: 'ID específico do jogador (opcional)', example: 'uuid-do-jogador', required: false })
  @IsOptional()
  @IsString()
  playerId?: string;
}
