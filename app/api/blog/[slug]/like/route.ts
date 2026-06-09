// app/api/blog/[slug]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { BlogPost } from '@/models/BlogPost';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const resolvedSlug=(await params).slug;
    const post = await BlogPost.findOne({ slug: resolvedSlug});
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    post.likes += 1;
    await post.save();
    
    return NextResponse.json({ likes: post.likes });
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}