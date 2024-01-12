import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Connection } from 'mongoose';
import { MONGO_CONNECTION_NAME } from 'src/common/constant/database.constant';

@Controller('healthcheck')
@ApiTags('healthcheck')
export class HealthcheckController {
  constructor(
    private healthcheck: HealthCheckService,
    private mongooseHealth: MongooseHealthIndicator,
    @InjectConnection(MONGO_CONNECTION_NAME)
    private readonly mongoConnection: Connection,
    private memoryHealth: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.healthcheck.check([
      () =>
        this.mongooseHealth.pingCheck('mongodb', {
          connection: this.mongoConnection,
        }),
      () => this.memoryHealth.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
