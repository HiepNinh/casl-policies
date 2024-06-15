import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AccountsModule,
  CaslModule,
  LoggerModule,
  PoliciesModule,
  UserGroupsModule,
} from '@modules';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthConfig, DatabaseConfig, ServerConfig } from '@configs';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import * as MongooseDelete from 'mongoose-delete';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SerializationInterceptor } from '@interceptors';
import { LocalStrategy, JwtStrategy } from '@strategies';
import { JwtAuthGuard, PoliciesGuard } from '@guards';
import { DynamicModelFetcher } from '@utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
      load: [ServerConfig.default, DatabaseConfig.default, AuthConfig.default],
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        database: Joi.object({
          mongodbUri: Joi.string().required(),
        }),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    MongooseModule.forRootAsync({
      connectionName: 'local_connection',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongodbUri'),
        connectionFactory: (connection) => {
          connection.plugin(MongooseDelete, {
            overrideMethods: 'all', // tells find methods to exclude soft deleted documents automatically
            deletedAt: true, // adds a deletedAt timestamp to your schema
            indexFields: true, // adds indexes to deleted and deletedAt fields
          });

          // Apply lean() to all queries
          connection.plugin((schema) => {
            schema.pre(
              [
                'find',
                'findOne',
                'findById',
                'findOneAndUpdate',
                'findByIdAndUpdate',
              ],
              function () {
                this.lean();
              },
            );
          });

          return connection;
        },
      }),
    }),
    PassportModule,
    {
      ...JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('auth.jwtSecret'),
          signOptions: { expiresIn: '1h' },
        }),
      }),
      global: true,
      exports: [JwtModule],
    },
    CaslModule.forRoot(),
    AccountsModule,
    UserGroupsModule,
    PoliciesModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LocalStrategy,
    JwtStrategy,
    DynamicModelFetcher,
    {
      provide: APP_INTERCEPTOR,
      useClass: SerializationInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
})
export class AppModule {}
