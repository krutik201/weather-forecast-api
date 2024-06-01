import {
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Translation } from 'src/shared/i18n/translation.utility';
import { StatusException } from './status.exception';

@Injectable()
export class StatusInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        // update message by lang code
        const request = _context.switchToHttp().getRequest();
        let lang =
          request?.body?.language_code ||
          request?.query?.language_code ||
          request?.params?.language_code ||
          request?.user?.language_code ||
          request?.headers?.language_code;
        if (data.message) {
          data.message = Translation.Translator(
            lang || 'en',
            'success',
            data.message,
          );
        }
        throw new StatusException(data, HttpStatus.OK);
      }),
    );
  }
}
