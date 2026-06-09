// app/api/blog/post/[slug]/route.ts (alternative path)
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { BlogPost } from '@/models/BlogPost';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const resolvedSlug=(await params).slug;


    const post = await BlogPost.findOne({ slug: resolvedSlug, isPublished: true });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    post.views += 1;
    await post.save();
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}