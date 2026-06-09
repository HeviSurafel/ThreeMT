// app/components/Footer.tsx
'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  TextField,
  Button,
  Divider,
  Link as MuiLink,
  Stack,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  Send as SendIcon,
  ArrowUpward as ArrowUpIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = {
    company: {
      title: '3MT Manufacturing',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Products', href: '/products' },
        { name: 'Services', href: '/services' },
        { name: 'Blog', href: '/blog' },
       
        { name: 'Inquiries', href: '/inquiries' },
      ],
    },
    products: {
      title: 'Our Products',
      links: [
        { name: 'Bakery Machines', href: '/products/bakery' },
        { name: 'Injera Machines', href: '/products/injera' },
        { name: 'Food Processing', href: '/products/food-processing' },
        { name: 'Coffee Processing', href: '/products/coffee' },
        { name: 'Soap Manufacturing', href: '/products/soap' },
        { name: 'Construction Machines', href: '/products/construction' },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Inquiries', href: '/inquiries' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Warranty', href: '/warranty' },
      ],
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a1a1a',
        color: '#fff',
        position: 'relative',
      }}
    >
      {/* Scroll to Top Button */}
      <IconButton
        onClick={scrollToTop}
        sx={{
          position: 'absolute',
          top: -20,
          right: 30,
          bgcolor: '#d97706',
          color: 'white',
          width: 45,
          height: 45,
          '&:hover': {
            bgcolor: '#b45309',
          },
        }}
      >
        <ArrowUpIcon />
      </IconButton>

      {/* Main Footer Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: '#d97706',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                    3
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                  3MT Manufacturing
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#aaa', lineHeight: 1.7, mb: 2 }}>
                Building Ethiopia's industrial future through innovative manufacturing solutions. 
                We provide high-quality machinery for bakery, injera, soap, coffee, construction, 
                and recycling industries.
              </Typography>
              
              {/* Social Icons */}
              <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                <IconButton
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: '#d97706' } }}
                  href="https://facebook.com"
                  target="_blank"
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: '#d97706' } }}
                  href="https://twitter.com"
                  target="_blank"
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: '#d97706' } }}
                  href="https://linkedin.com"
                  target="_blank"
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: '#d97706' } }}
                  href="https://instagram.com"
                  target="_blank"
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: '#d97706' } }}
                  href="https://youtube.com"
                  target="_blank"
                >
                  <YouTubeIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#d97706' }}>
              Company
            </Typography>
            <Stack spacing={1.5}>
              {footerSections.company.links.map((link) => (
                <Link key={link.name} href={link.href} passHref legacyBehavior>
                  <MuiLink
                    sx={{
                      color: '#aaa',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                      '&:hover': { color: '#d97706' },
                    }}
                  >
                    {link.name}
                  </MuiLink>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Products Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#d97706' }}>
              Products
            </Typography>
            <Stack spacing={1.5}>
              {footerSections.products.links.map((link) => (
                <Link key={link.name} href={link.href} passHref legacyBehavior>
                  <MuiLink
                    sx={{
                      color: '#aaa',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                      '&:hover': { color: '#d97706' },
                    }}
                  >
                    {link.name}
                  </MuiLink>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Support Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#d97706' }}>
              Support
            </Typography>
            <Stack spacing={1.5}>
              {footerSections.support.links.map((link) => (
                <Link key={link.name} href={link.href} passHref legacyBehavior>
                  <MuiLink
                    sx={{
                      color: '#aaa',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                      '&:hover': { color: '#d97706' },
                    }}
                  >
                    {link.name}
                  </MuiLink>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact & Newsletter */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#d97706' }}>
              Contact Us
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ color: '#d97706', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Hawassa, Ethiopia
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#d97706', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  +251-XXX-XXX-XXX
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#d97706', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  info@3mt.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TimeIcon sx={{ color: '#d97706', fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#aaa' }}>
                  Mon - Fri: 8:00 AM - 6:00 PM<br />
                  Saturday: 9:00 AM - 1:00 PM
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>


        {/* Bottom Bar */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#888', textAlign: 'center' }}>
            © {new Date().getFullYear()} 3MT Manufacturing & Technology. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" passHref legacyBehavior>
              <MuiLink sx={{ color: '#888', textDecoration: 'none', fontSize: '0.75rem', '&:hover': { color: '#d97706' } }}>
                Privacy Policy
              </MuiLink>
            </Link>
            <Link href="/terms" passHref legacyBehavior>
              <MuiLink sx={{ color: '#888', textDecoration: 'none', fontSize: '0.75rem', '&:hover': { color: '#d97706' } }}>
                Terms of Service
              </MuiLink>
            </Link>
            <Link href="/sitemap" passHref legacyBehavior>
              <MuiLink sx={{ color: '#888', textDecoration: 'none', fontSize: '0.75rem', '&:hover': { color: '#d97706' } }}>
                Sitemap
              </MuiLink>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;