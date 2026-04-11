import { Document } from 'mongoose';
export interface IProduct extends Document {
    name: string;
    description?: string;
    bought: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    updatedAt: Date;
}
declare const Product: import("mongoose").Model<IProduct, {}, {}, {}, Document<unknown, {}, IProduct, {}, import("mongoose").DefaultSchemaOptions> & IProduct & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProduct>;
export default Product;
//# sourceMappingURL=Product.model.d.ts.map