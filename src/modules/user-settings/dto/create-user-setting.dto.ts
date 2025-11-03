import { IsString, IsBoolean, IsInt } from 'class-validator';

export class CreateUserSettingDto {
  @IsInt()
  user_id: number;

  @IsString()
  language: string;

  @IsBoolean()
  email_notification: boolean;
}
