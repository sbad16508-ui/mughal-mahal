import mongoose from 'mongoose'

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
}, { _id: false })

const diningTableSchema = new mongoose.Schema({
  tableTypeId: {
    type: String,
    required: true,
    unique: true,
    enum: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6']
  },
  tableTypeName: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  tables: {
    type: [tableSchema],
    required: true
  }
}, { timestamps: true })

export default mongoose.model('DiningTable', diningTableSchema)
