import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Room from 'src/room/room.entity';
import User from 'src/user/user.entity';
 
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        ssl: configService.get('POSTGRES_SSL_ENABLED'),
        entities: [
         Room,User
        ],
        synchronize: true,
        autoLoadEntities: true,
      })
    }),
  ],
})
export class DatabaseModule {}