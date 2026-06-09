// app/(dashboard)/dashboard/admin/blog/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  Alert,
  Switch,
  FormControlLabel,
  MenuItem,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishedIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import Image from 'next/image';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  authorAvatar: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  'Manufacturing',
  'Bakery Equipment',
  'Soap Making',
  'Coffee Processing',
  'Construction',
  'Tips & Tricks',
  'Success Stories',
  'Industry News',
  'Product Updates',
  'Maintenance Guides',
];

const AdminBlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    author: '',
    readTime: '',
    tags: '',
    isPublished: true,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/admin/blog', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(interval);
      setUploadProgress(100);
      
      const data = await response.json();
      if (response.ok) {
        return data.url;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

// app/(dashboard)/dashboard/admin/blog/page.tsx (updated section)

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;
  
  setError('');
  
  const file = files[0];
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    setError('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.');
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setError('File too large. Max size is 5MB.');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'blog'); // Specify type for blog
    
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });
    
    clearInterval(interval);
    setUploadProgress(100);
    
    const data = await response.json();
    if (response.ok) {
      setFormData(prev => ({ ...prev, image: data.url }));
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(data.error);
    }
  } catch (err) {
    setError('Failed to upload image');
  } finally {
    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
    }, 500);
  }
  
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

  const handleSubmit = async () => {
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.author) {
      setError('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem('token');
    const blogData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
    };

    try {
      const response = await fetch('/api/admin/blog', {
        method: editingPost ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingPost ? { ...blogData, id: editingPost._id } : blogData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(editingPost ? 'Post updated successfully' : 'Post created successfully');
        fetchPosts();
        setDialogOpen(false);
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save post');
      }
    } catch (error) {
      setError('Failed to save post');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setSuccess('Post deleted successfully');
        fetchPosts();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/admin/blog/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      if (response.ok) {
        setSuccess(post.isPublished ? 'Post unpublished' : 'Post published');
        fetchPosts();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to update post status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      category: '',
      author: '',
      readTime: '',
      tags: '',
      isPublished: true,
    });
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      category: post.category,
      author: post.author,
      readTime: post.readTime,
      tags: post.tags.join(', '),
      isPublished: post.isPublished,
    });
    setDialogOpen(true);
  };

  const handleView = (post: BlogPost) => {
    setViewingPost(post);
    setViewDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#d97706' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Blog Management</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Create, edit, and manage blog posts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          sx={{ bgcolor: '#d97706' }}
        >
          New Post
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>
                  <Box
                    sx={{
                      position: 'relative',
                      width: 60,
                      height: 60,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      bgcolor: '#f5f5f5',
                    }}
                  >
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="caption">No image</Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={post.category} size="small" />
                </TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>
                  <Chip
                    label={post.isPublished ? 'Published' : 'Draft'}
                    size="small"
                    color={post.isPublished ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleView(post)}>
                    <ViewIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleEdit(post)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleTogglePublish(post)}>
                    {post.isPublished ? <UnpublishedIcon /> : <PublishIcon />}
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(post._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Post Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            required
          />
          <TextField
            fullWidth
            select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            sx={{ mb: 2 }}
            required
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Read Time (e.g., '5 min read')"
            value={formData.readTime}
            onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
            sx={{ mb: 2 }}
            placeholder="5 min read"
          />
          
          {/* Image Upload Section */}
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Featured Image</Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <Box
            sx={{
              border: '2px dashed #ddd',
              borderRadius: '12px',
              p: 2,
              mb: 2,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#d97706',
                bgcolor: '#fff5eb',
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Box>
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ mb: 1 }} />
                <Typography variant="caption">Uploading... {uploadProgress}%</Typography>
              </Box>
            ) : formData.image ? (
              <Box sx={{ position: 'relative', width: '100%', height: 150 }}>
                <Image
                  src={formData.image}
                  alt="Preview"
                  fill
                  style={{ objectFit: 'contain' }}
                />
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData({ ...formData, image: '' });
                  }}
                  sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                >
                  Remove
                </Button>
              </Box>
            ) : (
              <Box>
                <UploadIcon sx={{ fontSize: 48, color: '#d97706', mb: 1 }} />
                <Typography variant="body2">Click to upload featured image</Typography>
                <Typography variant="caption" color="textSecondary">
                  Supports: JPG, PNG, WEBP, GIF (Max 5MB)
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            sx={{ mb: 2 }}
            placeholder="Bakery, Equipment, Tips"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#d97706' } }}
              />
            }
            label="Publish immediately"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#d97706' }}>
            {editingPost ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Post Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        {viewingPost && (
          <>
            <DialogTitle>{viewingPost.title}</DialogTitle>
            <DialogContent>
              {viewingPost.image && (
                <Box sx={{ mb: 2, position: 'relative', width: '100%', height: 250 }}>
                  <Image
                    src={viewingPost.image}
                    alt={viewingPost.title}
                    fill
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                </Box>
              )}
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                <strong>Category:</strong> {viewingPost.category}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                <strong>Author:</strong> {viewingPost.author} | <strong>Read Time:</strong> {viewingPost.readTime}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                <strong>Published:</strong> {new Date(viewingPost.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                <strong>Excerpt:</strong> {viewingPost.excerpt}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {viewingPost.content}
              </Typography>
              {viewingPost.tags && viewingPost.tags.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <strong>Tags:</strong>
                  {viewingPost.tags.map((tag, idx) => (
                    <Chip key={idx} label={tag} size="small" />
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminBlogPage;