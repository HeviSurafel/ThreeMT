// app/api/blog/categories/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { BlogPost } from '@/models/BlogPost';

export async function GET() {
  try {
    await connectDB();
    
    const categories = await BlogPost.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const categoryList = [
      { id: 'all', name: 'All Posts', count: categories.reduce((acc, cat) => acc + cat.count, 0) },
      ...categories.map(cat => ({
        id: cat._id.toLowerCase().replace(/\s+/g, '-'),
        name: cat._id,
        count: cat.count
      }))
    ];
    
    return NextResponse.json({ categories: categoryList });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}