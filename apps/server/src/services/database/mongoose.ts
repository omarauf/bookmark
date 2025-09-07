import mongoose, { model, Schema, Types } from "mongoose";

function defaultSchemaPlugin(schema: Schema) {
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      // keep _id as ObjectId
      // ret._id = ret._id;
      return ret;
    },
  });

  schema.set("toObject", {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      // ret._id = ret._id;
      return ret;
    },
  });
}

mongoose.plugin(defaultSchemaPlugin);

export { Schema, model, Types };

export default mongoose;
