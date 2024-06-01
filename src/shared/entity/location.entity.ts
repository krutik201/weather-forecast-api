// src/locations/entities/location.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity()
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'float', name: 'latitude' })
  latitude: number;

  @Column({ type: 'float', name: 'longitude' })
  longitude: number;

  @Column({ default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column('uuid', { name: 'created_by', nullable: true })
  createdBy: string | null;

  @Column('uuid', { name: 'updated_by', nullable: true })
  updatedBy: string | null;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at',
  })
  updatedAt: Date;
}
