// app/components/ProductCategories.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import Link from 'next/link';

const categories = [
  {
    title: 'Bread Baking Equipment',
    description: 'Professional bakery machinery for commercial and industrial baking operations.',
    icon: '🍞',
    href: '/products/baking-bread',
    color: '#d97706',
  },
  {
    title: 'Soap Making Machines',
    description: 'Efficient soap production systems for small, medium, and large-scale manufacturers.',
    icon: '🧼',
    href: '/products/soap-making',
    color: '#f97316',
  },
  {
    title: 'Stoves & Ovens',
    description: 'Energy-efficient cooking and heating solutions for homes and businesses.',
    icon: '🔥',
    href: '/products/stoves-molding',
    color: '#e67e22',
  },
  {
    title: 'Molding Machines',
    description: 'Precision molding equipment for various manufacturing industries.',
    icon: '🏭',
    href: '/products/molding',
    color: '#f39c12',
  },
  {
    title: 'Other Industrial Products',
    description: 'Custom-designed machinery and innovative production solutions.',
    icon: '⚙️',
    href: '/products/other',
    color: '#d35400',
  },
];

const ProductCategories = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: '#ffffff',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              textAlign: 'center',
              mb: 2,
              color: 'text.primary',
            }}
          >
            Our Product <Box component="span" sx={{ color: 'primary.main' }}>Categories</Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              mb: 6,
            }}
          >
            Discover our comprehensive range of manufacturing equipment designed for Ethiopian businesses
          </Typography>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: '120px',
                        background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}40 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h1" sx={{ fontSize: '4rem' }}>
                        {category.icon}
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1.5,
                          color: 'text.primary',
                        }}
                      >
                        {category.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          mb: 2,
                          lineHeight: 1.6,
                        }}
                      >
                        {category.description}
                      </Typography>
                      <Button
                        component={Link}
                        href={category.href}
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          color: 'primary.main',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            transform: 'translateX(4px)',
                          },
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProductCategories;