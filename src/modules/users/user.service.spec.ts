import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/shared/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const mockRepositoryProvider = {
  provide: getRepositoryToken(User),
  useValue: {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;
  let repository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, mockRepositoryProvider],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const now = new Date();
  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
    created_at: now,
    updated_at: now,
  };

  describe('create()', () => {
    it('should successfully create and save a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        user_group_id: 1,
      };

      repository.create?.mockReturnValue(mockUser);
      repository.save?.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      repository.find?.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne()', () => {
    it('should return a single user when found', async () => {
      repository.findOneBy?.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      repository.findOneBy?.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(
        new NotFoundException('User with id 99 not found'),
      );
    });
  });

  describe('update()', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const preloadedUser = { ...mockUser, ...updateUserDto };

      repository.preload?.mockResolvedValue(preloadedUser);
      repository.save?.mockResolvedValue(preloadedUser);

      const result = await service.update(1, updateUserDto);

      expect(repository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateUserDto,
      });
      expect(repository.save).toHaveBeenCalledWith(preloadedUser);
      expect(result).toEqual(preloadedUser);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      repository.preload?.mockResolvedValue(null);

      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        new NotFoundException('User with id 1 not found'),
      );
    });
  });

  describe('remove()', () => {
    it('should remove a user successfully', async () => {
      repository.delete?.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user to remove is not found', async () => {
      repository.delete?.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(
        new NotFoundException('User with id 1 not found'),
      );
    });
  });
});
