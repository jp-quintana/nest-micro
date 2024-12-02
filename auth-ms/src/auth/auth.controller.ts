import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  registerUser(payload: any) {
    return payload;
  }

  @MessagePattern('auth.login.user')
  loginUser(payload: any) {
    return payload;
  }

  @MessagePattern('auth.verify.user')
  verifyToken(payload: any) {
    return payload;
  }
}
