import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaslModule } from './modules/casl/casl.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { UserGroupsModule } from './modules/user-groups/user-groups.module';
import { PoliciesModule } from './modules/policies/policies.module';

@Module({
  imports: [CaslModule, AccountsModule, UserGroupsModule, PoliciesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
