// app/api/client/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

import jwt from 'jsonwebtoken';
import { Order } from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    await connectDB();

    const orders = await Order.find({ userId: decoded.id }).sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}