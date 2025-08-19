import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Nome da sala', example: 'Sprint 23 Planning' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID do dono da sala', example: 'uuid-do-dono' })
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({ description: 'Número máximo de jogadores', example: 10, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(10)
  maxPlayers?: number;
}
