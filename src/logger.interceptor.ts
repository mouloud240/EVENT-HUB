
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

// Dynamically import chalk
@Injectable()
export class ResInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        // Dynamically import chalk
        const chalkModule = (await import('chalk'))
    const chalk=new chalkModule.Instance
        const req = context.switchToHttp().getRequest();
        const method = chalk.blue(req.method); // Use chalk as a function
        const url = chalk.green(req.url); // Use chalk as a function
        const headers = chalk.yellowBright(JSON.stringify(req.headers, null, 2)); // Use chalk as a function

        console.log(chalk.bold.yellow("🚀 Interceptor triggered")); // Bold yellow header
        console.log(`🔍 ${chalk.bold("Request Info")}: ${method} ${url}\n${headers}`);

        return next.handle().pipe(
            tap((response) => {
                console.log(
                    chalk.bold.magenta("📤 Responded with:"),
                    chalk.cyan(JSON.stringify(response, null, 2)) // Pretty print response in cyan
                );
            })
        );
    }
}

