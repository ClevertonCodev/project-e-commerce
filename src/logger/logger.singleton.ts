import { AppModule } from 'src/app.module';
import { LoggerService } from './logger.service';
import { NestFactory } from '@nestjs/core';


let loggerService: LoggerService;

export async function initializeLogger() {
    const app = await NestFactory.createApplicationContext(AppModule);
    loggerService = app.get(LoggerService);
}

export function logInfo(message: string) {
    if (!loggerService) {
        throw new Error('LoggerService não foi inicializado');
    }
    loggerService.logInfo(message);
}

export function logError(message: string, trace?: any) {
    if (!loggerService) {
        throw new Error('LoggerService não foi inicializado');
    }
    loggerService.logError(message, trace);
}
