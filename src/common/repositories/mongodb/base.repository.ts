import { EntityTarget, MongoRepository } from 'typeorm';
import { DataSource } from 'typeorm';
import { ObjectId } from 'mongodb';

export class BaseRepository<Entity> extends MongoRepository<Entity> {
  constructor(
    entityClass: EntityTarget<Entity>,
    private dataSource: DataSource,
  ) {
    super(
      entityClass,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }
  async paginate(
    limit: number = 10,
    page: number = 1,
    conditions: object = {},
  ): Promise<{
    data: Entity[];
    total: number;
    limit: number;
    page: number;
    totalPage: number;
  }> {
    const [data, total] = await Promise.all([
      this.find({
        where: conditions,
        skip: limit * (page - 1),
        take: limit,
      }),
      this.count({ ...conditions, deletedAt: null }),
    ]);
    return {
      data,
      total,
      limit,
      page,
      totalPage: Math.ceil(total / limit),
    };
  }

  findOneById(id: string | number): Promise<Entity | null> {
    try {
      return this.findOne({
        where: {
          _id: new ObjectId(id),
        },
      });
    } catch (e) {
      return null;
    }
  }
  async customUpdate(query: object, data: object): Promise<Entity | null> {
    const updatedEntity = await this.findOneAndUpdate(
      query,
      {
        $set: data,
      },
      {
        returnDocument: 'after',
      },
    );
    if (!updatedEntity.value) {
      return null;
    }
    return updatedEntity.value;
  }
  async updateById(id: string, data: object): Promise<Entity | null> {
    const updatedEntity = await this.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: data,
      },
      {
        returnDocument: 'after',
      },
    );
    if (!updatedEntity.value) {
      return null;
    }
    return updatedEntity.value;
  }
  async customDelete(
    query: object,
    softDelete: boolean = true,
  ): Promise<boolean> {
    if (softDelete) {
      const updatedEntity = await this.findOneAndUpdate(query, {
        $set: { deletedAt: new Date() },
      });
      if (!updatedEntity.value) {
        return false;
      }
      return true;
    }
    const deletedEntity = await this.deleteOne(query);
    return deletedEntity.acknowledged;
  }
  async deleteById(id: string, softDelete: boolean = true): Promise<boolean> {
    if (softDelete) {
      const updatedEntity = await this.findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $set: { deletedAt: new Date() },
        },
      );
      if (!updatedEntity.value) {
        return false;
      }
      return true;
    }
    const deletedEntity = await this.deleteOne({ _id: new ObjectId(id) });
    return deletedEntity.acknowledged;
  }
}
