import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Room } from './room.entity';
import { Player } from './player.entity';

export enum VoteValue {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FIVE = 5,
  EIGHT = 8,
  THIRTEEN = 13
}

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: VoteValue })
  value: VoteValue;

  @Column()
  roomId: string;

  @Column()
  playerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Room, room => room.votes)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'playerId' })
  player: Player;
}
