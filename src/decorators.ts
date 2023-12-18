import { Inject } from '@nestjs/common';
import type { Entity, OneModel as OneTableOneModel, Table } from 'dynamodb-onetable';
import * as DynamoOnaTable from 'dynamodb-onetable';

export const paramsSymbol = Symbol('OneTable:TableConstructorParams');
export const tableSymbol = Symbol('OneTable:Table');
export const getModelToken = (modelName: string) => `${modelName}Model`;

export const OneTable = () => Inject(tableSymbol);

export const InjectModel = (modelName: string) => Inject(getModelToken(modelName));

export function OneModel<T extends OneTableOneModel, M = Entity<T>>(
  name: string,
  fields: T,
  timestamps?: boolean | string,
) {
  class OneTableModel extends DynamoOnaTable.Model<M> {
    public static readonly fields: T = fields;
    constructor(@OneTable() table: Table) {
      super(table, name, { fields, timestamps });
    }
  }

  return OneTableModel;
}

export class Model<T extends OneTableOneModel> extends DynamoOnaTable.Model<Entity<T>> {}
