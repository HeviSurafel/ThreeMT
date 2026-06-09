// app/signup/page.tsx
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
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Fixed import

const SignupPage = () => {
  const router = useRouter(); // Fixed - useRouter hook
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setSubmitSuccess(true);
        setTimeout(() => {
          // Redirect based on role
         if (data.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/client');
        }
        }, 2000);
      } else {
        setErrors({ ...errors, email: data.error });
        setSubmitting(false);
        setSubmitError(true);
        setTimeout(() => setSubmitError(false), 5000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSubmitting(false);
      setSubmitError(true);
      setTimeout(() => setSubmitError(false), 5000);
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff5eb 0%, #ffffff 100%)',
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Left Side - Benefits */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  color: 'text.primary',
                }}
              >
                Create an <Box component="span" sx={{ color: '#d97706' }}>Account</Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  color: 'text.secondary',
                  mb: 4,
                  lineHeight: 1.7,
                }}
              >
                Join the 3MT community to get exclusive access to product updates, technical resources, and special offers.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Get product catalogs and brochures',
                  'Receive exclusive offers and discounts',
                  'Access technical documentation',
                  'Track your orders and inquiries',
                  'Save your favorite products',
                  'Get priority customer support',
                ].map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: '#d97706' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 4, p: 3, bgcolor: '#fff5eb', borderRadius: '16px' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Already have an account?{' '}
                  <Link href="/login" style={{ color: '#d97706', fontWeight: 600, textDecoration: 'none' }}>
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Side - Signup Form */}
          <Grid size={{ xs: 12, md: 6 }}>
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
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', textAlign: 'center' }}>
                  Sign Up
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                  Create your free account
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                       
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                       
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Company Name (Optional)"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                       
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                      
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                       
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{
                              color: '#d97706',
                              '&.Mui-checked': { color: '#d97706' },
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            I agree to the <Link href="/terms" style={{ color: '#d97706' }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: '#d97706' }}>Privacy Policy</Link>
                          </Typography>
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={submitting}
                        sx={{
                          py: 1.5,
                          borderRadius: '12px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          backgroundColor: '#d97706',
                          '&:hover': { backgroundColor: '#b45309' },
                        }}
                      >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>OR</Typography>
                </Divider>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    sx={{
                      borderColor: '#ddd',
                      color: '#333',
                      textTransform: 'none',
                      '&:hover': { borderColor: '#d97706', backgroundColor: '#fff5eb' },
                    }}
                  >
                    Google
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FacebookIcon />}
                    sx={{
                      borderColor: '#ddd',
                      color: '#333',
                      textTransform: 'none',
                      '&:hover': { borderColor: '#d97706', backgroundColor: '#fff5eb' },
                    }}
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LinkedInIcon />}
                    sx={{
                      borderColor: '#ddd',
                      color: '#333',
                      textTransform: 'none',
                      '&:hover': { borderColor: '#d97706', backgroundColor: '#fff5eb' },
                    }}
                  >
                    LinkedIn
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={submitSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Account created successfully! Redirecting to dashboard...
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
          Signup failed. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignupPage;