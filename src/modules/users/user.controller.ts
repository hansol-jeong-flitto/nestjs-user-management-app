import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { User } from 'src/shared/entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '모든 사용자 조회' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: [User],
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 사용자 조회' })
  @ApiResponse({ status: 200, description: '성공', type: User })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '새로운 사용자 생성' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: '사용자가 성공적으로 생성됨',
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: '성공', type: User })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
