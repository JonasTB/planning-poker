import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Player } from './player.entity';
import { Vote } from './vote.entity';

export enum RoomStatus {
  WAITING = 'waiting',
  VOTING = 'voting',
  REVEALED = 'revealed'
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: RoomStatus, default: RoomStatus.WAITING })
  status: RoomStatus;

  @Column()
  ownerId: string;

  @Column({ default: 10 })
  maxPlayers: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Player, player => player.room)
  players: Player[];

  @OneToMany(() => Vote, vote => vote.room)
  votes: Vote[];
}
