// app/components/Hero.tsx
'use client';

import React from 'react';
import { motion, useScroll, useTransform, easeOut, easeInOut } from 'framer-motion';
import { Box, Container, Button, Typography, Grid, Stack, Chip } from '@mui/material';
import { ArrowForward as ArrowForwardIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.8, delay: 0.2, ease: easeOut },
    },
  };

  const floatingAnimation = (delay: number) => ({
    y: [0, -20, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      delay,
      ease: easeInOut,
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
      }}
    >
      {/* Background Image Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/Images/owner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 0,
        }}
      />

      {/* Animated Grid Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(217, 119, 6, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(217, 119, 6, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          zIndex: 0,
        }}
      />

      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '0%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.4) 0%, rgba(217,119,6,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          position: 'absolute',
          bottom: '0%',
          left: '0%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(249,115,22,0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={6} >
          {/* Left Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Chip
                  label="🏭 Since 2015"
                  sx={{
                    backgroundColor: 'rgba(217, 119, 6, 0.15)',
                    color: '#d97706',
                    fontWeight: 600,
                    mb: 3,
                    backdropFilter: 'blur(10px)',
                    '& .MuiChip-label': { px: 2 },
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 2,
                    color: 'white',
                  }}
                >
                  Building Ethiopia's
                  <Box component="span" sx={{ color: '#d97706', display: 'block' }}>
                    Industrial Future
                  </Box>
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.125rem',
                    color: 'rgba(255,255,255,0.7)',
                    mb: 4,
                    maxWidth: '90%',
                    lineHeight: 1.7,
                  }}
                >
                  3MT Manufacturing & Technology is a leading producer of bread baking equipment, 
                  soap-making machines, industrial stoves, molding solutions, and custom manufacturing 
                  equipment. We help businesses increase productivity with reliable, efficient, 
                  and affordable machinery.
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    href="/products"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      backgroundColor: '#d97706',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#b45309',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 25px rgba(217,119,6,0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Explore Products
                  </Button>
                  <Button
                    component={Link}
                    href="/inquiries"
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#d97706',
                        backgroundColor: 'rgba(217,119,6,0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get a Free Quote
                  </Button>
                </Stack>
              </motion.div>

              {/* Stats Section */}
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 3, sm: 5 },
                    mt: 6,
                    pt: 4,
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    flexWrap: 'wrap',
                  }}
                >
                  {[
                    { value: '10+', label: 'Years Experience' },
                    { value: '500+', label: 'Happy Clients' },
                    { value: '50+', label: 'Products' },
                    { value: '24/7', label: 'Support' },
                  ].map((stat, index) => (
                    <Box key={index}>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: '#d97706', fontSize: { xs: '1.5rem', sm: '2rem' } }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </motion.div>
          </Grid>

          {/* Right Content - Hero Image with Floating Elements */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              style={{ position: 'relative' }}
            >
              <motion.div animate={floatingAnimation(0)}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: { xs: '300px', sm: '400px', md: '480px' },
                    borderRadius: '30px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    backgroundImage: 'url(/Images/owner2.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(217,119,6,0.3) 0%, rgba(0,0,0,0.4) 100%)',
                    }}
                  />
                  {/* Content overlay for the image */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 3,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      3MT Manufacturing
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Quality Industrial Equipment
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              {/* Floating Cards - Left */}
              <motion.div
                animate={floatingAnimation(0.5)}
                style={{
                  position: 'absolute',
                  top: '5%',
                  left: '-10%',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 20px',
                  borderRadius: '20px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  zIndex: 10,
                }}
              >
                <Box
                  sx={{
                    width: 45,
                    height: 45,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #d97706, #f97316)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5">🍞</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    Bakery Equipment
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Premium Quality
                  </Typography>
                </Box>
              </motion.div>

              {/* Floating Cards - Right */}
              <motion.div
                animate={floatingAnimation(1)}
                style={{
                  position: 'absolute',
                  bottom: '15%',
                  right: '-10%',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 20px',
                  borderRadius: '20px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  zIndex: 10,
                }}
              >
                <Box
                  sx={{
                    width: 45,
                    height: 45,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f97316, #d97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5">🧼</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    Soap Making
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Industrial Solutions
                  </Typography>
                </Box>
              </motion.div>

              {/* Floating Cards - Bottom Left */}
              <motion.div
                animate={floatingAnimation(1.5)}
                style={{
                  position: 'absolute',
                  bottom: '30%',
                  left: '-5%',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '10px 16px',
                  borderRadius: '16px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  zIndex: 10,
                }}
              >
                <Box
                  sx={{
                    width: 35,
                    height: 35,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #d97706, #f97316)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6">🔥</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    Stoves & Molding
                  </Typography>
                </Box>
              </motion.div>

              {/* Rating Badge */}
              <motion.div
                animate={floatingAnimation(0.8)}
                style={{
                  position: 'absolute',
                  top: '40%',
                  right: '-5%',
                  backgroundColor: 'rgba(217,119,6,0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px 16px',
                  borderRadius: '20px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 10,
                }}
              >
                <Typography variant="h6">⭐</Typography>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'white' }}>
                    4.9 Rating
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Trusted by 500+
                  </Typography>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <Box
          sx={{
            width: 30,
            height: 50,
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 10,
              backgroundColor: '#d97706',
              borderRadius: '3px',
              mt: 1,
            }}
          />
        </Box>
      </motion.div>
    </Box>
  );
};

export default Hero;