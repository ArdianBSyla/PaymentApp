import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest();
      const response = ctx.getResponse();
      const status = exception.getStatus();

      const errorResponse = {
        method: request.method,
        url: request.url,
        message: exception.getResponse(),
        timestamp: new Date().toLocaleDateString(),
      }

      Logger.error(`${request.method} ${request.url}`, JSON.stringify(errorResponse), 'ExceptionFilter')

      response.status(status).json(errorResponse)
  }
}
