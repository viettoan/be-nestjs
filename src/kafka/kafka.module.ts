import { ConfigurableModuleAsyncOptions, Logger } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common/interfaces';
import { KAFKA_OPTIONS_TOKEN } from './kafka.module-definition';
import { KafkaService } from './kafka.service';
import { KafkaModuleOptions } from './types/kafka-module-options.type';

export class KafkaModule {
  private static logger = new Logger(KafkaModule.name);

  static registerAsync(
    options: ConfigurableModuleAsyncOptions<KafkaModuleOptions> & {
      isGlobal?: boolean;
    },
  ): DynamicModule {
    return {
      module: KafkaModule,
      global: options.isGlobal,
      providers: [
        KafkaService,
        {
          provide: KAFKA_OPTIONS_TOKEN,
          useFactory: (...args: unknown[]) => {
            if (options.useFactory) {
              return options.useFactory(...args);
            }

            this.logger.error(`Kafka options is not provided`);
            return {};
          },
          inject: options.inject,
        },
      ],
      imports: options.imports || [],
      exports: [KafkaService],
    };
  }
}
