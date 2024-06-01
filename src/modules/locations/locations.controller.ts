import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { throwException } from '../../shared/utility/throw-exception';
import { CreateLocationDto } from './dto/create-location.dto';
import { PageQueryDto } from '../../shared/dto/page-query.dto';
import { AppResponse } from '../../shared/interface/app-response.interface';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('/list')
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findAll(@Query() pageQueryDto: PageQueryDto): Promise<any> {
    try {
      return await this.locationsService.getAllLocation(pageQueryDto);
    } catch (error) {
      throwException(error);
    }
  }

  @Post('/add')
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createLocation(@Body() createLocationDto: CreateLocationDto) {
    try {
      return await this.locationsService.createLocation(createLocationDto);
    } catch (error) {
      throwException(error);
    }
  }

  @Get('/:locationId')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiResponse({ status: 200, description: 'Location found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getLocationById(@Param('locationId') locationId: number): Promise<any> {
    try {
      const location = await this.locationsService.getLocationById(locationId);
      return location;
    } catch (error) {
      throwException(error);
    }
  }

  @Put('update/:locationId')
  @ApiOperation({ summary: 'Update a location by ID' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateLocation(
    @Param('locationId') locationId: number,
    @Body() updateLocationDto: CreateLocationDto,
  ) {
    try {
      return await this.locationsService.updateLocationById(
        locationId,
        updateLocationDto,
      );
    } catch (error) {
      throwException(error);
    }
  }

  @Delete('/:locationId')
  @ApiOperation({ summary: 'Delete a location by ID' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteLocation(@Param('locationId') locationId: number) {
    try {
      return await this.locationsService.deleteLocationById(locationId);
    } catch (error) {
      throwException(error);
    }
  }
}
