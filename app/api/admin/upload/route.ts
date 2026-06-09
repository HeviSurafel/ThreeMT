// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const type = formData.get('type') as string || 'products'; // 'products', 'blog', or 'general'
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max size is 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const originalName = file.name.replace(/\s/g, '');
    const filename = `${timestamp}-${randomString}-${originalName}`;
    
    // Determine upload directory based on type
    let uploadSubDir = 'general';
    switch (type) {
      case 'products':
        uploadSubDir = 'products';
        break;
      case 'blog':
        uploadSubDir = 'blog';
        break;
      case 'gallery':
        uploadSubDir = 'gallery';
        break;
      case 'hero':
        uploadSubDir = 'hero';
        break;
      default:
        uploadSubDir = 'general';
    }
    
    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', uploadSubDir);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Return the public URL
    const imageUrl = `/uploads/${uploadSubDir}/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      filename: filename,
      type: uploadSubDir
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}