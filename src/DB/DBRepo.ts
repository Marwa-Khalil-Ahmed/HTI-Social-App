import { Model, ProjectionType, QueryOptions, Types } from "mongoose";
import { IUser } from "../modules/userModule/user.types";
import { UserModel } from "./models/user.model";
import { RootFilterQuery } from "mongoose";

export abstract class DBRepo<T> {
  constructor(protected readonly model: Model<T>) {}

  find = async ({
    filter = {},
    projection = {},
    options = {},
  }: {
    filter?: RootFilterQuery<IUser>;
    projection?: ProjectionType<IUser>;
    options?: QueryOptions;
  }) => {
    const docs = await this.model.find(filter, projection, options);
    return docs;
  };

  findOne = async ({
    filter = {},
    projection = {},
    options = {},
  }: {
    filter?: RootFilterQuery<IUser>;
    projection?: ProjectionType<IUser>;
    options?: QueryOptions;
  }) => {
    const doc = await this.model.findOne(filter, projection, options);
    return doc;
  };

  findById = async ({
    id,
    projection = {},
    options = {},
  }: {
    id?: Types.ObjectId | string;
    projection?: ProjectionType<IUser>;
    options?: QueryOptions;
  }) => {
    const doc = await this.model.findById(id, projection, options);
    return doc;
  };

  create = async ({ doc }: { doc: Partial<T> }) => {
    const createDoc = await this.model.create(doc);
    return createDoc;
  };
}
