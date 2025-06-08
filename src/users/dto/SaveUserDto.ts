import { IsDefined, IsEmail, IsString } from "class-validator";

export class SaveUserDto {
    @IsDefined()
    @IsEmail()
    email: string;

    @IsDefined()
    @IsString()
    username: string;
    
    @IsDefined()
    @IsString()
    password: string;
}