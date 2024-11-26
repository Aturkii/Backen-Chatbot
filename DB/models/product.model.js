import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  productName: {
    type: String,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
},
  {
    timestamps: true,
    versionKey: false
  });

const Product = mongoose.model('Product', ProductSchema);

export default Product;
