// app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  Message as InquiriesIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ClientDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalInquiries: 0,
    pendingOrders: 0,
  });
  const [profileDialog, setProfileDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [userRes, ordersRes, inquiriesRes] = await Promise.all([
        fetch('/api/auth/me', { headers }),
        fetch('/api/client/orders', { headers }),
        fetch('/api/client/inquiries', { headers }),
      ]);

      const userData = await userRes.json();
      const ordersData = await ordersRes.json();
      const inquiriesData = await inquiriesRes.json();

      setUser(userData.user);
      setOrders(ordersData.orders || []);
      setInquiries(inquiriesData.inquiries || []);

      setStats({
        totalOrders: ordersData.orders?.length || 0,
        totalInquiries: inquiriesData.inquiries?.length || 0,
        pendingOrders: ordersData.orders?.filter((o: any) => o.status === 'pending').length || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleNewInquiry = () => {
    router.push('/inquiries');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#d97706', color: 'white', py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                My Dashboard
              </Typography>
              <Typography variant="body1">Welcome back, {user?.fullName}!</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={() => setProfileDialog(true)}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Total Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.totalOrders}
                    </Typography>
                  </Box>
                  <OrdersIcon sx={{ fontSize: 48, color: '#d97706' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Pending Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.pendingOrders}
                    </Typography>
                  </Box>
                  <OrdersIcon sx={{ fontSize: 48, color: '#d97706' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      My Inquiries
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.totalInquiries}
                    </Typography>
                  </Box>
                  <InquiriesIcon sx={{ fontSize: 48, color: '#d97706' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Orders */}
        <Paper sx={{ borderRadius: '16px', overflow: 'hidden', mb: 4 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Orders</Typography>
            <Button component={Link} href="/orders" size="small" sx={{ color: '#d97706' }}>View All</Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.slice(0, 5).map((order: any) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{order.products.length} items</TableCell>
                    <TableCell>${order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={order.status} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No orders yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Recent Inquiries */}
        <Paper sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Inquiries</Typography>
            <Button onClick={handleNewInquiry} size="small" sx={{ color: '#d97706' }}>New Inquiry</Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inquiries.slice(0, 5).map((inquiry: any) => (
                  <TableRow key={inquiry._id}>
                    <TableCell>{inquiry.subject || inquiry.category}</TableCell>
                    <TableCell>{inquiry.category}</TableCell>
                    <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={inquiry.status} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
                {inquiries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No inquiries yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Profile Dialog */}
      <Dialog open={profileDialog} onClose={() => setProfileDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>My Profile</DialogTitle>
        <DialogContent>
          {user && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: '#d97706', fontSize: 40 }}>
                  {user.fullName?.[0]}
                </Avatar>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Full Name" value={user.fullName} disabled />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Email" value={user.email} disabled />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Phone" value={user.phone} disabled />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Company" value={user.company || 'N/A'} disabled />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientDashboard;