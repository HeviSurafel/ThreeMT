// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

import jwt from 'jsonwebtoken';
import { Order } from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const orders = await Order.find({}).populate('userId', 'fullName email').sort({ createdAt: -1 });
    return NextResponse.json({ orders });
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

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}