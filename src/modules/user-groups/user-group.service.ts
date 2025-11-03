import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroup } from 'src/shared/entities/user-group.entity';
import { Repository } from 'typeorm';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private userGroupRepository: Repository<UserGroup>,
  ) {}

  // 전체 조회
  async findAll(): Promise<UserGroup[]> {
    return this.userGroupRepository.find();
  }

  // 단일 조회
  async findOne(id: number): Promise<UserGroup> {
    const userGroup = await this.userGroupRepository.findOneBy({ id });

    if (!userGroup) {
      throw new NotFoundException(`UserGroup with id ${id} not found`);
    }

    return userGroup;
  }

  // 생성
  async create(createUserGroupDto: CreateUserGroupDto): Promise<UserGroup> {
    const userGroup = this.userGroupRepository.create(createUserGroupDto);
    return this.userGroupRepository.save(userGroup);
  }

  // 수정
  async update(
    id: number,
    updateUserGroupDto: UpdateUserGroupDto,
  ): Promise<UserGroup> {
    await this.findOne(id);
    await this.userGroupRepository.update(id, updateUserGroupDto);
    return this.findOne(id); // TODO: update 결과값을 활용하는 방법을 찾아서 대체하면 쿼리 실행 횟수를 줄일 수 있음
  }

  // 삭제
  async remove(id: number): Promise<void> {
    const userGroup = await this.findOne(id);
    await this.userGroupRepository.remove(userGroup);
  }
}
