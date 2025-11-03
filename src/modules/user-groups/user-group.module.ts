import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from 'src/shared/entities/user-group.entity';
import { UserGroupController } from './user-group.controller';
import { UserGroupService } from './user-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroup])],
  controllers: [UserGroupController],
  providers: [UserGroupService],
  exports: [UserGroupService],
})
export class UserGroupModule {}
