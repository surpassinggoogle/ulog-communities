import { Document, Schema, Model, model} from "mongoose"

export interface IOverseerModel extends Document {
  name?: string
  tags?: string[]
  maxweight?: number
}

export var OverseerSchema: Schema = new Schema({
  name: String,
  tags: [],
  maxweight: Number,
})

export const Overseer: Model<IOverseerModel> = model<IOverseerModel>("Overseer", OverseerSchema)