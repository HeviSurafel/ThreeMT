// app/admin/page.tsx
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
  Chip,
  Tabs,
  Tab,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Message as InquiriesIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalInquiries: 0,
    totalRevenue: 0,
  });
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
      const [usersRes, inquiriesRes, ordersRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/inquiries', { headers }),
        fetch('/api/admin/orders', { headers }),
      ]);

      const usersData = await usersRes.json();
      const inquiriesData = await inquiriesRes.json();
      const ordersData = await ordersRes.json();

      setUsers(usersData.users || []);
      setInquiries(inquiriesData.inquiries || []);
      setOrders(ordersData.orders || []);

      setStats({
        totalUsers: usersData.users?.length || 0,
        totalOrders: ordersData.orders?.length || 0,
        totalInquiries: inquiriesData.inquiries?.length || 0,
        totalRevenue: ordersData.orders?.reduce((sum: number, order: any) => sum + order.totalAmount, 0) || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleViewInquiry = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#d97706', color: 'white', py: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1">Welcome back! Here's what's happening with your business today.</Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Total Users
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.totalUsers}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 48, color: '#d97706' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Total Inquiries
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" variant="caption">
                      Total Revenue
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ${stats.totalRevenue.toLocaleString()}
                    </Typography>
                  </Box>
                  <RevenueIcon sx={{ fontSize: 48, color: '#d97706' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Users" />
            <Tab label="Inquiries" />
            <Tab label="Orders" />
          </Tabs>

          {/* Users Tab */}
          <TabPanel value={tabValue} index={0}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: '#d97706' }}>{user.fullName[0]}</Avatar>
                          {user.fullName}
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.company || '-'}</TableCell>
                      <TableCell>
                        <Chip label={user.role} size="small" color={user.role === 'admin' ? 'primary' : 'default'} />
                      </TableCell>
                      <TableCell>
                        <Chip label={user.isActive ? 'Active' : 'Inactive'} size="small" color={user.isActive ? 'success' : 'error'} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Inquiries Tab */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inquiries.map((inquiry: any) => (
                    <TableRow key={inquiry._id}>
                      <TableCell>{inquiry.name}</TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell>{inquiry.category}</TableCell>
                      <TableCell>
                        <Chip label={inquiry.status} size="small" />
                      </TableCell>
                      <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined" onClick={() => handleViewInquiry(inquiry)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Orders Tab */}
          <TabPanel value={tabValue} index={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order #</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order._id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.userId?.fullName || 'N/A'}</TableCell>
                      <TableCell>{order.products.length} items</TableCell>
                      <TableCell>${order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={order.status} size="small" />
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Container>

      {/* Inquiry Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Inquiry Details</DialogTitle>
        <DialogContent>
          {selectedInquiry && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Customer Information</Typography>
              <Typography variant="body2"><strong>Name:</strong> {selectedInquiry.name}</Typography>
              <Typography variant="body2"><strong>Email:</strong> {selectedInquiry.email}</Typography>
              <Typography variant="body2"><strong>Phone:</strong> {selectedInquiry.phone}</Typography>
              <Typography variant="body2"><strong>Company:</strong> {selectedInquiry.company || 'N/A'}</Typography>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>Inquiry Details</Typography>
              <Typography variant="body2"><strong>Category:</strong> {selectedInquiry.category}</Typography>
              <Typography variant="body2"><strong>Subject:</strong> {selectedInquiry.subject || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Message:</strong></Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {selectedInquiry.message}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained" sx={{ bgcolor: '#d97706' }}>Mark as Responded</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;