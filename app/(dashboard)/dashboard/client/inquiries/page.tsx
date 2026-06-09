// app/(dashboard)/dashboard/client/inquiries/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Message as MessageIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import Link from 'next/link';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'responded' | 'closed';
  createdAt: string;
}

const ClientInquiriesPage = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/client/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setInquiries(data.inquiries || []);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'reviewed': return 'info';
      case 'responded': return 'primary';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setDialogOpen(true);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>My Inquiries</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Track and manage your support inquiries
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<MessageIcon />}
          href="/inquiries"
          sx={{ bgcolor: '#d97706' }}
        >
          New Inquiry
        </Button>
      </Box>

      {inquiries.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
          <MessageIcon sx={{ fontSize: 64, color: '#d97706', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>No Inquiries Yet</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            You haven't submitted any inquiries yet
          </Typography>
          <Button variant="contained" href="/inquiries" sx={{ bgcolor: '#d97706' }}>
            Submit an Inquiry
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>Subject</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry._id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {inquiry.subject || inquiry.category}
                    </Typography>
                  </TableCell>
                  <TableCell>{inquiry.category}</TableCell>
                  <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={inquiry.status} size="small" color={getStatusColor(inquiry.status) as any} />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleViewInquiry(inquiry)}>
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Inquiry Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedInquiry && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedInquiry.subject || selectedInquiry.category}</Typography>
                <Chip label={selectedInquiry.status} color={getStatusColor(selectedInquiry.status) as any} />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Inquiry Details</Typography>
                <Typography variant="body2"><strong>Category:</strong> {selectedInquiry.category}</Typography>
                <Typography variant="body2"><strong>Date:</strong> {new Date(selectedInquiry.createdAt).toLocaleString()}</Typography>
                <Typography variant="body2"><strong>Message:</strong></Typography>
                <Typography variant="body2" sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mt: 1, whiteSpace: 'pre-wrap' }}>
                  {selectedInquiry.message}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Contact Information</Typography>
                <Typography variant="body2"><strong>Name:</strong> {selectedInquiry.name}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {selectedInquiry.email}</Typography>
                <Typography variant="body2"><strong>Phone:</strong> {selectedInquiry.phone}</Typography>
                {selectedInquiry.company && (
                  <Typography variant="body2"><strong>Company:</strong> {selectedInquiry.company}</Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ClientInquiriesPage;