// app/components/Navbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, spring } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  Button,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ShoppingBag as OrdersIcon,
  Message as InquiriesIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Define navigation items for all users
const publicNavItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Services', href: '/services' },
  { name: 'Blog', href: '/blog' },

  { name: 'Inquiries', href: '/inquiries' },
];

// Custom Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    secondary: {
      main: '#f97316',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
  },
});

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    handleMenuClose();
    router.push('/');
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    handleMenuClose();
  };

  // Get dashboard path based on role
  const getDashboardPath = () => {
    if (user?.role === 'admin') {
      return '/dashboard/admin';
    }
    return '/dashboard/client';
  };

  // Get dynamic navigation items based on auth state
  const getNavItems = () => {
    if (user) {
      return publicNavItems;
    }
    return [...publicNavItems, { name: 'Sign Up', href: '/signup' }, { name: 'Login', href: '/login' }];
  };

  const navItems = getNavItems();

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        type: spring,
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      x: '100%',
      transition: {
        type: spring,
        damping: 25,
        stiffness: 200,
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.3,
      },
    }),
  };

  // Desktop Navigation
  const DesktopNav = () => (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
      {navItems.map((item) => (
        <motion.div key={item.name} variants={itemVariants}>
          <Button
            component={Link}
            href={item.href}
            sx={{
              color: pathname === item.href ? 'primary.main' : 'text.primary',
              fontWeight: pathname === item.href ? 600 : 500,
              px: 2,
              py: 1,
              borderRadius: '12px',
              position: 'relative',
              '&:hover': {
                backgroundColor: 'rgba(217, 119, 6, 0.08)',
                color: 'primary.main',
              },
            }}
          >
            {item.name}
            {pathname === item.href && (
              <motion.div
                layoutId="activeNav"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: '#d97706',
                  borderRadius: '3px',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Button>
        </motion.div>
      ))}

      {/* User Avatar / Auth Buttons */}
      {user ? (
        <Box sx={{ ml: 2 }}>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ p: 0 }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#d97706',
                cursor: 'pointer',
              }}
            >
              {user.fullName?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user.fullName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user.email}
              </Typography>
              <Chip
                label={user.role === 'admin' ? 'Administrator' : 'Client'}
                size="small"
                sx={{
                  mt: 0.5,
                  backgroundColor: user.role === 'admin' ? '#d9770620' : '#4CAF5020',
                  color: user.role === 'admin' ? '#d97706' : '#4CAF50',
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
            </Box>
            <Divider />
            <MenuItem onClick={() => handleNavigate(getDashboardPath())}>
              <DashboardIcon sx={{ mr: 1.5, fontSize: 20, color: '#d97706' }} />
              Dashboard
            </MenuItem>
            {user.role === 'client' && (
              <>
                <MenuItem onClick={() => handleNavigate('/dashboard/client/orders')}>
                  <OrdersIcon sx={{ mr: 1.5, fontSize: 20, color: '#d97706' }} />
                  My Orders
                </MenuItem>
                <MenuItem onClick={() => handleNavigate('/dashboard/client/inquiries')}>
                  <InquiriesIcon sx={{ mr: 1.5, fontSize: 20, color: '#d97706' }} />
                  My Inquiries
                </MenuItem>
              </>
            )}
            <MenuItem onClick={() => handleNavigate('/dashboard/client/profile')}>
              <PersonIcon sx={{ mr: 1.5, fontSize: 20, color: '#d97706' }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/dashboard/client/settings')}>
              <SettingsIcon sx={{ mr: 1.5, fontSize: 20, color: '#d97706' }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: '#f44336' }}>
              <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: '#f44336' }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        // Auth buttons
        <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
          <Button
            component={Link}
            href="/signup"
            variant="outlined"
            sx={{
              borderColor: '#d97706',
              color: '#d97706',
              borderRadius: '10px',
              '&:hover': {
                borderColor: '#b45309',
                backgroundColor: 'rgba(217,119,6,0.05)',
              },
            }}
          >
            Sign Up
          </Button>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            sx={{
              bgcolor: '#d97706',
              borderRadius: '10px',
              '&:hover': { bgcolor: '#b45309' },
            }}
          >
            Login
          </Button>
        </Box>
      )}
    </Box>
  );

  // Mobile Navigation Button
  const MobileNavButton = () => (
    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
      {user && (
        <Avatar
          sx={{
            width: 35,
            height: 35,
            bgcolor: '#d97706',
          }}
          onClick={handleMenuOpen}
        >
          {user.fullName?.[0]?.toUpperCase() || 'U'}
        </Avatar>
      )}
      <IconButton
        color="primary"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(217, 119, 6, 0.08)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  );

  // Mobile Drawer Content
  const MobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          width: '80%',
          maxWidth: '320px',
          backgroundColor: '#ffffff',
          boxShadow: 'none',
          borderLeft: '1px solid rgba(0,0,0,0.05)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'primary.main' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Info in Mobile Drawer */}
        {user && (
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#d97706', width: 50, height: 50 }}>
                {user.fullName?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user.fullName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {user.email}
                </Typography>
                <Chip
                  label={user.role === 'admin' ? 'Admin' : 'Client'}
                  size="small"
                  sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                />
              </Box>
            </Box>
          </Box>
        )}

        <List sx={{ flex: 1, pt: 2 }}>
          {navItems.map((item, index) => (
            <ListItem
              key={item.name}
              component={Link}
              href={item.href}
              onClick={handleDrawerToggle}
              sx={{
                py: 1.5,
                mx: 2,
                mb: 1,
                borderRadius: '12px',
                backgroundColor:
                  pathname === item.href ? 'rgba(217, 119, 6, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(217, 119, 6, 0.08)',
                },
              }}
            >
              <ListItemText disableTypography>
                <Typography
                  sx={{
                    fontWeight: pathname === item.href ? 600 : 500,
                    color: pathname === item.href ? '#d97706' : '#1a1a1a',
                  }}
                >
                  {item.name}
                </Typography>
              </ListItemText>
              {pathname === item.href && (
                <motion.div
                  layoutId="mobileActiveIndicator"
                  style={{
                    width: '4px',
                    height: '24px',
                    backgroundColor: '#d97706',
                    borderRadius: '4px',
                  }}
                />
              )}
            </ListItem>
          ))}

          {/* Dashboard Links for Mobile */}
          {user && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" sx={{ px: 3, py: 1, color: 'text.secondary' }}>
                Account Menu
              </Typography>
              <ListItem
                onClick={() => {
                  handleDrawerToggle();
                  handleNavigate(getDashboardPath());
                }}
                sx={{ py: 1.5, mx: 2, mb: 1, borderRadius: '12px', cursor: 'pointer' }}
              >
                <DashboardIcon sx={{ mr: 1, fontSize: 20, color: '#d97706' }} />
                <ListItemText primary="Dashboard" />
              </ListItem>
              {user.role === 'client' && (
                <>
                  <ListItem
                    onClick={() => {
                      handleDrawerToggle();
                      handleNavigate('/dashboard/client/orders');
                    }}
                    sx={{ py: 1.5, mx: 2, mb: 1, borderRadius: '12px', cursor: 'pointer' }}
                  >
                    <OrdersIcon sx={{ mr: 1, fontSize: 20, color: '#d97706' }} />
                    <ListItemText primary="My Orders" />
                  </ListItem>
                  <ListItem
                    onClick={() => {
                      handleDrawerToggle();
                      handleNavigate('/dashboard/client/inquiries');
                    }}
                    sx={{ py: 1.5, mx: 2, mb: 1, borderRadius: '12px', cursor: 'pointer' }}
                  >
                    <InquiriesIcon sx={{ mr: 1, fontSize: 20, color: '#d97706' }} />
                    <ListItemText primary="My Inquiries" />
                  </ListItem>
                </>
              )}
              <ListItem
                onClick={() => {
                  handleDrawerToggle();
                  handleLogout();
                }}
                sx={{ py: 1.5, mx: 2, mb: 1, borderRadius: '12px', cursor: 'pointer', color: '#f44336' }}
              >
                <LogoutIcon sx={{ mr: 1, fontSize: 20, color: '#f44336' }} />
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          )}
        </List>

        <Box sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#666' }}>
            © {new Date().getFullYear()} 3MT Company
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: scrolled ? 'rgba(0,0,0,0.08)' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: { xs: 2, sm: 3 } }}>
            {/* Logo / Brand */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                }}
              >
                {/* Logo Image */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '54px',
                    height: '54px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    src="/Images/Logo.png"
                    alt="3MT Logo"
                    width={54}
                    height={54}
                    priority
                    style={{
                      objectFit: 'contain',
                    }}
                  />
                </Box>
                
                {/* Company Name */}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: 'text.primary',
                    letterSpacing: '-0.5px',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  3MT
                </Box>
              </Box>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav />

            {/* Mobile Menu Button */}
            <MobileNavButton />
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Spacer to prevent content from hiding under navbar */}
      <Box sx={{ height: { xs: '70px', md: '80px' } }} />
    </ThemeProvider>
  );
};

export default Navbar;