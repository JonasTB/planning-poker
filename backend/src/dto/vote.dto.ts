import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { VoteValue } from '../entities/vote.entity';

export class VoteDto {
  @ApiProperty({ 
    description: 'Valor do voto. Valores disponíveis: 1 (4h), 2 (1d), 3 (1d 4h), 5 (2d 4h), 8 (3d 4h), 13 (1s)', 
    enum: VoteValue,
    example: VoteValue.EIGHT
  })
  @IsEnum(VoteValue)
  @IsNotEmpty()
  value: VoteValue;
}
