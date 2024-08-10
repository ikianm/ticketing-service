import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AppConfig from 'configs/app.config';
import { GroupsModule } from './modules/groups/group.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from './modules/comments/comment.module';
import { ProvidersModule } from './modules/providers/provider.module';
import { TicketsModule } from './modules/tickets/ticket.module';

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
    GroupsModule,
    CommentsModule,
    ProvidersModule,
    TicketsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
