import { AccountsService } from '@modules/index.services';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BcryptUtil } from '@utils';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AccountsService) private readonly accountService: AccountsService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async validateCredentials(username: string, pass: string) {
    const account = await this.accountService.getOne({ username });
    if (account && (await BcryptUtil.verifyPassword(pass, account.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = account;
      return result;
    }
    return null;
  }

  async issueToken(account: any) {
    const payload = { ...account, sub: account._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
