import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { Translation } from '../shared/i18n/translation.utility';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    let lang =
      request?.body?.language_code ||
      request?.query?.language_code ||
      request?.params?.language_code ||
      request?.user?.language_code ||
      request?.headers?.language_code;

    // let lang = request_data.language;
    const response = ctx.getResponse<Response>();
    const errors = this.filterResponse(
      exception.getResponse()['message'],
      lang,
    );

    response
      .status(422)
      // you can manipulate the response here
      .json({
        message: errors[0].display_error,
        developer_errors: errors,
      });
  }
  filterResponse(message, lang = 'hu') {
    if (!Array.isArray(message)) {
      message = [message];
    }

    message = message.map((e) =>
      e.includes('travellers.0.') ? e.replace('travellers.0.', '') : e,
    );
    message = message.map((e) =>
      e.includes('rooms.0.') ? e.replace('rooms.0.', '') : e,
    );
    message = message.map((e) =>
      e.includes('faqs.0.') ? e.replace('faqs.0.', '') : e,
    );
    message = message.map((e) =>
      e.includes('mediaLanguage.0.') ? e.replace('mediaLanguage.0.', '') : e,
    );
    message = message.map((e) =>
      e.includes('billing_user.') ? e.replace('billing_user.', '') : e,
    );
    message = message.map((e) =>
      e.includes('billing_address.') ? e.replace('billing_address.', '') : e,
    );

    if (message.length) {
      let result = [];
      for (let i = 0; i < message.length; i++) {
        let errors = message[i].split('&&&');
        if (errors.length > 2) {
          result.push({
            key: errors[1],
            error_type: 'system',
            actual_error: errors[0], //Translation.Translater('en', 'error', errors[0]),
            display_error: errors[2],
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
