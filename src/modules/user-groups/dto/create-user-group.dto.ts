import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserGroupDto {
  @ApiProperty({ description: '사용자 그룹 이름', example: '관리자' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '사용자 그룹 설명',
    example: '시스템을 관리하는 그룹입니다.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
