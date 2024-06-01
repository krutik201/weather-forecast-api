import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { LocationsModule } from '../locations/locations.module';
import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { LocationsService } from '../locations/locations.service';
import { LocationRepository } from '../locations/locations.repository';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    CacheModule.register() /* Register CacheModule to use caching */,
    LocationsModule /* Import LocationsModule to use LocationsService */,
  ],
  providers: [
    WeatherService,
    LocationRepository,
    LocationsService,
    ConfigService,
  ],
  controllers: [WeatherController],
})
export class WeatherModule {}
