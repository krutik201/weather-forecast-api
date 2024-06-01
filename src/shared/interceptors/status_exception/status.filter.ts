import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { StatusException } from "./status.exception";

@Catch(StatusException)
export class StatusFilter implements ExceptionFilter {
  catch(exception: StatusException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();
    const status = exception.getStatus();
    response.status(status).json(exception.getResponse());
  }
}
