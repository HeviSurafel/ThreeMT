// app/login/page.tsx
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
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Fixed import

const LoginPage = () => {
  const router = useRouter(); // Fixed - useRouter hook
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Invalid email or password. Please try again.');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value,
    });
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/client');
        }
      } else {
        setErrorMessage(data.error || 'Invalid email or password. Please try again.');
        setSubmitError(true);
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please try again.');
      setSubmitError(true);
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
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
          {/* Left Side - Welcome Message */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 800,
                    mb: 2,
                    color: 'text.primary',
                  }}
                >
                  Welcome <Box component="span" sx={{ color: '#d97706' }}>Back!</Box>
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
                  Sign in to your 3MT account to access your dashboard, track inquiries, manage orders, and get personalized support.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '400px', mx: { xs: 'auto', md: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#fff5eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <LoginIcon sx={{ color: '#d97706' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Access Your Account</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>View your profile and settings</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#fff5eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box component="span" sx={{ fontSize: '1.25rem' }}>📦</Box>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Track Orders</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Monitor your order status</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#fff5eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box component="span" sx={{ fontSize: '1.25rem' }}>💬</Box>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Support & Inquiries</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Get priority customer support</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mt: 4, p: 3, bgcolor: '#fff5eb', borderRadius: '16px' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Don't have an account?{' '}
                    <Link href="/signup" style={{ color: '#d97706', fontWeight: 600, textDecoration: 'none' }}>
                      Create one now
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid size={{ xs: 12, md: 5 }}>
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
                  Sign In
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                  Enter your credentials to access your account
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleChange}
                              sx={{
                                color: '#d97706',
                                '&.Mui-checked': { color: '#d97706' },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Remember me
                            </Typography>
                          }
                        />
                        <Link href="/forgot-password" style={{ color: '#d97706', fontSize: '0.875rem', textDecoration: 'none' }}>
                          Forgot password?
                        </Link>
                      </Box>
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
                        {submitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>OR</Typography>
                </Divider>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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

      {/* Error Snackbar */}
      <Snackbar
        open={submitError}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;