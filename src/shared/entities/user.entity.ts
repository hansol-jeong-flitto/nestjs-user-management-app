import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserGroup } from './user-group.entity';
import { UserSetting } from './user-setting.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => UserGroup, (user_group) => user_group.users)
  @JoinColumn({ name: 'user_group_id' })
  user_group: UserGroup;

  @OneToOne(() => UserSetting, (user_setting) => user_setting.user)
  user_setting: UserSetting;
}
