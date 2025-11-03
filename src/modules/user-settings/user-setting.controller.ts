import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserSettingService } from './user-setting.service';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';

@Controller('user-settings')
export class UserSettingController {
  constructor(private readonly userSettingService: UserSettingService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userSettingService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: number) {
    return this.userSettingService.findByUserId(userId);
  }

  @Post()
  create(@Body() createUserSettingDto: CreateUserSettingDto) {
    return this.userSettingService.create(createUserSettingDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserSettingDto: UpdateUserSettingDto,
  ) {
    return this.userSettingService.update(id, updateUserSettingDto);
  }
}
