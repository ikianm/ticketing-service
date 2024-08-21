import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AppConfig from '../configs/app.config';
import { GroupsModule } from './modules/groups/group.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from './modules/comments/comment.module';
import { ProvidersModule } from './modules/providers/provider.module';
import { TicketsModule } from './modules/tickets/ticket.module';
import { ProtectionMiddleware } from './modules/shares/protection.middleware';
import { RequestContextModule } from 'nestjs-request-context';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './modules/shares/http-exception.filter';
import helmet from 'helmet';
import { ValidateTicketBodyMiddleware } from './modules/tickets/validateTicketBody.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [AppConfig]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return configService.get('database');
      },
      inject: [ConfigService]
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const environment = configService.get<string>('environment');
        let level = '';
        let target = 'pino-pretty';
        if (environment === 'production') {
          level = 'error';
          target = '';
        } else if (environment === 'testing') {
          level = 'warn'
        } else {
          level = 'warn';
        }

        return {
          pinoHttp: {
            level,
            transport: {
              target
            }
          }
        }
      },
      inject: [ConfigService]
    }),
    GroupsModule,
    CommentsModule,
    ProvidersModule,
    TicketsModule,
    RequestContextModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true
      })
    },
    {
      provide: APP_FILTER,
      useValue: new HttpExceptionFilter()
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectionMiddleware).forRoutes('*');
    consumer.apply(helmet()).forRoutes('*');
    consumer.apply(ValidateTicketBodyMiddleware).forRoutes('/tickets/create');
  }
}
