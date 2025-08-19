import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomController } from './controllers/room.controller';
import { RoomService } from './services/room.service';
import { PlanningPokerGateway } from './gateways/planning-poker.gateway';
import { Room } from './entities/room.entity';
import { Player } from './entities/player.entity';
import { Vote } from './entities/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'planning_poker',
      entities: [Room, Player, Vote],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Room, Player, Vote]),
  ],
  controllers: [RoomController],
  providers: [RoomService, PlanningPokerGateway],
})
export class AppModule {}
