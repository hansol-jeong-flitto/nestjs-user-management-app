import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  @IsString()
  name: string;

  @ApiProperty({ description: '사용자 비밀번호', example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ description: '사용자 그룹 ID', example: 1 })
  @IsInt()
  user_group_id: number;
}
