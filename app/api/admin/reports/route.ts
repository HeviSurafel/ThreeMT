// app/api/admin/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { Inquiry } from '@/models/Inquiry';


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
    const type = url.searchParams.get('type') || 'monthly';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    // User Statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const clientUsers = await User.countDocuments({ role: 'client' });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) },
    });

    // Order Statistics
    const totalOrders = await Order.countDocuments(dateFilter);
    const pendingOrders = await Order.countDocuments({ ...dateFilter, status: 'pending' });
    const processingOrders = await Order.countDocuments({ ...dateFilter, status: 'processing' });
    const shippedOrders = await Order.countDocuments({ ...dateFilter, status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ ...dateFilter, status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ ...dateFilter, status: 'cancelled' });
    
    const orders = await Order.find(dateFilter);
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const paidOrders = await Order.countDocuments({ ...dateFilter, paymentStatus: 'paid' });
    const pendingPayment = await Order.countDocuments({ ...dateFilter, paymentStatus: 'pending' });

    // Inquiry Statistics
    const totalInquiries = await Inquiry.countDocuments(dateFilter);
    const pendingInquiries = await Inquiry.countDocuments({ ...dateFilter, status: 'pending' });
    const reviewedInquiries = await Inquiry.countDocuments({ ...dateFilter, status: 'reviewed' });
    const respondedInquiries = await Inquiry.countDocuments({ ...dateFilter, status: 'responded' });
    const closedInquiries = await Inquiry.countDocuments({ ...dateFilter, status: 'closed' });

    // Product Statistics
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ inStock: true });
    const outOfStockProducts = await Product.countDocuments({ inStock: false });
    
    // Products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          inStock: {
            $sum: { $cond: [{ $eq: ['$inStock', true] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Top products by orders (if you have order items)
    const topProducts = await Order.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          name: { $first: '$products.name' },
          totalSold: { $sum: '$products.quantity' },
          revenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    // Recent data for charts (by day/week/month)
    let recentData = [];
    const now = new Date();
    
    if (type === 'daily') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const dayOrders = await Order.countDocuments({
          createdAt: { $gte: date, $lt: nextDate },
        });
        const dayRevenue = await Order.aggregate([
          { $match: { createdAt: { $gte: date, $lt: nextDate } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const dayInquiries = await Inquiry.countDocuments({
          createdAt: { $gte: date, $lt: nextDate },
        });
        
        recentData.push({
          date: date.toLocaleDateString(),
          orders: dayOrders,
          revenue: dayRevenue[0]?.total || 0,
          inquiries: dayInquiries,
        });
      }
    } else if (type === 'weekly') {
      // Last 12 weeks
      for (let i = 11; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(start.getDate() - (start.getDay() + 7 * i));
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        
        const weekOrders = await Order.countDocuments({
          createdAt: { $gte: start, $lt: end },
        });
        const weekRevenue = await Order.aggregate([
          { $match: { createdAt: { $gte: start, $lt: end } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const weekInquiries = await Inquiry.countDocuments({
          createdAt: { $gte: start, $lt: end },
        });
        
        recentData.push({
          date: `Week ${i + 1}`,
          orders: weekOrders,
          revenue: weekRevenue[0]?.total || 0,
          inquiries: weekInquiries,
        });
      }
    } else if (type === 'monthly') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const monthOrders = await Order.countDocuments({
          createdAt: { $gte: start, $lt: end },
        });
        const monthRevenue = await Order.aggregate([
          { $match: { createdAt: { $gte: start, $lt: end } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const monthInquiries = await Inquiry.countDocuments({
          createdAt: { $gte: start, $lt: end },
        });
        
        recentData.push({
          date: start.toLocaleDateString('default', { month: 'short', year: 'numeric' }),
          orders: monthOrders,
          revenue: monthRevenue[0]?.total || 0,
          inquiries: monthInquiries,
        });
      }
    } else if (type === 'yearly') {
      // Last 5 years
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 1);
        
        const yearOrders = await Order.countDocuments({
          createdAt: { $gte: start, $lt: end },
        });
        const yearRevenue = await Order.aggregate([
          { $match: { createdAt: { $gte: start, $lt: end } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const yearInquiries = await Inquiry.countDocuments({
          createdAt: { $gte: start, $lt: end },
        });
        
        recentData.push({
          date: year.toString(),
          orders: yearOrders,
          revenue: yearRevenue[0]?.total || 0,
          inquiries: yearInquiries,
        });
      }
    }

    return NextResponse.json({
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          admin: adminUsers,
          client: clientUsers,
          newThisMonth: newUsersThisMonth,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
        revenue: {
          total: totalRevenue,
          paid: paidOrders,
          pending: pendingPayment,
        },
        inquiries: {
          total: totalInquiries,
          pending: pendingInquiries,
          reviewed: reviewedInquiries,
          responded: respondedInquiries,
          closed: closedInquiries,
        },
        products: {
          total: totalProducts,
          inStock: inStockProducts,
          outOfStock: outOfStockProducts,
          byCategory: productsByCategory,
          topProducts: topProducts,
        },
      },
      data: recentData,
    });
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}