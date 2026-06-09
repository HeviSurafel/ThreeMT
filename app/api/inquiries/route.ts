// app/api/inquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

import jwt from 'jsonwebtoken';
import { Inquiry } from '@/models/Inquiry';

// POST - Create a new inquiry
export async function POST(req: NextRequest) {
  try {
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

    // Check if user is logged in to associate inquiry with user
    let userId = null;
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        userId = decoded.id;
      } catch (error) {
        // Token invalid, but that's fine - user can still submit as guest
        console.log('Guest submission');
      }
    }

    // Create new inquiry
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

    // Here you could also send an email notification to admin
    // await sendEmailNotification(inquiry);

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been submitted successfully. We will get back to you within 24 hours.',
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
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Get inquiries (admin only)
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .populate('userId', 'fullName email')
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
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update inquiry status (admin only)
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry status updated successfully',
      inquiry,
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}