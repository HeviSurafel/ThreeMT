// app/(dashboard)/dashboard/admin/products/page.tsx
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
  MenuItem,
  Switch,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  LinearProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AddPhotoAlternate as AddImageIcon,
  DeleteOutlineOutlined as DeleteImageIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import Image from 'next/image';

interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
  file?: File;
}

interface Product {
  _id: string;
  name: string;
  amharicName: string;
  category: string;
  description: string;
  fullDescription?: string;
  price: string;
  capacity: string;
  power: string;
  images: ProductImage[];
  inStock: boolean;
  specifications: string[];
  features: string[];
  color?: string;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    amharicName: '',
    category: '',
    description: '',
    fullDescription: '',
    price: '',
    capacity: '',
    power: '',
    inStock: true,
    specifications: '',
    features: '',
    images: [] as ProductImage[],
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'Bakery Machines',
    'Injera Production Machines',
    'Food Processing Equipment',
    'Coffee Processing Machines',
    'Animal Feed Processing',
    'Soap Manufacturing Equipment',
    'Construction Machines',
    'Plastic Recycling Systems',
    'Gym Equipment',
    'Kitchen Equipment',
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'products'); // Specify type for products
    
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
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data.url;
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setError('');
    
    for (const file of files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only JPEG, PNG, WEBP, and GIF are allowed.`);
        continue;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`File too large: ${file.name}. Max size is 5MB.`);
        continue;
      }
      
      try {
        const imageUrl = await uploadImage(file);
        const newImage: ProductImage = {
          url: imageUrl,
          alt: file.name.split('.')[0],
          isPrimary: formData.images.length === 0,
          order: formData.images.length,
        };
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, newImage],
        }));
        setSuccess(`${file.name} uploaded successfully!`);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(`Failed to upload ${file.name}`);
      }
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImageDialogOpen(false);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const productData = {
      ...formData,
      specifications: formData.specifications.split(',').map(s => s.trim()),
      features: formData.features.split(',').map(f => f.trim()),
    };

    try {
      const response = await fetch('/api/admin/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct ? { ...productData, id: editingProduct._id } : productData),
      });
      if (response.ok) {
        setSuccess(editingProduct ? 'Product updated successfully' : 'Product created successfully');
        fetchProducts();
        setDialogOpen(false);
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to save product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setSuccess('Product deleted successfully');
        fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    // Update order and primary
    newImages.forEach((img, idx) => {
      img.order = idx;
      if (idx === 0 && !img.isPrimary) {
        img.isPrimary = true;
      }
    });
    setFormData({ ...formData, images: newImages });
  };

  const handleSetPrimary = (index: number) => {
    const newImages = formData.images.map((img, idx) => ({
      ...img,
      isPrimary: idx === index,
    }));
    setFormData({ ...formData, images: newImages });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amharicName: '',
      category: '',
      description: '',
      fullDescription: '',
      price: '',
      capacity: '',
      power: '',
      inStock: true,
      specifications: '',
      features: '',
      images: [],
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      amharicName: product.amharicName,
      category: product.category,
      description: product.description,
      fullDescription: product.fullDescription || '',
      price: product.price,
      capacity: product.capacity,
      power: product.power,
      inStock: product.inStock,
      specifications: product.specifications.join(', '),
      features: product.features.join(', '),
      images: product.images || [],
    });
    setDialogOpen(true);
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
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Products Management</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage all products in the catalog with multiple images
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
          Add Product
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell>Images</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {product.images?.slice(0, 3).map((img, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          position: 'relative',
                          width: 40,
                          height: 40,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: img.isPrimary ? '2px solid #d97706' : '1px solid #ddd',
                        }}
                      >
                        <img
                          src={img.url}
                          alt={img.alt}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    ))}
                    {product.images?.length > 3 && (
                      <Chip label={`+${product.images.length - 3}`} size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{product.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{product.amharicName}</Typography>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <Chip label={product.inStock ? 'In Stock' : 'Out of Stock'} size="small" color={product.inStock ? 'success' : 'error'} />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Amharic Name"
            value={formData.amharicName}
            onChange={(e) => setFormData({ ...formData, amharicName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            sx={{ mb: 2 }}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Short Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Full Description"
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Power"
            value={formData.power}
            onChange={(e) => setFormData({ ...formData, power: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          {/* Images Section */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
            Product Images
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Upload product images (JPG, PNG, WEBP - Max 5MB each)
              </Typography>
              <Button
                size="small"
                startIcon={<AddImageIcon />}
                onClick={() => setImageDialogOpen(true)}
                sx={{ color: '#d97706' }}
              >
                Add Image
              </Button>
            </Box>
            
            {uploading && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
            
            {formData.images.length === 0 ? (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                No images added. Click "Add Image" to upload product photos.
              </Typography>
            ) : (
              <ImageList cols={3} gap={8}>
                {formData.images.map((img, idx) => (
                  <ImageListItem key={idx} sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'relative',
                        height: 120,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: img.isPrimary ? '2px solid #d97706' : '1px solid #ddd',
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <ImageListItemBar
                      title={img.isPrimary ? 'Primary Image' : ''}
                      position="top"
                      actionIcon={
                        <Box>
                          {!img.isPrimary && (
                            <IconButton
                              size="small"
                              onClick={() => handleSetPrimary(idx)}
                              sx={{ color: 'white' }}
                            >
                              <StarBorderIcon />
                            </IconButton>
                          )}
                          {img.isPrimary && (
                            <IconButton size="small" sx={{ color: '#FFD700' }}>
                              <StarIcon />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(idx)}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteImageIcon />
                          </IconButton>
                        </Box>
                      }
                      sx={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Paper>

          <TextField
            fullWidth
            label="Specifications (comma separated)"
            value={formData.specifications}
            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Features (comma separated)"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography>In Stock</Typography>
            <Switch
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#d97706' }}>
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Product Images</DialogTitle>
        <DialogContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <Box
            sx={{
              border: '2px dashed #ddd',
              borderRadius: '12px',
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              mt: 2,
              '&:hover': {
                borderColor: '#d97706',
                bgcolor: '#fff5eb',
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon sx={{ fontSize: 48, color: '#d97706', mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>Click to upload images</Typography>
            <Typography variant="caption" color="textSecondary">
              Supports: JPG, PNG, WEBP, GIF (Max 5MB each)
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Tip: First image uploaded will be set as primary. You can change primary later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProductsPage;