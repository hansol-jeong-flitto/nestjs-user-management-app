import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from './shared/entities/user-group.entity';
import { User } from './shared/entities/user.entity';
import { UserSetting } from './shared/entities/user-setting.entity';
import { UserGroupModule } from './modules/user-groups/user-group.module';
import { UserSettingModule } from './modules/user-settings/user-setting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserGroup, User, UserSetting],
      synchronize: true, // Auto-create database schema. Set to false in production.
    }),
    UserGroupModule,
    UserModule,
    UserSettingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
