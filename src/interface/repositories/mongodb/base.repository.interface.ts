import { FilterQuery, PopulateOptions, SortOrder } from 'mongoose';
import { ResponsePaginationType } from 'src/common/types/response-pagination.type';
import { User } from 'src/entities/mongodb/user.entity';

export interface BaseRepositoryInterface<Entity> {
  store(data: Partial<Entity>, user?: User): Promise<Entity>;

  storeMany(data: Partial<Entity>[], user?: User): Promise<boolean>;

  findBy(
    conditions: FilterQuery<Entity>,
    sort: { [key: string]: SortOrder },
    populate?: PopulateOptions,
  );

  findOne(conditions: FilterQuery<Entity>, populate?: PopulateOptions);

  findById(_id: string, populate?: PopulateOptions);

  update(_id: string, data: Partial<Entity>, user?: User): Promise<Entity>;

  softDelete(_id: string, user?: User): Promise<boolean>;

  delete(_id: string): Promise<boolean>;

  deleteByConditions(conditions: FilterQuery<Entity>): Promise<boolean>;

  paginate(
    conditions: FilterQuery<Entity>,
    limit?: number | string,
    page?: number | string,
    populate?: PopulateOptions,
  ): Promise<ResponsePaginationType<Entity>>;

  count(conditions: FilterQuery<Entity>): Promise<number>;

  findWithBatch(
    conditions: FilterQuery<Entity>,
    batchingSize: number,
    populate?: PopulateOptions,
  );
}
