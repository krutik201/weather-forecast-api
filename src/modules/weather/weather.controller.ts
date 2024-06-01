import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { throwException } from '../../shared/utility/throw-exception';
import { AppResponse } from '../../shared/interface/app-response.interface';

@ApiTags('Weather')
@Controller('weather')
@UseGuards(ThrottlerGuard)
@UseInterceptors(CacheInterceptor)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get(':locationId')
  @ApiOperation({ summary: 'Get the weather forecast for a specific location' })
  @ApiResponse({ status: 200, description: 'The found records' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getWeather(
    @Param('locationId') locationId: string,
  ): Promise<AppResponse> {
    return await this.weatherService.getCurrentWeather(locationId);
  }

  @Get('history/:locationId')
  @ApiOperation({ summary: 'Get the historical data for a specific location' })
  @ApiResponse({ status: 200, description: 'The found records' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getHistoricalWeather(
    @Param('locationId') locationId: string,
    @Query('days') days: number,
  ) {
    return await this.weatherService.getHistoricalWeather(locationId, days);
  }
}
