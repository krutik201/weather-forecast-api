import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationRepository } from './locations.repository';
import { throwException } from '../../shared/utility/throw-exception';
import { Location } from '../../shared/entity/location.entity';

@Injectable()
export class LocationsService {
  findOne(locationId: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly locationsRepository: LocationRepository) {}

  /**
   * [@Description: Get all location data]
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async getAllLocation(pageQueryDto): Promise<any> {
    try {
      /* Call the repository function to get all the location */
      const dbLocationList =
        await this.locationsRepository.getAllLocation(pageQueryDto);

      /* Return the all location with pagination */
      return {
        message: 'SUC_LOCATION_LIST_SUCCESSFULLY',
        data: dbLocationList,
      };
    } catch (error) {
      throwException(error);
    }
  }

  /**
   * [@Description: Description]
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async createLocation(createLocationDto) {
    try {
      const { name } = createLocationDto;

      /* Convert the location name to lowercase for case-insensitive comparison */
      const existingLocation =
        await this.locationsRepository.findLocationByName(name.toLowerCase());

      if (existingLocation) {
        throw new ConflictException('ERR_LOCATION_WITH_SAME_NAME_EXIST');
      }
      /* Call the repository function to created the location */
      const location =
        await this.locationsRepository.createLocation(createLocationDto);

      /* Return the created location */
      return {
        message: 'SUC_LOCATION_CREATED_SUCCESSFULLY',
        data: location,
      };
    } catch (error) {
      throwException(error);
    }
  }

  async getLocationById(locationId) {
    try {
      /* Call the repository function to get the location */
      const location =
        await this.locationsRepository.getLocationById(locationId);

      /* Returning the location */
      return {
        message: 'SUC_LOCATION_GET_SUCCESSFULLY',
        data: location,
      };
    } catch (error) {
      throwException(error);
    }
  }

  /**
   * @Description: Update a location by ID
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async updateLocationById(
    locationId: number,
    updateLocationDto: any,
  ): Promise<any> {
    try {
      const { name } = updateLocationDto;

      /* Check if a location with the new name already exists, excluding the current location */
      const existingLocation =
        await this.locationsRepository.findLocationByNameExcludingId(
          name.toLowerCase(),
          locationId,
        );

      if (existingLocation) {
        throw new ConflictException('ERR_LOCATION_WITH_SAME_NAME_EXIST');
      }

      /* Call the repository function to update the location */
      const updatedLocation = await this.locationsRepository.updateLocationById(
        locationId,
        updateLocationDto,
      );

      /* Return the updated location */
      return {
        message: 'SUC_LOCATION_UPDATED_SUCCESSFULLY',
        data: updatedLocation,
      };
    } catch (error) {
      throwException(error);
    }
  }

  /**
   * @Description: Delete a location by ID
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async deleteLocationById(locationId): Promise<any> {
    try {
      /* Call the repository function to delete the location*/
      await this.locationsRepository.deleteLocationById(locationId);

      /* Return the deleted location */
      return { message: 'SUC_LOCATION_DELETED_SUCCESSFULLY', data: {} };
    } catch (error) {
      throwException(error);
    }
  }
}
