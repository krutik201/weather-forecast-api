import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { OrderDir } from '../enum/order-dir.enum';

export class PageQueryDto {
  @IsNumberString(
    {},
    {
      message: 'Offset contain only number.',
    },
  )
  @IsNotEmpty({ message: 'Please enter offset.' })
  @ApiProperty({
    description: 'Please enter offset.',
    example: 0,
  })
  offset: number;

  @IsNumberString(
    {},
    {
      message: 'Limit contain only number.',
    },
  )
  @IsNotEmpty({
    message: 'Please enter limit.',
  })
  @ApiProperty({
    description: 'Please enter limit.',
    example: 0,
  })
  limit: number;

  @ApiPropertyOptional({
    description: 'Please enter order by (ID).',
    example: 'Id',
  })
  orderBy: string;

  @IsEnum(['DESC', 'ASC'], {
    message: (args: ValidationArguments) => {
      if (
        typeof args.value == 'undefined' ||
        args.value == '' ||
        args.value == null
      ) {
        return `Please enter order dir.`;
      } else {
        return `Please enter valid order dir ('DESC', 'ASC').`;
      }
    },
  })
  @ApiProperty({
    description: `Please enter order dir ('DESC', 'ASC').`,
    example: 'DESC',
  })
  orderDir: OrderDir;

  @ApiPropertyOptional({
    description: 'Enter search value',
  })
  search: string;
}
