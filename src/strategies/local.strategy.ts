import { AuthService } from '@modules/index.services';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const account = await this.authService.validateCredentials(
      username,
      password,
    );
    if (!account) {
      throw new UnauthorizedException();
    }
    return account;
  }
}
