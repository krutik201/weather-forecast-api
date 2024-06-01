import { Injectable, Inject, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { LocationsService } from '../locations/locations.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { throwException } from '../../shared/utility/throw-exception';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly locationsService: LocationsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.baseUrl = process.env.WEATHER_BASE_URL;
  }

  /**
   * [@Description: Fetches the current weather data for a given location..]
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async getCurrentWeather(locationId): Promise<any> {
    try {
      /* Retrieve location details by ID */
      const location = await this.locationsService.getLocationById(locationId);

      /* Extract location name from the retrieved location data */
      const { name } = location?.data;
      const locationCoords = `${name}`;
      const cachedData = await this.cacheManager.get(locationCoords);

      /* Check if the weather data for the location is available in cache */
      if (cachedData) {
        this.logger.log(`Cache hit for location: ${locationCoords}`);
        return this.formatWeatherResponse(cachedData);
      }

      /* Log message indicating data will be fetched from the external API */
      this.logger.log(`Fetching weather data for location: ${locationCoords}`);

      /* Construct the URL for the external API request */
      const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${locationCoords}`;

      /* Fetch data from the external API */
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.get(url),
      );
      const data = response.data;

      /* Cache the fetched weather data for 10 minutes */
      await this.cacheManager.set(locationCoords, data, 600);

      /* Return the formatted current weather data */
      return this.formatWeatherResponse(data);
    } catch (error) {
      throw throwException(error);
    }
  }

  /**
   * [@Description: Fetches the historical weather data for a given location and number of days.]
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async getHistoricalWeather(locationId: string, days: number): Promise<any> {
    try {
      /* Retrieve location details by ID */
      const location = await this.locationsService.getLocationById(locationId);

      /* Extract latitude and longitude from the location data */
      const { latitude, longitude } = location.data;
      const locationCoords = `${latitude},${longitude}`;

      /* Construct a cache key based on location coordinates and the number of days */
      const cacheKey = `${locationCoords}-history-${days}`;
      const cachedData: any = await this.cacheManager.get(cacheKey);

      /* Check if cached data is available */
      if (cachedData) {
        this.logger.log(
          `Cache hit for location: ${locationCoords}, days: ${days}`,
        );
        return this.formatHistoricalWeatherResponse(cachedData);
      }

      /* Log message indicating data will be fetched from the external API */
      this.logger.log(
        `Fetching historical weather data for location: ${locationCoords}, days: ${days}`,
      );

      /* Initialize an array to hold the historical data */
      const historicalData = [];
      const endDate = new Date();

      /* Loop through each day to fetch the historical weather data */
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(endDate.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];

        /* Construct the URL for the external API request */
        const url = `${this.baseUrl}/history.json?key=${this.apiKey}&q=${locationCoords}&dt=${formattedDate}`;

        /* Fetch data from the external API and push it to the historicalData array*/
        const response: AxiosResponse = await lastValueFrom(
          this.httpService.get(url),
        );
        historicalData.push(response.data);
      }

      /* Cache the fetched historical data for 10 minutes */
      await this.cacheManager.set(
        cacheKey,
        historicalData,
        600,
      ); /* cache for 10 minutes

     /* Return the formatted historical weather data */
      return this.formatHistoricalWeatherResponse(historicalData);
    } catch (error) {
      throwException(error);
    }
  }

  formatWeatherResponse(weatherData: any) {
    const formattedResponse = {
      message: 'SUC_WEATHER_LOCATION_WISE',
      data: {
        name: weatherData.location.name,
        region: weatherData.location.region,
        country: weatherData.location.country,
        latitude: weatherData.location.lat,
        longitude: weatherData.location.lon,
        last_updated: weatherData.current.last_updated,
        temperature_celsius: weatherData.current.temp_c,
        temperature_fahrenheit: weatherData.current.temp_f,
        wind_speed_mph: weatherData.current.wind_mph,
        wind_speed_kph: weatherData.current.wind_kph,
        humidity: weatherData.current.humidity,
        cloud_coverage: weatherData.current.cloud,
      },
    };

    return formattedResponse;
  }

  formatHistoricalWeatherResponse(weatherDataArray: any[]) {
    const history = weatherDataArray.map((weatherData) => ({
      date: weatherData.forecast.forecastday[0].date,
      temperature_celsius: weatherData.forecast.forecastday[0].day.avgtemp_c,
      temperature_fahrenheit: weatherData.forecast.forecastday[0].day.avgtemp_f,
      max_temp_celsius: weatherData.forecast.forecastday[0].day.maxtemp_c,
      max_temp_fahrenheit: weatherData.forecast.forecastday[0].day.maxtemp_f,
      min_temp_celsius: weatherData.forecast.forecastday[0].day.mintemp_c,
      min_temp_fahrenheit: weatherData.forecast.forecastday[0].day.mintemp_f,
      wind_speed_mph: weatherData.forecast.forecastday[0].day.maxwind_mph,
      wind_speed_kph: weatherData.forecast.forecastday[0].day.maxwind_kph,
      humidity: weatherData.forecast.forecastday[0].day.avghumidity,
      cloud_coverage: weatherData.forecast.forecastday[0].day.cloud,
      condition: weatherData.forecast.forecastday[0].day.condition.text,
      icon: weatherData.forecast.forecastday[0].day.condition.icon,
    }));

    return {
      message: 'SUC_WEATHER_HISTORY',
      data: {
        location: {
          name: weatherDataArray[0].location.name,
          region: weatherDataArray[0].location.region,
          country: weatherDataArray[0].location.country,
          latitude: weatherDataArray[0].location.lat,
          longitude: weatherDataArray[0].location.lon,
        },
        history,
      },
    };
  }
}
