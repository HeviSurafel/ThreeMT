// app/(dashboard)/dashboard/admin/reports/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';

const AdminReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('monthly');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalInquiries: 0,
  });
  const [recentData, setRecentData] = useState<any[]>([]);

  useEffect(() => {
    fetchReports();
  }, [reportType]);

  const fetchReports = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/admin/reports?type=${reportType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
        setRecentData(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Implement CSV export
    alert('Export functionality would download CSV file');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#d97706' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Reports & Analytics</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        View business insights and performance metrics
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="caption">Total Users</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#d97706' }}>{stats.totalUsers}</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, color: '#d97706', opacity: 0.5 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="caption">Total Orders</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#d97706' }}>{stats.totalOrders}</Typography>
                </Box>
                <OrdersIcon sx={{ fontSize: 48, color: '#d97706', opacity: 0.5 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="caption">Total Revenue</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#d97706' }}>${stats.totalRevenue.toLocaleString()}</Typography>
                </Box>
                <RevenueIcon sx={{ fontSize: 48, color: '#d97706', opacity: 0.5 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" variant="caption">Total Inquiries</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#d97706' }}>{stats.totalInquiries}</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, color: '#d97706', opacity: 0.5 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Report Controls */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Report Period</InputLabel>
              <Select value={reportType} onChange={(e) => setReportType(e.target.value)} label="Report Period">
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{ borderColor: '#d97706', color: '#d97706' }}
            >
              Export Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Table */}
      {recentData.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Date</TableCell>
                <TableCell align="right">Orders</TableCell>
                <TableCell align="right">Revenue</TableCell>
                <TableCell align="right">Inquiries</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell align="right">{row.orders || 0}</TableCell>
                  <TableCell align="right">${(row.revenue || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">{row.inquiries || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminReportsPage;