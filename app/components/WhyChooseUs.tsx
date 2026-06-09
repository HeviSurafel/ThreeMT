// app/components/WhyChooseUs.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  Build as BuildIcon,
  Engineering as EngineeringIcon,
  DesignServices as DesignServicesIcon,
  SupportAgent as SupportAgentIcon,
} from '@mui/icons-material';

const features = [
  {
    icon: <BuildIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Quality Manufacturing',
    description: 'Built with durable materials and engineered for long-lasting performance.',
  },
  {
    icon: <EngineeringIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Expert Team',
    description: 'Experienced engineers and technicians dedicated to delivering excellence.',
  },
  {
    icon: <DesignServicesIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Custom Solutions',
    description: 'Tailored machinery and equipment designed to meet your business needs.',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'After-Sales Support',
    description: 'Installation, maintenance, training, and technical support services.',
  },
];

const WhyChooseUs = () => {
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
        backgroundColor: '#fafafa',
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
            Why Choose <Box component="span" sx={{ color: 'primary.main' }}>3MT</Box>?
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
            We combine technical expertise with customer-focused service to deliver the best manufacturing solutions in Ethiopia
          </Typography>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: 'text.primary',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
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

export default WhyChooseUs;