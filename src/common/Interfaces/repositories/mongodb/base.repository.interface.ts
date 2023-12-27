import { FilterQuery, SortOrder } from 'mongoose';
import { ResponsePaginationType } from 'src/common/types/response-pagination.type';

export interface BaseRepositoryInterface<Entity> {
  store(data: Partial<Entity>): Promise<Entity>;

  findBy(
    conditions: FilterQuery<Entity>,
    sort: { [key: string]: SortOrder },
  ): Promise<Entity[]>;

  findOne(conditions: FilterQuery<Entity>): Promise<Entity>;

  findById(_id: string): Promise<Entity>;

  update(_id: string, data: Partial<Entity>): Promise<Entity>;

  softDelete(_id: string): Promise<boolean>;

  delete(_id: string): Promise<boolean>;

  paginate(
    conditions: FilterQuery<Entity>,
    limit?: number | string,
    page?: number | string,
    softDelete?: boolean,
  ): Promise<ResponsePaginationType<Entity>>;
}
