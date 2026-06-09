// app/(dashboard)/dashboard/admin/inquiries/page.tsx
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
  MenuItem,
  TextField,
  Alert,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const AdminInquiriesPage = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/admin/inquiries', {
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

  const handleUpdateStatus = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/admin/inquiries/${selectedInquiry?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setSuccess('Inquiry status updated');
        fetchInquiries();
        setStatusDialogOpen(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  const handleSendReply = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/admin/inquiries/${selectedInquiry?._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: replyMessage, email: selectedInquiry?.email }),
      });
      if (response.ok) {
        setSuccess('Reply sent successfully');
        setReplyDialogOpen(false);
        setReplyMessage('');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      reviewed: 'info',
      responded: 'primary',
      closed: 'success',
    };
    return colors[status] || 'default';
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
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Inquiries Management</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Manage customer inquiries and support requests
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Customer</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry._id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{inquiry.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{inquiry.email}</Typography>
                </TableCell>
                <TableCell>{inquiry.category}</TableCell>
                <TableCell>{inquiry.subject || inquiry.category}</TableCell>
                <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={inquiry.status} size="small" color={getStatusColor(inquiry.status) as any} />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => {
                    setSelectedInquiry(inquiry);
                    setDialogOpen(true);
                  }}>
                    <ViewIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => {
                    setSelectedInquiry(inquiry);
                    setNewStatus(inquiry.status);
                    setStatusDialogOpen(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="primary" onClick={() => {
                    setSelectedInquiry(inquiry);
                    setReplyDialogOpen(true);
                  }}>
                    <ReplyIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Inquiry Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedInquiry && (
          <>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Customer Information</Typography>
                <Typography variant="body2">Name: {selectedInquiry.name}</Typography>
                <Typography variant="body2">Email: {selectedInquiry.email}</Typography>
                <Typography variant="body2">Phone: {selectedInquiry.phone}</Typography>
                {selectedInquiry.company && <Typography variant="body2">Company: {selectedInquiry.company}</Typography>}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Inquiry Details</Typography>
                <Typography variant="body2">Category: {selectedInquiry.category}</Typography>
                <Typography variant="body2">Date: {new Date(selectedInquiry.createdAt).toLocaleString()}</Typography>
                <Typography variant="body2">Status: {selectedInquiry.status}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Message</Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedInquiry.message}
                  </Typography>
                </Paper>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Inquiry Status</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="reviewed">Reviewed</MenuItem>
            <MenuItem value="responded">Responded</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained" sx={{ bgcolor: '#d97706' }}>
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onClose={() => setReplyDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Reply to Customer</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Reply Message"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendReply} variant="contained" sx={{ bgcolor: '#d97706' }}>
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminInquiriesPage;