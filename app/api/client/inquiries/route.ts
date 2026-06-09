// app/api/client/inquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

import jwt from 'jsonwebtoken';
import { Inquiry } from '@/models/Inquiry';

// GET - Get inquiries for the logged-in client
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.id;

    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    let query: any = { userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Inquiry.countDocuments(query),
    ]);

    return NextResponse.json({
      inquiries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching client inquiries:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Create a new inquiry for the logged-in client
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.id;

    const body = await req.json();
    const { name, email, phone, company, category, subject, message, preferredContact } = body;

    // Validate required fields
    if (!name || !email || !phone || !category || !message) {
      return NextResponse.json(
        { error: 'Missing required fields. Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Create new inquiry associated with the user
    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      company: company || '',
      category,
      subject: subject || '',
      message,
      preferredContact: preferredContact || 'email',
      userId,
      status: 'pending',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been submitted successfully.',
        inquiry: {
          id: inquiry._id,
          name: inquiry.name,
          email: inquiry.email,
          category: inquiry.category,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating client inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

// PUT - Update inquiry status (client can cancel their own inquiry)
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.id;

    const { id, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Inquiry ID required' }, { status: 400 });
    }

    await connectDB();

    // Find the inquiry and verify it belongs to the user
    const inquiry = await Inquiry.findOne({ _id: id, userId });

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    // Clients can only cancel pending inquiries
    if (status === 'cancelled' && inquiry.status === 'pending') {
      inquiry.status = 'closed';
      await inquiry.save();
      return NextResponse.json({
        success: true,
        message: 'Inquiry cancelled successfully',
        inquiry,
      });
    }

    return NextResponse.json(
      { error: 'Cannot update inquiry status' },
      { status: 403 }
    );
  } catch (error) {
    console.error('Error updating client inquiry:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}