import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(token: string) {
    const session = await this.authService.findSession(token);

    if (session?.expireAt && session.expireAt < new Date()) {
      throw new UnauthorizedException('User khong hop le');
    }

    if (!session?.user) {
      throw new UnauthorizedException('User khong hop le');
    }

    return session?.user;
  }
}
