import { Repository, ObjectLiteral } from 'typeorm';
import { UserGroupService } from './user-group.service';
import { UserGroup } from 'src/shared/entities/user-group.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';

type MockRepository<T extends ObjectLiteral> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral,
>(): MockRepository<T> => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('UserGroupService', () => {
  let service: UserGroupService;
  let repository: MockRepository<UserGroup>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserGroupService,
        {
          provide: getRepositoryToken(UserGroup),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UserGroupService>(UserGroupService);
    repository = module.get<MockRepository<UserGroup>>(
      getRepositoryToken(UserGroup),
    );
  });

  // service 생성 여부 확인
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // findAll
  describe('findAll', () => {
    it('should return an array of user groups', async () => {
      // Arrange
      const expectedUserGroups = [
        {
          id: 1,
          name: 'Admin',
          description: '관리자 그룹',
          users: [],
        },
        {
          id: 2,
          name: 'Users',
          description: '일반 사용자',
          users: [],
        },
      ];

      repository.find?.mockResolvedValue(expectedUserGroups);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(expectedUserGroups);
    });
  });

  // findOne
  describe('findOne', () => {
    it('should return a single user group', async () => {
      // Arrange
      const expectedUserGroups = {
        id: 1,
        name: 'Admin',
        description: '관리자 그룹',
        users: [],
      };

      repository.findOneBy?.mockResolvedValue(expectedUserGroups);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(result).toEqual(expectedUserGroups);
    });

    it('should throw NotFoundException when user group not found', async () => {
      // Arrange
      repository.findOneBy?.mockResolvedValue(null);

      // Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // create
  describe('create', () => {
    it('should create and return a user group', async () => {
      // Arrange
      const createDto = {
        name: 'New Group',
        description: 'New Description',
      };

      const createdUserGroup = {
        id: 1,
        ...createDto,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create?.mockReturnValue(createdUserGroup);
      repository.save?.mockResolvedValue(createdUserGroup);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(createdUserGroup);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(createdUserGroup);
    });
  });

  // update
  describe('update', () => {
    const userGroupId = 1;
    const existingUserGroup = {
      id: userGroupId,
      name: 'Existing Group',
      description: 'Original Description',
      users: [],
    };

    it('should update a user group and return the updated group', async () => {
      const updateDto: UpdateUserGroupDto = {
        name: 'Updated Group Name',
      };
      const updatedUserGroup = { ...existingUserGroup, ...updateDto };

      repository.findOneBy?.mockResolvedValueOnce(existingUserGroup); // 첫 findOne (존재 확인)
      repository.update?.mockResolvedValue({ affected: 1 }); // repository.update 호출
      repository.findOneBy?.mockResolvedValueOnce(updatedUserGroup); // 두 번째 findOne (업데이트 후 조회)

      const result = await service.update(userGroupId, updateDto);

      expect(result).toEqual(updatedUserGroup);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: userGroupId }); // 첫 번째 호출
      expect(repository.update).toHaveBeenCalledWith(userGroupId, updateDto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: userGroupId }); // 두 번째 호출
    });

    it('should throw NotFoundException if user group to update not found', async () => {
      repository.findOneBy?.mockResolvedValue(null); // findOne이 null 반환

      await expect(
        service.update(999, { name: 'Non Existent Group' }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(repository.update).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  // remove
  describe('remove', () => {
    const userGroupId = 1;
    const existingUserGroup = {
      id: userGroupId,
      name: 'Existing Group',
      description: 'Original Description',
      users: [],
    };

    it('should successfully remove a user group', async () => {
      repository.findOneBy?.mockResolvedValue(existingUserGroup); // findOne (존재 확인)
      repository.remove?.mockResolvedValue(undefined); // repository.remove 호출

      await service.remove(userGroupId);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: userGroupId });
      expect(repository.remove).toHaveBeenCalledWith(existingUserGroup);
    });

    it('should throw NotFoundException if user group to remove not found', async () => {
      repository.findOneBy?.mockResolvedValue(null); // findOne이 null 반환

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
