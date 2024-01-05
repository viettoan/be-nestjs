import { Consumer, ConsumerRunConfig, Kafka, Producer } from 'kafkajs';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import { KAFKA_OPTIONS_TOKEN } from './kafka.module-definition';
import { KafkaModuleOptions } from './types/kafka-module-options.type';

const getOriginalCause = (error: Error & { cause?: Error }): Error => {
  if (error.cause) {
    return getOriginalCause(error.cause);
  }

  return error;
};

function handleFailureRestart(err: Error, logger: Logger) {
  const cause = getOriginalCause(err);
  logger.error('Kafka consumer restart on failure', cause, err);

  return Promise.resolve(true);
}

@Injectable()
export class KafkaService<KafkaData> {
  private logger = new Logger(KafkaService.name);

  private client: Kafka;

  private mConsumer: Consumer | undefined = undefined;

  private mProducer: Producer | undefined = undefined;

  private lastEventTimestamp = 0;

  constructor(
    @Inject(KAFKA_OPTIONS_TOKEN)
    private moduleOptions: KafkaModuleOptions,
  ) {
    this.logger.log('Initializing kafka client');
    this.client = new Kafka({
      clientId: moduleOptions.clientId,
      brokers: moduleOptions.brokers,
      ...(moduleOptions.username && moduleOptions.password
        ? {
            ssl: {
              rejectUnauthorized: false,
              cert: readFileSync(join(__dirname, 'CARoot.pem'), 'utf-8'),
            },
            sasl: {
              mechanism: 'plain',
              username: moduleOptions.username,
              password: moduleOptions.password,
            },
          }
        : {}),
    });
  }

  handleCrash(consumer: Consumer) {
    const errorTypes = ['unhandledRejection', 'uncaughtException'];
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    errorTypes.forEach((type) => {
      process.on(type, (err: Error) => {
        this.logger.error({
          path: 'consumer/handleCrash',
          message: err.stack || '',
        });
        consumer
          .disconnect()
          .then(() => {
            process.exit(0);
          })
          .catch(() => {
            process.exit(1);
          });
      });
    });

    signalTraps.forEach((type) => {
      process.once(type, (err: Error) => {
        this.logger.error({
          path: 'consumer/handleCrash',
          message: err.stack || '',
        });
        consumer
          .disconnect()
          .then(() => {
            process.kill(process.pid, type);
          })
          .catch(() => {
            process.kill(process.pid, type);
          });
      });
    });
  }

  getConsumerRunConfig(): ConsumerRunConfig {
    return {
      eachMessage: async ({ message, heartbeat, topic }) => {
        const data = message.value?.toString();
        const heartbeatFn = () => {
          heartbeat()
            .then(() => {
              this.logger.log({
                path: 'eachMessage',
                message: 'heartbeat message sent',
              });
            })
            .catch(() => {
              this.logger.error({
                path: 'eachMessage',
                message: 'Failed to sent heartbeat message',
              });
            });
        };
        if (!data) {
          this.logger.error({
            path: 'eachMessage',
            message: 'data is null',
          });
          return;
        }
        const now = Date.now();
        if (now - this.lastEventTimestamp > 60 * 1000) {
          this.lastEventTimestamp = now;
          this.logger.log({
            path: 'eachMessage',
            message: 'kafka message received',
            data,
          });
        }

        try {
          // TODO: implement handle message topic
        } catch (error: unknown) {
          this.logger.error({
            path: 'eachMessage',
            message: `Failed to process kafka message. Reason: ${
              (error as { message?: string }).message || 'unknown'
            }`,
            error,
          });
        }
      },
      autoCommitThreshold: 100,
      autoCommitInterval: 2000,
    };
  }

  async initConsumer() {
    if (!this.mConsumer) {
      const tempConsumer = this.client.consumer({
        groupId: this.moduleOptions.groupId,
        retry: {
          restartOnFailure: (err: Error) => {
            return handleFailureRestart(err, this.logger);
          },
        },
      });
      await tempConsumer.connect();
      this.mConsumer = tempConsumer;
    }

    return this.mConsumer;
  }

  async initProducer() {
    if (!this.mProducer) {
      const tempProducer = this.client.producer({
        retry: {
          restartOnFailure: (err: Error) => {
            return handleFailureRestart(err, this.logger);
          },
        },
      });
      await tempProducer.connect();
      this.mProducer = tempProducer;
    }

    return this.mProducer;
  }

  async registerConsumer() {
    try {
      const consumer = await this.initConsumer();
      this.handleCrash(consumer);
      await consumer.subscribe({
        topics: [],
        fromBeginning: true,
      });
      consumer.run(this.getConsumerRunConfig());
    } catch (error) {
      this.logger.error(error);
    }
  }

  async publish(topic: string, data: KafkaData, key?: string) {
    const producer = await this.initProducer();
    const metadatas = await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(data),
          key,
        },
      ],
    });
    this.logger.log(
      `Published message: ${JSON.stringify({ topic, data, key })}`,
    );

    return metadatas[0];
  }
}
