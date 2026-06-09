// app/(dashboard)/dashboard/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Message as InquiriesIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Category as ProductsIcon,
  LocalOffer as PromosIcon,
  Assessment as ReportsIcon,
  Person as ProfileIcon,
  Lock as SecurityIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  Factory as FactoryIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const drawerWidth = 280;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openProducts, setOpenProducts] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);

  const isAdmin = pathname?.includes('/admin');
  const role = isAdmin ? 'admin' : 'client';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUserData();
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
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

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
    router.push('/login');
  };

  // Navigation items based on role
  const adminNavItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/admin' },
    { text: 'Users', icon: <PeopleIcon />, path: '/dashboard/admin/users' },
    { text: 'Products', icon: <ProductsIcon />, path: '/dashboard/admin/products' },
    {text:'Blogs',icon:<FactoryIcon/>,path:'/dashboard/admin/blog'},
    { text: 'Orders', icon: <OrdersIcon />, path: '/dashboard/admin/orders' },
    { text: 'Inquiries', icon: <InquiriesIcon />, path: '/dashboard/admin/inquiries' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/dashboard/admin/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/admin/settings' },
  ];

  const clientNavItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/client' },
    { text: 'My Orders', icon: <OrdersIcon />, path: '/dashboard/client/orders' },
    { text: 'My Inquiries', icon: <InquiriesIcon />, path: '/dashboard/client/inquiries' },
    { text: 'Browse Products', icon: <ProductsIcon />, path: '/products' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/dashboard/client/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/client/settings' },
  ];

  const navItems = role === 'admin' ? adminNavItems : clientNavItems;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Area */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: '#d97706',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>3</Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          3MT Dashboard
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 1,
            bgcolor: '#d97706',
            fontSize: 32,
          }}
        >
          {user?.fullName?.[0] || 'U'}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {user?.fullName || 'User'}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {user?.email || ''}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: '#d97706', fontWeight: 500, mt: 0.5 }}>
          {role === 'admin' ? 'Administrator' : 'Client'}
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            href={item.path}
            onClick={() => isMobile && handleDrawerToggle()}
            sx={{
              borderRadius: '12px',
              mb: 0.5,
              '&:hover': { bgcolor: 'rgba(217, 119, 6, 0.08)' },
              bgcolor: pathname === item.path ? 'rgba(217, 119, 6, 0.12)' : 'transparent',
              color: pathname === item.path ? '#d97706' : 'inherit',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <ListItem
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.08)' },
            color: '#f44336',
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#f44336' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {isAdmin ? 'Admin Panel' : 'Client Area'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <HomeIcon sx={{ fontSize: 18 }} />
                Visit Site
              </Typography>
            </Link>
            
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar sx={{ width: 35, height: 35, bgcolor: '#d97706' }}>
                {user?.fullName?.[0] || 'U'}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard/client/profile'); }}>
                <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard/client/settings'); }}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid rgba(0,0,0,0.05)' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: '#fafafa',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}