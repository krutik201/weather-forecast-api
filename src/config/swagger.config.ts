import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('Real-time Weather Forecast API')
  .addBearerAuth()
  .addCookieAuth('auth')
  .setDescription('The Weather Forecast API documentation')
  .setVersion('1.0')
  .build();
