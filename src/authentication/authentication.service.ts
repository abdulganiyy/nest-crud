import  * as bcrypt from "bcrypt"
import { UserService } from "src/user/user.service";
import RegisterDto from "src/user/dto/createUser.dto";
import { HttpStatus,HttpException,Injectable } from "@nestjs/common";
import {PostgresErrorCode} from "src/database/postgresErrorCodes.enum"
import { TokenPayload } from "./tokenPayload.interface";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthenticationService {
    constructor(
      private userService: UserService,
      private jwtService: JwtService,
      private configService: ConfigService
    ) {}
   
    public async register(registrationData: RegisterDto) {
      const hashedPassword = await bcrypt.hash(registrationData.password, 10);


      try {

        const createdUser = await this.userService.createUser({
          ...registrationData,
          password: hashedPassword
        });

        createdUser.password = undefined;
        return createdUser;
      } catch (error) {

        if (error?.code === PostgresErrorCode.UniqueViolation) {
          throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
        }
        throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
   
public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
   
  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_TOKEN'),
      expiresIn: `${this.configService.get(
        'JWT_EXPIRATION_TIME',
      )}`,
    });
    return {token,cookies:`Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`};
  }

  }