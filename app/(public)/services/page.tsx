// app/services/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  DesignServices as DesignServicesIcon,
  Engineering as EngineeringIcon,
  InstallDesktopSharp as InstallationIcon,
  Build as BuildIcon,
  School as SchoolIcon,
  Factory as FactoryIcon,
  ContactSupport as ConsultIcon,
  SupportAgent as SupportAgentIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Settings as SettingsIcon,
  LocalShipping as LocalShippingIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import Link from 'next/link';

const ServicesPage = () => {
  const services = [
    {
      id: 'design',
      title: 'Machine Design & Manufacturing',
      icon: <DesignServicesIcon sx={{ fontSize: 48 }} />,
      description: 'We design and manufacture high-quality industrial machines tailored to the needs of various industries, including food processing, construction, recycling, fitness, and manufacturing.',
      detailedDescription: 'Our design process combines industry expertise with advanced engineering to create machines that deliver exceptional performance and durability. From concept to production, we ensure every machine meets your specific requirements.',
      features: [
        'Custom machine design',
        '3D modeling and simulation',
        'Prototype development',
        'Full manufacturing capability',
        'Quality control testing',
      ],
      color: '#d97706',
    },
    {
      id: 'custom',
      title: 'Custom Engineering Solutions',
      icon: <EngineeringIcon sx={{ fontSize: 48 }} />,
      description: 'Every business is unique. Our engineering team develops customized machinery and production systems based on specific operational requirements.',
      detailedDescription: 'We understand that standard solutions don\'t always fit unique business needs. Our engineering team works closely with you to develop tailored solutions that address your specific challenges and goals.',
      features: [
        'Needs assessment',
        'Custom design development',
        'Process optimization',
        'Integration with existing systems',
        'Scalable solutions',
      ],
      color: '#e67e22',
    },
    {
      id: 'installation',
      title: 'Installation & Commissioning',
      icon: <InstallationIcon sx={{ fontSize: 48 }} />,
      description: 'We ensure that all equipment is properly installed, tested, and ready for operation. Our technicians provide complete commissioning services to guarantee optimal performance.',
      detailedDescription: 'Professional installation is critical for machine performance and longevity. Our certified technicians handle everything from site preparation to final testing, ensuring your equipment operates at peak efficiency from day one.',
      features: [
        'Site assessment',
        'Professional installation',
        'System integration',
        'Performance testing',
        'Commissioning certification',
      ],
      color: '#f39c12',
    },
    {
      id: 'maintenance',
      title: 'Maintenance & Repair Services',
      icon: <BuildIcon sx={{ fontSize: 48 }} />,
      description: 'Regular maintenance is essential for maximizing machine lifespan and efficiency. We offer preventive maintenance, troubleshooting, repairs, and replacement parts.',
      detailedDescription: 'Our maintenance programs help prevent costly breakdowns and extend equipment life. We offer flexible service plans, emergency repairs, and genuine replacement parts to keep your operations running smoothly.',
      features: [
        'Preventive maintenance plans',
        'Emergency repair service',
        'Genuine replacement parts',
        'Performance optimization',
        '24/7 technical support',
      ],
      color: '#4CAF50',
    },
    {
      id: 'training',
      title: 'Technical Training',
      icon: <SchoolIcon sx={{ fontSize: 48 }} />,
      description: 'Our experts provide hands-on training to machine operators and technical staff, ensuring safe and efficient equipment operation.',
      detailedDescription: 'Proper training is key to maximizing productivity and safety. We offer comprehensive training programs tailored to your team\'s skill level and equipment types.',
      features: [
        'Operator training',
        'Maintenance training',
        'Safety protocols',
        'Hands-on practice',
        'Training certification',
      ],
      color: '#9C27B0',
    },
    {
      id: 'production',
      title: 'Production Line Setup',
      icon: <FactoryIcon sx={{ fontSize: 48 }} />,
      description: 'We assist businesses in planning, designing, and implementing complete production lines for bakery products, soap manufacturing, coffee processing, animal feed production, and more.',
      detailedDescription: 'From concept to full operation, we help you design and implement efficient production lines that maximize output while minimizing costs and downtime.',
      features: [
        'Production line design',
        'Equipment selection',
        'Layout optimization',
        'Workflow analysis',
        'Full implementation support',
      ],
      color: '#00ACC1',
    },
    {
      id: 'consultation',
      title: 'Consultation Services',
      icon: <ConsultIcon sx={{ fontSize: 48 }} />,
      description: 'Our specialists provide professional consultation to help clients select the most suitable equipment and production systems for their business goals.',
      detailedDescription: 'Making the right equipment choices is critical for business success. Our consultation services help you make informed decisions based on your production needs, budget, and growth plans.',
      features: [
        'Needs analysis',
        'Equipment selection guidance',
        'ROI analysis',
        'Market research',
        'Business planning support',
      ],
      color: '#F44336',
    },
    {
      id: 'support',
      title: 'After-Sales Support',
      icon: <SupportAgentIcon sx={{ fontSize: 48 }} />,
      description: 'We are committed to long-term customer success through ongoing technical support, maintenance assistance, and operational guidance.',
      detailedDescription: 'Our relationship doesn\'t end after purchase. We provide ongoing support to ensure your equipment continues performing optimally throughout its lifecycle.',
      features: [
        'Technical hotline',
        'Remote diagnostics',
        'On-site service visits',
        'Software updates',
        'Warranty support',
      ],
      color: '#FF5722',
    },
  ];

  const whyChooseUs = [
    {
      icon: <SecurityIcon sx={{ fontSize: 32 }} />,
      title: 'Quality Assured',
      description: 'All our services meet international quality standards',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32 }} />,
      title: 'Fast Response',
      description: 'Quick turnaround times for all service requests',
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 32 }} />,
      title: 'Expert Team',
      description: 'Skilled engineers and technicians with years of experience',
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 32 }} />,
      title: 'On-Time Delivery',
      description: 'Reliable project completion within agreed timelines',
    },
  ];

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
          py: { xs: 6, md: 10 },
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
              Our <Box component="span" sx={{ color: '#fff3e0' }}>Services</Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
                opacity: 0.95,
              }}
            >
              Comprehensive industrial solutions to help your business grow and succeed
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Introduction */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'text.secondary',
              textAlign: 'center',
              maxWidth: '900px',
              mx: 'auto',
              mb: 6,
            }}
          >
            At 3MT Manufacturing & Technology, we provide comprehensive industrial solutions that go beyond 
            manufacturing machinery. Our services are designed to help businesses maximize productivity, 
            improve efficiency, and achieve long-term success.
          </Typography>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={service.id}>
                <motion.div variants={fadeInUp}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}CC 100%)`,
                        p: 3,
                        color: 'white',
                      }}
                    >
                      <Box sx={{ mb: 1 }}>{service.icon}</Box>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {service.title}
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.7 }}>
                        {service.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.7 }}>
                        {service.detailedDescription}
                      </Typography>
                      <List dense sx={{ mb: 2 }}>
                        {service.features.map((feature, idx) => (
                          <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircleIcon sx={{ fontSize: 16, color: service.color }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={feature} 
                                
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Button
                        component={Link}
                        href="/inquiries"
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          mt: 1,
                          backgroundColor: service.color,
                          '&:hover': {
                            backgroundColor: service.color,
                            opacity: 0.9,
                          },
                          textTransform: 'none',
                        }}
                      >
                        Request This Service
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Box sx={{ mt: 8, mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.75rem', md: '2rem' },
                fontWeight: 700,
                textAlign: 'center',
                mb: 4,
                color: 'text.primary',
              }}
            >
              Why Choose <Box component="span" sx={{ color: 'primary.main' }}>3MT Services</Box>?
            </Typography>
            <Grid container spacing={3}>
              {whyChooseUs.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Service Process */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              backgroundColor: '#fafafa',
              borderRadius: '24px',
              mb: 6,
            }}
          >
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
              Our Service Process
            </Typography>
            <Grid container spacing={3}>
              {[
                { step: '01', title: 'Consultation', description: 'Understand your needs and requirements' },
                { step: '02', title: 'Assessment', description: 'Evaluate existing systems and constraints' },
                { step: '03', title: 'Solution Design', description: 'Develop customized solution proposal' },
                { step: '04', title: 'Implementation', description: 'Execute the service with quality assurance' },
                { step: '05', title: 'Testing & Handover', description: 'Ensure optimal performance' },
                { step: '06', title: 'Follow-up Support', description: 'Ongoing assistance and maintenance' },
              ].map((process, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: 'primary.main',
                        opacity: 0.5,
                        lineHeight: 1,
                      }}
                    >
                      {process.step}
                    </Typography>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {process.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {process.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>

        {/* Industries We Serve */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
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
            Industries We Serve
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 6 }}>
            {[
              'Food & Beverage',
              'Construction',
              'Plastic Recycling',
              'Fitness & Sports',
              'Soap & Cosmetics',
              'Coffee Processing',
              'Animal Feed Production',
              'Bakery Industry',
              'Hospitality',
            ].map((industry, index) => (
              <Chip
                key={index}
                label={industry}
                sx={{
                  backgroundColor: '#fff5eb',
                  color: '#d97706',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  py: 2,
                  '&:hover': {
                    backgroundColor: '#d97706',
                    color: 'white',
                  },
                }}
              />
            ))}
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
              p: { xs: 4, md: 5 },
              backgroundColor: '#fff5eb',
              borderRadius: '24px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
              Need Professional Service for Your Business?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Contact our service team today for a free consultation and quote.
            </Typography>
            <Button
              component={Link}
              href="/inquiries"
              variant="contained"
              size="large"
              startIcon={<ConsultIcon />}
              sx={{
                backgroundColor: 'primary.main',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Get a Free Consultation
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ServicesPage;