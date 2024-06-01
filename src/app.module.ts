import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'config/configuration';
import { validationSchema } from 'config/validation';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsModule } from './modules/locations/locations.module';
import { typeOrmConfig } from './config/typeorm.config';
import { Location } from './shared/entity/location.entity';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/development.env`,
      load: [configuration],
      validationSchema,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    TypeOrmModule.forFeature([Location]),
    CacheModule.register({
      ttl: 600 /* seconds */,
      max: 100 /* maximum number of items in cache */,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    LocationsModule,
    WeatherModule,
  ],
})
export class AppModule {}
