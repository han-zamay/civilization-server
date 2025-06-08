import { IsDefined, IsEmail, IsString, ValidateIf } from "class-validator";
import { OnlyOneProperty } from "./OnlyOneProperty";

export class ValidateUserDto {
    @ValidateIf(o => !o.email)
    @IsString()
    username?: string;

    @ValidateIf(o => !o.username)
    @IsEmail()
    email?: string;

    @IsDefined()
    @IsString()
    password: string;

    @OnlyOneProperty('username', 'email', { message: 'Provide either username or email, but not both.' })
    dummyProperty: any; // This property is just a placeholder for the class-level validator
}