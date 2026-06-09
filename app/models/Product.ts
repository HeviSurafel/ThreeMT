// lib/models/Product.ts
import mongoose from 'mongoose';

export interface IProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface IProduct {
  name: string;
  amharicName: string;
  category: string;
  description: string;
  fullDescription?: string;
  price: string;
  capacity: string;
  power: string;
  images: IProductImage[];  // This is the correct field - array of images
  inStock: boolean;
  specifications: string[];
  features: string[];
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new mongoose.Schema<IProductImage>({
  url: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  alt: {
    type: String,
    required: [true, 'Image alt text is required'],
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    amharicName: {
      type: String,
      required: [true, 'Amharic name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Bakery Machines',
        'Injera Production Machines',
        'Food Processing Equipment',
        'Coffee Processing Machines',
        'Animal Feed Processing',
        'Soap Manufacturing Equipment',
        'Construction Machines',
        'Plastic Recycling Systems',
        'Gym Equipment',
        'Kitchen Equipment',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    fullDescription: {
      type: String,
    },
    price: {
      type: String,
      required: [true, 'Price is required'],
    },
    capacity: {
      type: String,
      required: [true, 'Capacity is required'],
    },
    power: {
      type: String,
      required: [true, 'Power specification is required'],
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    specifications: [{
      type: String,
    }],
    features: [{
      type: String,
    }],
    color: {
      type: String,
      default: '#d97706',
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Remove the old 'image' field if it exists in any documents
// You may need to run this migration in MongoDB
// db.products.updateMany({}, { $unset: { image: "" } });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);