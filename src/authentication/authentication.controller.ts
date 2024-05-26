
import { Body, Req,Res, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from "src/user/dto/createUser.dto";
import RequestWithUser from './requestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import LoginDto from 'src/user/dto/login.dto';
import { ApiBody } from '@nestjs/swagger';

 
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}
 
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }
 
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async logIn(@Req() request: RequestWithUser ) {

 
  const {user} = request;
  const {token} = this.authenticationService.getCookieWithJwtToken(user.id);
  user.password = undefined;

  
  return {user,token}

  }
}
