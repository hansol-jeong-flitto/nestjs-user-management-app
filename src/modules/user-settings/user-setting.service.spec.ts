import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserSettingService } from './user-setting.service';
import { UserSetting } from 'src/shared/entities/user-setting.entity';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const mockRepositoryProvider = {
  provide: getRepositoryToken(UserSetting),
  useValue: {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UserSettingService', () => {
  let service: UserSettingService;
  let repository: MockRepository<UserSetting>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSettingService, mockRepositoryProvider],
    }).compile();

    service = module.get<UserSettingService>(UserSettingService);
    repository = module.get<MockRepository<UserSetting>>(
      getRepositoryToken(UserSetting),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const now = new Date();
  const mockUserSetting: UserSetting = {
    id: 1,
    user_id: 1,
    language: 'en',
    email_notification: true,
    created_at: now,
    updated_at: now,
  };

  describe('create()', () => {
    const createUserSettingDto: CreateUserSettingDto = {
      user_id: 1,
      language: 'en',
      email_notification: true,
    };

    it('should create a user setting successfully', async () => {
      repository.findOneBy?.mockResolvedValue(null);
      repository.create?.mockReturnValue(mockUserSetting);
      repository.save?.mockResolvedValue(mockUserSetting);

      const result = await service.create(createUserSettingDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({
        user_id: createUserSettingDto.user_id,
      });
      expect(repository.create).toHaveBeenCalledWith(createUserSettingDto);
      expect(repository.save).toHaveBeenCalledWith(mockUserSetting);
      expect(result).toEqual(mockUserSetting);
    });

    it('should throw ConflictException if setting for user already exists', async () => {
      repository.findOneBy?.mockResolvedValue(mockUserSetting);

      await expect(service.create(createUserSettingDto)).rejects.toThrow(
        new ConflictException(
          `UserSetting for user_id ${createUserSettingDto.user_id} already exists`,
        ),
      );
    });
  });

  describe('findOne()', () => {
    it('should return a single user setting when found by id', async () => {
      repository.findOneBy?.mockResolvedValue(mockUserSetting);
      const result = await service.findOne(1);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUserSetting);
    });

    it('should throw NotFoundException if setting is not found by id', async () => {
      repository.findOneBy?.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(
        new NotFoundException('UserSetting with id 99 not found'),
      );
    });
  });

  describe('findByUserId()', () => {
    it('should return a single user setting when found by user_id', async () => {
      repository.findOneBy?.mockResolvedValue(mockUserSetting);
      const result = await service.findByUserId(1);
      expect(repository.findOneBy).toHaveBeenCalledWith({ user_id: 1 });
      expect(result).toEqual(mockUserSetting);
    });

    it('should throw NotFoundException if setting is not found by user_id', async () => {
      repository.findOneBy?.mockResolvedValue(null);
      await expect(service.findByUserId(99)).rejects.toThrow(
        new NotFoundException('UserSetting with user_id 99 not found'),
      );
    });
  });

  describe('update()', () => {
    const updateUserSettingDto: UpdateUserSettingDto = { language: 'de' };

    it('should update a user setting successfully', async () => {
      const preloadedSetting = { ...mockUserSetting, ...updateUserSettingDto };
      repository.preload?.mockResolvedValue(preloadedSetting);
      repository.save?.mockResolvedValue(preloadedSetting);

      const result = await service.update(1, updateUserSettingDto);

      expect(repository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateUserSettingDto,
      });
      expect(repository.save).toHaveBeenCalledWith(preloadedSetting);
      expect(result).toEqual(preloadedSetting);
    });

    it('should throw NotFoundException if setting to update is not found', async () => {
      repository.preload?.mockResolvedValue(null);
      await expect(service.update(1, updateUserSettingDto)).rejects.toThrow(
        new NotFoundException('UserSetting with id 1 not found'),
      );
    });
  });

  describe('remove()', () => {
    it('should remove a user setting successfully', async () => {
      repository.delete?.mockResolvedValue({ affected: 1 });
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if setting to remove is not found', async () => {
      repository.delete?.mockResolvedValue({ affected: 0 });
      await expect(service.remove(1)).rejects.toThrow(
        new NotFoundException('UserSetting with id 1 not found'),
      );
    });
  });
});
