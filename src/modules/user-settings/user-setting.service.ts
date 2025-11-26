import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSetting } from '../../shared/entities/user-setting.entity';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';

@Injectable()
export class UserSettingService {
  constructor(
    @InjectRepository(UserSetting)
    private readonly userSettingRepository: Repository<UserSetting>,
  ) {}

  async findOne(id: number): Promise<UserSetting> {
    const userSetting = await this.userSettingRepository.findOneBy({ id });

    if (!userSetting) {
      throw new NotFoundException(`UserSetting with id ${id} not found`);
    }

    return userSetting;
  }

  async findByUserId(user_id: number): Promise<UserSetting> {
    const userSetting = await this.userSettingRepository.findOneBy({
      user_id,
    });

    if (!userSetting) {
      throw new NotFoundException(
        `UserSetting with user_id ${user_id} not found`,
      );
    }

    return userSetting;
  }

  async create(
    createUserSettingDto: CreateUserSettingDto,
  ): Promise<UserSetting> {
    const existingUserSetting = await this.userSettingRepository.findOneBy({
      user_id: createUserSettingDto.user_id,
    });

    if (existingUserSetting) {
      throw new ConflictException(
        `UserSetting for user_id ${createUserSettingDto.user_id} already exists`,
      );
    }

    const userSetting = this.userSettingRepository.create(createUserSettingDto);
    return this.userSettingRepository.save(userSetting);
  }

  async update(
    id: number,
    updateUserSettingDto: UpdateUserSettingDto,
  ): Promise<UserSetting> {
    const userSetting = await this.userSettingRepository.preload({
      id,
      ...updateUserSettingDto,
    });

    if (!userSetting) {
      throw new NotFoundException(`UserSetting with id ${id} not found`);
    }

    return this.userSettingRepository.save(userSetting);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userSettingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`UserSetting with id ${id} not found`);
    }
  }
}
