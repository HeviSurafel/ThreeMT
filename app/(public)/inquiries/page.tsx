// app/inquiries/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import Link from 'next/link';

const InquiriesPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    category: '',
    message: '',
    preferredContact: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
const [error, setError] = useState('');
  const categories = [
    'Bakery Equipment',
    'Injera Production Machines',
    'Food Processing Equipment',
    'Coffee Processing Machines',
    'Animal Feed Processing',
    'Soap Manufacturing Equipment',
    'Construction Machines',
    'Plastic Recycling Systems',
    'Gym Equipment',
    'Kitchen Equipment',
    'Custom Manufacturing',
    'Maintenance Service',
    'Other',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 // app/inquiries/page.tsx - Update the handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form
  if (!formData.name || !formData.email || !formData.phone || !formData.category || !formData.message) {
    setError('Please fill in all required fields');
    setTimeout(() => setError(''), 3000);
    return;
  }

  setSubmitting(true);
  setError('');
  
  try {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers,
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        category: '',
        message: '',
        preferredContact: '',
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } else {
      setError(data.error || 'Failed to submit inquiry. Please try again.');
      setSubmitError(true);
      setTimeout(() => setSubmitError(false), 5000);
    }
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    setError('Network error. Please try again.');
    setSubmitError(true);
    setTimeout(() => setSubmitError(false), 5000);
  } finally {
    setSubmitting(false);
  }
};

  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
    setSubmitError(false);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d97706 0%, #f97316 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                mb: 2,
                textAlign: 'center',
              }}
            >
              Get In <Box component="span" sx={{ color: '#fff3e0' }}>Touch</Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                textAlign: 'center',
                maxWidth: '700px',
                mx: 'auto',
                opacity: 0.95,
              }}
            >
              Have questions about our products or services? Fill out the form below and our team will get back to you promptly.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={5}>
          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: '20px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                  Send Us a Message
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Fill out the form below and we'll respond within 24 hours
                </Typography>

                <form onSubmit={handleSubmit}>
                  {error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {error}
  </Alert>
)}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Adisu Abebe"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contact@example.com"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+251 9XX XXX XXX"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        select
                        label="Inquiry Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="" disabled>Select a category</MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief subject line"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        multiline
                        rows={5}
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide details about your inquiry..."
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        select
                        label="Preferred Contact Method"
                        name="preferredContact"
                        value={formData.preferredContact}
                        onChange={handleChange}
                      >
                        <MenuItem value="" disabled>Select preferred contact method</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="phone">Phone</MenuItem>
                        <MenuItem value="whatsapp">WhatsApp</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={submitting}
                        sx={{
                          mt: 2,
                          py: 1.5,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          backgroundColor: '#d97706',
                          '&:hover': { backgroundColor: '#b45309' },
                        }}
                        endIcon={!submitting && <SendIcon />}
                      >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Inquiry'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </motion.div>
          </Grid>

          {/* Contact Information */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Contact Info Cards */}
              <motion.div variants={fadeInUp}>
                <Card
                  sx={{
                    mb: 3,
                    borderRadius: '16px',
                    backgroundColor: '#fff5eb',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                      Contact Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PhoneIcon sx={{ color: '#d97706' }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Phone</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>+251-XXX-XXX-XXX</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <EmailIcon sx={{ color: '#d97706' }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Email</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>info@3mt.com</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LocationOnIcon sx={{ color: '#d97706' }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Address</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>Hawassa, Ethiopia</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AccessTimeIcon sx={{ color: '#d97706' }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Business Hours</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>Mon - Fri: 8:00 AM - 6:00 PM</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Connect With Us */}
              <motion.div variants={fadeInUp}>
                <Card sx={{ mb: 3, borderRadius: '16px' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                      Connect With Us
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <IconButton
                        sx={{
                          backgroundColor: '#25D366',
                          color: 'white',
                          '&:hover': { backgroundColor: '#128C7E' },
                        }}
                      >
                        <WhatsAppIcon />
                      </IconButton>
                      <IconButton
                        sx={{
                          backgroundColor: '#1877F2',
                          color: 'white',
                          '&:hover': { backgroundColor: '#0D6DD9' },
                        }}
                      >
                        <FacebookIcon />
                      </IconButton>
                      <IconButton
                        sx={{
                          backgroundColor: '#1DA1F2',
                          color: 'white',
                          '&:hover': { backgroundColor: '#0C8BD9' },
                        }}
                      >
                        <TwitterIcon />
                      </IconButton>
                      <IconButton
                        sx={{
                          backgroundColor: '#0077B5',
                          color: 'white',
                          '&:hover': { backgroundColor: '#005E8C' },
                        }}
                      >
                        <LinkedInIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Why Choose Us */}
              <motion.div variants={fadeInUp}>
                <Card sx={{ borderRadius: '16px' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                      Why Choose 3MT?
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {[
                        'Quick response within 24 hours',
                        'Free consultation and quotes',
                        'Expert technical support',
                        'Custom solutions available',
                        'On-site service options',
                      ].map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#d97706' }} />
                          <Typography variant="body2">{item}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 700,
                textAlign: 'center',
                mb: 4,
                color: 'text.primary',
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Grid container spacing={3}>
              {[
                {
                  q: 'How quickly will I receive a response?',
                  a: 'We typically respond to all inquiries within 24 hours during business days.',
                },
                {
                  q: 'Do you offer free quotes?',
                  a: 'Yes, we provide free, no-obligation quotes for all our products and services.',
                },
                {
                  q: 'Can you customize equipment for my business?',
                  a: 'Absolutely! We specialize in custom manufacturing solutions tailored to your specific needs.',
                },
                {
                  q: 'Do you provide installation services?',
                  a: 'Yes, we offer professional installation and commissioning services for all our equipment.',
                },
              ].map((faq, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Paper sx={{ p: 2.5, borderRadius: '12px', height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#d97706' }}>
                      {faq.q}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {faq.a}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Box
            sx={{
              mt: 6,
              p: { xs: 4, md: 5 },
              backgroundColor: '#fafafa',
              borderRadius: '24px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
              Prefer to call us directly?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Our team is ready to assist you with any questions about our products and services.
            </Typography>
            <Button
              href="tel:+251XXXXXXXXX"
              variant="outlined"
              size="large"
              startIcon={<PhoneIcon />}
              sx={{
                borderColor: '#d97706',
                color: '#d97706',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#b45309',
                  backgroundColor: 'rgba(217,119,6,0.05)',
                },
              }}
            >
              Call Us Now: +251-XXX-XXX-XXX
            </Button>
          </Box>
        </motion.div>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={submitSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Thank you for your inquiry! We'll get back to you within 24 hours.
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={submitError}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Something went wrong. Please try again or contact us directly.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InquiriesPage;