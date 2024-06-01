import {
  NotFoundException,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { Translation } from '../shared/i18n/translation.utility';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    // console.log('----data----', request.params, request.user);
    let lang =
      request?.body?.language_code ||
      request?.query?.language_code ||
      request?.params?.language_code ||
      request?.user?.language_code ||
      request?.headers?.language_code;

    const response = ctx.getResponse<Response>();
    const errors = this.filterResponse(
      exception.getResponse()['message'],
      lang,
    );
    response
      .status(404)
      // you can manipulate the response here
      .json({
        message: errors[0].display_error,
        developer_errors: errors,
      });
  }

  filterResponse(message, lang = 'hu') {
    let msg = [];
    msg.push(message);

    if (msg.length) {
      let result = [];
      for (let i = 0; i < msg.length; i++) {
        let errors = msg[i].split('&&&');
        if (errors.length > 2) {
          result.push({
            key: errors[1],
            error_type: 'system',
            actual_error: Translation.Translator('en', 'error', errors[0]),
            display_error: Translation.Translator(
              lang || 'hu',
              'error',
              errors[2],
            ),
          });
        } else {
          result.push({
            key: errors[1],
            error_type: 'ui',
            actual_error: Translation.Translator('en', 'error', errors[0]),
            display_error: Translation.Translator(
              lang || 'hu',
              'error',
              errors[0],
            ),
          });
        }
      }

      return result;
    }
  }
}
