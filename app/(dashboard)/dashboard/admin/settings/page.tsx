// app/(dashboard)/dashboard/admin/settings/page.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Settings,
} from '@mui/icons-material';

const AdminSettingsPage = () => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    siteName: '3MT Manufacturing',
    siteEmail: 'info@3mt.com',
    sitePhone: '+251-XXX-XXX-XXX',
    siteAddress: 'Hawassa, Ethiopia',
    emailNotifications: true,
    maintenanceMode: false,
  });

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setSuccess('Settings saved successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Settings</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Manage system configuration and preferences
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: '16px', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Settings sx={{ color: '#d97706' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>General Settings</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TextField
              fullWidth
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Site Email"
              type="email"
              value={settings.siteEmail}
              onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Site Phone"
              value={settings.sitePhone}
              onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Site Address"
              value={settings.siteAddress}
              onChange={(e) => setSettings({ ...settings, siteAddress: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Paper>
        </Grid>

        {/* System Settings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: '16px', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SecurityIcon sx={{ color: '#d97706' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>System Settings</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#d97706' } }}
                />
              }
              label="Enable Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#d97706' } }}
                />
              }
              label="Maintenance Mode"
            />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={<SaveIcon />}
          sx={{ bgcolor: '#d97706' }}
        >
          {saving ? <CircularProgress size={24} /> : 'Save All Settings'}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminSettingsPage;