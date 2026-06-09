// app/api/blog/debug/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { BlogPost } from '@/models/BlogPost';

export async function GET() {
  try {
    await connectDB();
    
    const allPosts = await BlogPost.find({});
    const publishedPosts = await BlogPost.find({ isPublished: true });
    
    return NextResponse.json({
      totalPosts: allPosts.length,
      publishedPosts: publishedPosts.length,
      posts: allPosts.map(p => ({
        id: p._id,
        title: p.title,
        slug: p.slug,
        isPublished: p.isPublished,
        category: p.category,
        readTime: p.readTime
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}