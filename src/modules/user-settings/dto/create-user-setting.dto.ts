import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsInt } from 'class-validator';

export class CreateUserSettingDto {
  @ApiProperty({ description: '설정을 적용할 사용자 ID', example: 1 })
  @IsInt()
  user_id: number;

  @ApiProperty({ description: '사용자 언어 설정', example: 'ko' })
  @IsString()
  language: string;

  @ApiProperty({
    description: '이메일 알림 수신 여부',
    example: true,
  })
  @IsBoolean()
  email_notification: boolean;
}
