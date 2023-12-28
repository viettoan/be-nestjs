import Joi from 'joi';
import { PaginationDto } from '../../common/dto/pagination.dto';

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  address: Joi.string().required(),
}).options({ abortEarly: false, allowUnknown: true });

export class FindUserDto extends PaginationDto {}
