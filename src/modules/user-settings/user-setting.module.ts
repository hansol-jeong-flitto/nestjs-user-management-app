import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSetting } from '../../shared/entities/user-setting.entity';
import { UserSettingService } from './user-setting.service';
import { UserSettingController } from './user-setting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSetting])],
  controllers: [UserSettingController],
  providers: [UserSettingService],
  exports: [UserSettingService],
})
export class UserSettingModule {}
