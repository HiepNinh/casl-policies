import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountDto } from '@dtos';
import { CheckPolicies, Serialize } from '@decorators';

@Serialize(AccountDto.Read)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Post()
  async register(@Body() accountData: AccountDto.Create) {
    return await this.accountService.register(accountData);
  }

  @CheckPolicies({ action: 'delete', subject: 'Account' })
  @Get(':accountId')
  async getById(@Param('accountId') id: string) {
    return await this.accountService.getById(id);
  }

  @Get()
  async getAll() {
    return await this.accountService.getAll();
  }
}
