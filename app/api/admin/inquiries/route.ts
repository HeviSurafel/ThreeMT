// app/api/admin/inquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

import jwt from 'jsonwebtoken';
import { Inquiry } from '@/models/Inquiry';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ inquiries });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, status } = await req.json();
    await connectDB();

    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ inquiry });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}