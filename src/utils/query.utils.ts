import { Injectable } from '@nestjs/common';
import { QueryBuilder, Like, MoreThanOrEqual, LessThanOrEqual, In, IsNull } from 'typeorm';

export interface Filter {
    field: string;
    value: any;
    operator: string;
  }
  
export interface Sort {
    field: string;
    order: "ASC" | "DESC";
  }

@Injectable()
export class QueryUtil {

  paginate(qb: any, page: number, limit: number) {
    const offset = page * limit;
    qb.skip(offset).take(limit);
  }

  filter(qb: any, filters: Filter[]) {
    filters.forEach(filter => {
      const { field, value, operator } = filter;
      switch (operator) {
        case 'equals':
          qb.andWhere(`${field} = :${field}`, { [field]: value });
          break;
        case 'not':
          qb.andWhere(`${field} != :${field}`, { [field]: value });
          break;
        case 'gt':
          qb.andWhere(`${field} > :${field}`, { [field]: value });
          break;
        case 'gte':
          qb.andWhere(`${field} >= :${field}`, { [field]: value });
          break;
        case 'lt':
          qb.andWhere(`${field} < :${field}`, { [field]: value });
          break;
        case 'lte':
          qb.andWhere(`${field} <= :${field}`, { [field]: value });
          break;
        case 'like':
          qb.andWhere(`${field} LIKE :${field}`, { [field]: `%${value}%` });
          break;
        case 'in':
          qb.andWhere(`${field} IN (:...${field})`, { [field]: value });
          break;
        case 'notIn':
          qb.andWhere(`${field} NOT IN (:...${field})`, { [field]: value });
          break;
        case 'isNull':
          qb.andWhere(IsNull());
          break;
        case 'isNotNull':
          qb.andWhere(!IsNull());
          break;
        default:
          throw new Error(`Unsupported filter operator: ${operator}`);
      }
    });
  }

  sort(qb: any, sorts: Sort[]) {
    sorts.forEach(sort => {
      const { field, order } = sort;
      qb.orderBy(field, order);
    });
  }
}
