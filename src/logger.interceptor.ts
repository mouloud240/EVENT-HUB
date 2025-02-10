import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class ResInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const chalkModule = await import('chalk');
    const chalk = new chalkModule.Instance();
    const req = context.switchToHttp().getRequest();
    const { method, url, headers } = req;
    const timestamp = new Date().toISOString();

    console.log(chalk.yellowBright(`🚀 [${timestamp}] Interceptor triggered`));
    console.log(
      chalk.blue(`🔍 Request: ${chalk.bold(method)} ${chalk.green(url)}`),
    );
    console.log(chalk.gray(`🛠 Body:\n${JSON.stringify(headers, null, 2)}`));

    return next.handle().pipe(
      tap((response) => {
        console.log(
          chalk.magentaBright(`📤 [${timestamp}] Response:`),
          chalk.cyan(JSON.stringify(response, null, 2)),
        );
      }),
      catchError((err) => {
        console.error(
          chalk.redBright(`❌ [${timestamp}] Error:`),
          chalk.bgRed.white(err.message || 'Unknown error'),
        );
        throw err;
      }),
    );
  }
}
