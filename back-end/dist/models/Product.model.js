import { Schema, model, Document } from 'mongoose';
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 3
    },
    description: {
        type: String,
        trim: true
    },
    bought: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }
}, {
    timestamps: true
});
const Product = model('Product', productSchema);
export default Product;
//# sourceMappingURL=Product.model.js.map