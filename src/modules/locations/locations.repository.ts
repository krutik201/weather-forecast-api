import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { throwException } from '../../shared/utility/throw-exception';
import { Location } from '../../shared/entity/location.entity';

@Injectable()
export class LocationRepository extends Repository<Location> {
  constructor(readonly dataSource: DataSource) {
    super(Location, dataSource.createEntityManager());
  }

  /**
   * [@Description: Get All location ]
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async getAllLocation(pageQueryDto): Promise<any> {
    try {
      /* Start building the pageQueryDto */
      let listQuery = this.createQueryBuilder('location');

      /* Apply conditions if pageQueryDto object exists */
      if (pageQueryDto) {
        /* Pagination */
        if (
          pageQueryDto.offset !== undefined &&
          pageQueryDto.limit !== undefined
        ) {
          listQuery
            .skip(pageQueryDto.offset * pageQueryDto.limit)
            .take(pageQueryDto.limit);
        }

        /* Ordering */
        if (pageQueryDto.orderBy && pageQueryDto.orderDir) {
          listQuery.orderBy(
            `location.${pageQueryDto.orderBy}`,
            pageQueryDto.orderDir,
          );
        }

        /* Search */
        if (pageQueryDto.search) {
          listQuery.where('location.name LIKE :search', {
            search: `%${pageQueryDto.search}%`,
          });
        }
      }
      const locationDataWithCount = await listQuery.getManyAndCount();

      if (pageQueryDto) {
        pageQueryDto.count = locationDataWithCount[1];
      }

      return {
        locationData: locationDataWithCount[0],
        page: pageQueryDto,
      };
    } catch (error) {
      throwException(error);
    }
  }

  /**
   * [@Description: Finds a location by name, case-insensitive.]
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async findLocationByName(name: string): Promise<Location> {
    return await this.createQueryBuilder('location')
      .where('LOWER(location.name) = LOWER(:name)', { name })
      .getOne();
  }

  /**
   * [@Description: Create location]
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async createLocation(createLocationDto): Promise<any> {
    try {
      const location = this.create(createLocationDto);
      return await this.save(location);
    } catch (error) {
      throwException(error);
    }
  }

  /**
   * @Description: Find a location by ID
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async getLocationById(locationId): Promise<Location> {
    try {
      const location = await this.findOne({
        where: { id: locationId, isActive: true, isDeleted: false },
      });
      if (!location) {
        throw new NotFoundException('ERR_LOCATION_NOT_FOUND');
      }
      return location;
    } catch (error) {
      throwException(error);
    }
  }

  /**
   * [@Description: Finds a location by name, case-insensitive, excluding a specific location ID]
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async findLocationByNameExcludingId(
    name: string,
    excludeId: number,
  ): Promise<Location> {
    return await this.createQueryBuilder('location')
      .where('LOWER(location.name) = LOWER(:name)', { name })
      .andWhere('location.id != :excludeId', { excludeId })
      .getOne();
  }

  /**
   * @Description: Update a location by ID
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async updateLocationById(locationId, updateLocationDto): Promise<Location> {
    try {
      /* Check if the location exists */
      const locationToUpdate = await this.getLocationById(locationId);

      /* If the location exists, update it */
      Object.assign(locationToUpdate, updateLocationDto);
      await locationToUpdate.save();

      return locationToUpdate;
    } catch (error) {
      throwException(error);
    }
  }

  /**
   * @Description: Delete a location by ID
   * @date: 2024-06-01
   * @author: Krutik Shukla
   **/
  async deleteLocationById(locationId): Promise<void> {
    try {
      /* Check if the location exists */
      const locationToDelete = await this.getLocationById(locationId);

      /* If the location exists, mark it as deleted */
      locationToDelete.isDeleted = true;

      /* Save the changes to the database */
      await locationToDelete.save();

      return;
    } catch (error) {
      throwException(error);
    }
  }
}
