import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserSettingService } from './user-setting.service';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserSetting } from 'src/shared/entities/user-setting.entity';

@ApiTags('user-settings')
@Controller('user-settings')
export class UserSettingController {
  constructor(private readonly userSettingService: UserSettingService) {}

  @Get(':id')
  @ApiOperation({ summary: '특정 사용자 설정 조회' })
  @ApiResponse({ status: 200, description: '성공', type: UserSetting })
  @ApiResponse({ status: 404, description: '사용자 설정을 찾을 수 없음' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userSettingService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '사용자 ID로 사용자 설정 조회' })
  @ApiResponse({ status: 200, description: '성공', type: UserSetting })
  @ApiResponse({ status: 404, description: '사용자 설정을 찾을 수 없음' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.userSettingService.findByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: '새로운 사용자 설정 생성' })
  @ApiBody({ type: CreateUserSettingDto })
  @ApiResponse({
    status: 201,
    description: '사용자 설정이 성공적으로 생성됨',
    type: UserSetting,
  })
  create(@Body() createUserSettingDto: CreateUserSettingDto) {
    return this.userSettingService.create(createUserSettingDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '사용자 설정 정보 수정' })
  @ApiBody({ type: UpdateUserSettingDto })
  @ApiResponse({ status: 200, description: '성공', type: UserSetting })
  @ApiResponse({ status: 404, description: '사용자 설정을 찾을 수 없음' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserSettingDto: UpdateUserSettingDto,
  ) {
    return this.userSettingService.update(id, updateUserSettingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 설정 삭제' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '사용자 설정을 찾을 수 없음' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userSettingService.remove(id);
  }
}
