import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [NatsModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
