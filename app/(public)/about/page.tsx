// app/about/page.tsx
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
  Avatar,
  Divider,
} from '@mui/material';
import {
  HighQuality as QualityIcon,
  Lightbulb as LightbulbIcon,
  Handshake as HandshakeIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import Image from 'next/image';

const AboutPage = () => {
  const values = [
    {
      icon: <QualityIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Quality',
      description: 'We maintain the highest standards in every product we manufacture.',
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Innovation',
      description: 'We continuously improve our products and processes.',
    },
    {
      icon: <HandshakeIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Integrity',
      description: 'We build long-term relationships through honesty and transparency.',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Customer Success',
      description: 'Our customers\' growth is our success.',
    },
  ];

  const teamMembers = [
    { role: 'Lead Engineer', icon: '👨‍🔧' },
    { role: 'Production Manager', icon: '👩‍🏭' },
    { role: 'Quality Control', icon: '👨‍🔬' },
    { role: 'Customer Support', icon: '👩‍💼' },
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
              About <Box component="span" sx={{ color: '#fff3e0' }}>3MT</Box>
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
              Building Ethiopia's industrial future through innovative manufacturing solutions
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* About Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              mb: 3,
              color: 'text.primary',
            }}
          >
            About 3MT
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'text.secondary',
              mb: 4,
            }}
          >
            3MT Manufacturing & Technology is committed to delivering innovative industrial equipment 
            and manufacturing solutions that empower businesses across Ethiopia and beyond.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'text.secondary',
            }}
          >
            Founded with a vision to strengthen local manufacturing capabilities, we specialize in 
            designing, producing, and supplying high-quality machinery for bakery production, soap 
            manufacturing, stove fabrication, molding operations, and custom industrial applications.
          </Typography>
        </motion.div>

        <Divider sx={{ my: 6 }} />

        {/* Mission & Vision Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Box
                sx={{
                  p: 4,
                  backgroundColor: '#fff5eb',
                  borderRadius: '20px',
                  height: '100%',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                    fontWeight: 700,
                    mb: 2,
                    color: 'primary.main',
                  }}
                >
                  Our Mission
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    color: 'text.secondary',
                  }}
                >
                  To provide reliable, affordable, and innovative manufacturing equipment 
                  that enables businesses to grow and succeed.
                </Typography>
              </Box>
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <Box
                sx={{
                  p: 4,
                  backgroundColor: '#fff5eb',
                  borderRadius: '20px',
                  height: '100%',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                    fontWeight: 700,
                    mb: 2,
                    color: 'primary.main',
                  }}
                >
                  Our Vision
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    color: 'text.secondary',
                  }}
                >
                  To become a leading industrial manufacturing company recognized for quality, 
                  innovation, and customer satisfaction throughout Africa.
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Values Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            Our <Box component="span" sx={{ color: 'primary.main' }}>Values</Box>
          </Typography>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {values.map((value, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div variants={fadeInUp}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      borderRadius: '16px',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>{value.icon}</Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}
                      >
                        {value.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Owner Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Box
            sx={{
              backgroundColor: '#fafafa',
              borderRadius: '24px',
              p: { xs: 3, md: 5 },
              mb: 6,
            }}
          >
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: '200px', md: '250px' },
                    height: { xs: '200px', md: '250px' },
                    mx: 'auto',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid #d97706',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Placeholder for owner's image - replace with actual image */}
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h1" sx={{ fontSize: '5rem' }}>
                      👨‍💼
                    </Typography>
                  </Box>
                  {/* Uncomment and use actual image when available */}
                  {/* <Image
                    src="/Images/owner.jpg"
                    alt="Adisu Abebe - Owner of 3MT"
                    fill
                    style={{ objectFit: 'cover' }}
                  /> */}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2rem' },
                    fontWeight: 700,
                    mb: 1,
                    color: 'text.primary',
                  }}
                >
                  Adisu Abebe
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Founder & Owner
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 3,
                    lineHeight: 1.7,
                  }}
                >
                  Adisu Abebe is the visionary founder of 3MT Manufacturing & Technology. 
                  With deep roots in Hawassa, Ethiopia, Adisu brings years of industry expertise 
                  and a passion for empowering local businesses through quality manufacturing solutions.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: 'primary.main', fontSize: '20px' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Hawassa, Ethiopia
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ color: 'primary.main', fontSize: '20px' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      adisu.abebe@3mt.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ color: 'primary.main', fontSize: '20px' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      +251-XXX-XXX-XXX
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              mb: 3,
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            Our <Box component="span" sx={{ color: 'primary.main' }}>Team</Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: '700px',
              mx: 'auto',
              mb: 4,
              fontSize: '1.05rem',
            }}
          >
            Our team consists of skilled engineers, technicians, designers, and manufacturing 
            specialists dedicated to delivering exceptional industrial solutions.
          </Typography>
          
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {teamMembers.map((member, index) => (
              <Grid size={{ xs: 6, sm: 3 }} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mx: 'auto',
                      mb: 1,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                    }}
                  >
                    {member.icon}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Team Member
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutPage;