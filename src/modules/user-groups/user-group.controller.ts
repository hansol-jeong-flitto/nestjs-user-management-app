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
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { UserGroupService } from './user-group.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserGroup } from 'src/shared/entities/user-group.entity';

@ApiTags('user-groups')
@Controller('user-groups')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @Get()
  @ApiOperation({ summary: '모든 사용자 그룹 조회' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: [UserGroup],
  })
  findAll() {
    return this.userGroupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 사용자 그룹 조회' })
  @ApiResponse({ status: 200, description: '성공', type: UserGroup })
  @ApiResponse({ status: 404, description: '사용자 그룹을 찾을 수 없음' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userGroupService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '새로운 사용자 그룹 생성' })
  @ApiBody({ type: CreateUserGroupDto })
  @ApiResponse({
    status: 201,
    description: '사용자 그룹이 성공적으로 생성됨',
    type: UserGroup,
  })
  create(@Body() createUserGroupDto: CreateUserGroupDto) {
    return this.userGroupService.create(createUserGroupDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '사용자 그룹 정보 수정' })
  @ApiBody({ type: UpdateUserGroupDto })
  @ApiResponse({ status: 200, description: '성공', type: UserGroup })
  @ApiResponse({ status: 404, description: '사용자 그룹을 찾을 수 없음' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserGroupDto: UpdateUserGroupDto,
  ) {
    return this.userGroupService.update(id, updateUserGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 그룹 삭제' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '사용자 그룹을 찾을 수 없음' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userGroupService.remove(id);
  }
}
