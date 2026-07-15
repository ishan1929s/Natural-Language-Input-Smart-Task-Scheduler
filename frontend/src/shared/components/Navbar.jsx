import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Task,
  Mic,
  Settings,
  AdminPanelSettings,
  Schedule,
  Notifications,
  AccountCircle,
  Logout,
  Brightness4,
  Brightness7,
  Home,
  Analytics,
  People,
  Email,
  Security,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthProvider';

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard />, color: '#6366f1' },
  { label: 'Tasks', path: '/tasks', icon: <Task />, color: '#10b981' },
  { label: 'Voice Input', path: '/voice', icon: <Mic />, color: '#f59e0b' },
  { label: 'Jobs', path: '/jobs', icon: <Schedule />, color: '#3b82f6' },
  { label: 'Admin', path: '/admin', icon: <AdminPanelSettings />, color: '#ec4899', adminOnly: true },
];

const adminSubItems = [
  { label: 'Analytics', path: '/admin/analytics', icon: <Analytics /> },
  { label: 'Users', path: '/admin/users', icon: <People /> },
  { label: 'Email', path: '/admin/email', icon: <Email /> },
  { label: 'Security', path: '/admin/security', icon: <Security /> },
];

const Navbar = ({ onToggleTheme, isDarkMode = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = React.useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ width: 280, height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <Typography 
            variant="h5" 
            className="gradient-text"
            sx={{ fontWeight: 700, fontSize: '1.5rem' }}
          >
            TaskMaster
          </Typography>
        </motion.div>
      </Box>
      
      <List sx={{ px: 2 }}>
        {navigationItems.map((item, index) => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    background: isActive(item.path) 
                      ? `linear-gradient(135deg, ${item.color}20, ${item.color}10)`
                      : 'transparent',
                    border: isActive(item.path) ? `2px solid ${item.color}` : '2px solid transparent',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon sx={{ color: isActive(item.path) ? item.color : 'white', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    sx={{ 
                      color: 'white',
                      '& .MuiListItemText-primary': {
                        fontWeight: isActive(item.path) ? 600 : 400,
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon sx={{ color: theme.palette.text.primary }} />
            </IconButton>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h6" 
                component="div" 
                className="gradient-text"
                sx={{ 
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s ease-in-out',
                }}
                onClick={() => navigate('/dashboard')}
              >
                TaskMaster
              </Typography>
            </motion.div>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle */}
            <IconButton
              onClick={onToggleTheme}
              sx={{
                background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Notifications */}
            <IconButton
              onClick={handleNotificationsOpen}
              sx={{
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #fde68a, #fcd34d)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* User Menu */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                onClick={handleUserMenuOpen}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'transparent' }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRight: 'none',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={user?.fullname || 'User'} secondary={user?.email} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleUserMenuClose}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            minWidth: 300,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
        </Box>
        <MenuItem onClick={handleNotificationsClose}>
          <ListItemText 
            primary="Task deadline approaching" 
            secondary="Meeting with John - 2 hours left"
          />
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          <ListItemText 
            primary="New voice task created" 
            secondary="Call dentist - created from voice input"
          />
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          <ListItemText 
            primary="Weekly summary ready" 
            secondary="Your productivity report is available"
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
