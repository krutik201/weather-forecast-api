import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the location',
    example: 'Central Park',
  })
  name: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  @ApiPropertyOptional({
    description: 'Latitude of the location',
    example: 40.785091,
  })
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @ApiPropertyOptional({
    description: 'Longitude of the location',
    example: -73.968285,
  })
  longitude: number;
}
