import { Types } from "mongoose";
import z from "zod";

export const ObjectIdSchema = z.instanceof(Types.ObjectId);
