import { FilterQuery, Model, SortOrder } from 'mongoose';
import { PAGINATE_OPTIONS } from 'src/common/constant/app.constant';
import { UserAware } from 'src/common/enitites/user-aware.entity';
import { BaseRepositoryInterface } from 'src/common/Interfaces/repositories/mongodb/base.repository.interface';

export abstract class BaseRepository<Entity extends UserAware>
  implements BaseRepositoryInterface<Entity>
{
  constructor(protected model: Model<Entity>) {
    this.model = model;
  }

  getModel() {
    return this.model;
  }

  store(data: Partial<Entity>): Promise<Entity> {
    return this.getModel().create(data);
  }

  findBy(
    conditions: FilterQuery<Entity>,
    sort: { [key: string]: SortOrder },
  ): Promise<Entity[]> {
    return this.getModel()
      .find({ ...conditions, deleted_at: null })
      .sort(sort);
  }

  findOne(conditions: FilterQuery<Entity> = {}): Promise<Entity> {
    return this.getModel().findOne({ ...conditions, deleted_at: null });
  }

  findById(_id: string): Promise<Entity> {
    return this.getModel().findOne({
      _id,
      deleted_at: null,
    });
  }

  update(_id: string, data: Partial<Entity>): Promise<Entity> {
    return this.getModel().findByIdAndUpdate(_id, data, {
      returnDocument: 'after',
    });
  }

  async softDelete(_id: string): Promise<boolean> {
    return !!(await this.getModel().findByIdAndUpdate(_id, {
      deletedAt: new Date(),
    }));
  }

  async delete(_id: string): Promise<boolean> {
    return !!(await this.model.findByIdAndDelete(_id));
  }

  async paginate(
    conditions: FilterQuery<Entity>,
    limit: number | string = PAGINATE_OPTIONS.LIMIT,
    page: number | string = PAGINATE_OPTIONS.PAGE,
    softDelete: boolean = true,
  ): Promise<{
    data: Entity[];
    total: number;
    limit: number;
    page: number;
    totalPage: number;
  }> {
    limit = +limit || PAGINATE_OPTIONS.LIMIT;
    page = +page || PAGINATE_OPTIONS.PAGE;

    for (const condition in conditions) {
      if (typeof conditions[condition] === 'undefined') {
        delete conditions[condition];
      }
    }

    if (softDelete) {
      conditions.deletedAt = null;
    }
    const [data, total] = await Promise.all([
      this.getModel()
        .find(conditions)
        .skip(limit * (page - 1))
        .limit(limit),
      this.getModel().countDocuments(conditions),
    ]);

    return {
      data,
      total,
      limit,
      page,
      totalPage: Math.ceil(total / limit),
    };
  }
}
