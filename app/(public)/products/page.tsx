// app/products/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Modal,
  IconButton,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RequestQuote as RequestQuoteIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

interface Product {
  _id: string;
  name: string;
  amharicName: string;
  category: string;
  categoryId?: string;
  description: string;
  fullDescription?: string;
  price: string;
  capacity: string;
  power: string;
  images: ProductImage[];
  inStock: boolean;
  specifications: string[];
  features: string[];
  color: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ open: boolean; url: string; title: string }>({
    open: false,
    url: '',
    title: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Category mapping for icons and display
  const categoryMap: Record<string, { name: string; icon: string; color: string }> = {
    'Bakery Machines': { name: 'Bakery Machines', icon: '🍞', color: '#d97706' },
    'Injera Production Machines': { name: 'Injera Machines', icon: '🥞', color: '#e67e22' },
    'Food Processing Equipment': { name: 'Food Processing', icon: '🥘', color: '#f39c12' },
    'Coffee Processing Machines': { name: 'Coffee Processing', icon: '☕', color: '#8B4513' },
    'Animal Feed Processing': { name: 'Animal Feed', icon: '🐔', color: '#4CAF50' },
    'Soap Manufacturing Equipment': { name: 'Soap Manufacturing', icon: '🧼', color: '#9C27B0' },
    'Construction Machines': { name: 'Construction', icon: '🏗️', color: '#607D8B' },
    'Plastic Recycling Systems': { name: 'Plastic Recycling', icon: '♻️', color: '#00ACC1' },
    'Gym Equipment': { name: 'Gym Equipment', icon: '💪', color: '#F44336' },
    'Kitchen Equipment': { name: 'Kitchen Equipment', icon: '🍳', color: '#FF5722' },
  };

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
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

  // Get unique categories from products
  const categories = [
    { id: 'all', name: 'All Products', icon: <CategoryIcon /> },
    ...Array.from(new Set(products.map(p => p.category))).map(cat => ({
      id: cat,
      name: categoryMap[cat]?.name || cat,
      icon: categoryMap[cat]?.icon || '📦',
    })),
  ];

  const getFilteredProducts = () => {
    let filtered = products;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return primaryImage.url;
    }
    return '/images/placeholder-product.jpg';
  };

  const getProductColor = (product: Product) => {
    return categoryMap[product.category]?.color || '#d97706';
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDialog = () => {
    setSelectedProduct(null);
  };

  const handleImageClick = (url: string, title: string) => {
    setSelectedImage({ open: true, url, title });
  };

  const handleCloseModal = () => {
    setSelectedImage({ open: false, url: '', title: '' });
  };

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#d97706' }} />
      </Box>
    );
  }

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
              Our <Box component="span" sx={{ color: '#fff3e0' }}>Products</Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
                opacity: 0.95,
                mb: 4,
              }}
            >
              Discover our comprehensive range of industrial manufacturing equipment
            </Typography>

            {/* Search Bar */}
            <Box sx={{ maxWidth: '500px', mx: 'auto' }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
               
              />
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Category Filters */}
        {categories.length > 1 && (
          <Box sx={{ mb: 5, overflow: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2">{category.icon}</Typography>
                      <Typography variant="body2">{category.name}</Typography>
                    </Box>
                  }
                  onClick={() => setSelectedCategory(category.id)}
                  sx={{
                    backgroundColor: selectedCategory === category.id ? '#d97706' : '#f5f5f5',
                    color: selectedCategory === category.id ? 'white' : 'text.primary',
                    cursor: 'pointer',
                    py: 2,
                    '&:hover': {
                      backgroundColor: selectedCategory === category.id ? '#d97706' : '#e0e0e0',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              No products found matching your search.
            </Typography>
          </Box>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {filteredProducts.map((product) => {
                const productColor = getProductColor(product);
                const productImage = getProductImage(product);
                
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                    <motion.div variants={fadeInUp}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                          },
                        }}
                        onClick={() => handleProductClick(product)}
                      >
                        {/* Product Image */}
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: '220px',
                            backgroundColor: '#f5f5f5',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={productImage}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              bgcolor: 'rgba(0,0,0,0.6)',
                              borderRadius: '50%',
                              p: 0.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <ZoomInIcon sx={{ color: 'white', fontSize: 20 }} />
                          </Box>
                          <Chip
                            label={categoryMap[product.category]?.name || product.category}
                            size="small"
                            sx={{
                              position: 'absolute',
                              bottom: 10,
                              left: 10,
                              backgroundColor: productColor,
                              color: 'white',
                            }}
                          />
                          {product.images && product.images.length > 1 && (
                            <Chip
                              label={`+${product.images.length - 1} more`}
                              size="small"
                              sx={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                fontSize: '0.7rem',
                              }}
                            />
                          )}
                        </Box>

                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: 0.5,
                              color: 'text.primary',
                              fontSize: '1rem',
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                          >
                            {product.amharicName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              mb: 1.5,
                              lineHeight: 1.5,
                              fontSize: '0.8rem',
                            }}
                          >
                            {product.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                            {product.capacity && (
                              <Chip
                                label={product.capacity}
                                size="small"
                                sx={{
                                  backgroundColor: `${productColor}10`,
                                  color: productColor,
                                  fontSize: '0.7rem',
                                  height: '24px',
                                }}
                              />
                            )}
                            {product.power && (
                              <Chip
                                label={product.power}
                                size="small"
                                sx={{
                                  backgroundColor: `${productColor}10`,
                                  color: productColor,
                                  fontSize: '0.7rem',
                                  height: '24px',
                                }}
                              />
                            )}
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: productColor,
                              color: productColor,
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: productColor,
                                backgroundColor: `${productColor}10`,
                              },
                            }}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Box
            sx={{
              mt: 8,
              p: { xs: 4, md: 5 },
              backgroundColor: '#fff5eb',
              borderRadius: '24px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
              Need Help Choosing the Right Equipment?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Our team of experts is ready to help you find the perfect solution for your business needs.
            </Typography>
            <Button
              component={Link}
              href="/inquiries"
              variant="contained"
              size="large"
              startIcon={<RequestQuoteIcon />}
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
              Contact Our Experts
            </Button>
          </Box>
        </motion.div>
      </Container>

      {/* Product Detail Dialog */}
      <Dialog
        open={!!selectedProduct}
        onClose={handleCloseProductDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {selectedProduct.name}
                </Typography>
                <IconButton onClick={handleCloseProductDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {selectedProduct.amharicName}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '300px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    mb: 2,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    const primaryImage = selectedProduct.images?.find(img => img.isPrimary) || selectedProduct.images?.[0];
                    if (primaryImage) {
                      handleImageClick(primaryImage.url, selectedProduct.name);
                    }
                  }}
                >
                  <Image
                    src={getProductImage(selectedProduct)}
                    alt={selectedProduct.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                
                {/* Additional Images Thumbnails */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, overflow: 'auto' }}>
                    {selectedProduct.images.map((img, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          position: 'relative',
                          width: 60,
                          height: 60,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: img.isPrimary ? '2px solid #d97706' : '1px solid #ddd',
                        }}
                        onClick={() => handleImageClick(img.url, selectedProduct.name)}
                      >
                        <Image
                          src={img.url}
                          alt={img.alt}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
                
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                  {selectedProduct.fullDescription || selectedProduct.description}
                </Typography>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: getProductColor(selectedProduct) }}>
                  Technical Specifications:
                </Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {selectedProduct.specifications?.map((spec: string, idx: number) => (
                    <Grid size={{ xs: 6 }} key={idx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 14, color: getProductColor(selectedProduct) }} />
                        <Typography variant="body2">{spec}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {selectedProduct.features && selectedProduct.features.length > 0 && (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: getProductColor(selectedProduct) }}>
                      Key Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {selectedProduct.features.map((feature: string, idx: number) => (
                        <Chip
                          key={idx}
                          label={feature}
                          size="small"
                          sx={{
                            backgroundColor: `${getProductColor(selectedProduct)}10`,
                            color: getProductColor(selectedProduct),
                          }}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Price: {selectedProduct.price}
              </Typography>
              <Button
                component={Link}
                href="/inquiries"
                variant="contained"
                startIcon={<RequestQuoteIcon />}
                sx={{
                  backgroundColor: getProductColor(selectedProduct),
                  '&:hover': { backgroundColor: getProductColor(selectedProduct), opacity: 0.9 },
                }}
              >
                Request Quote
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Image Modal */}
      <Modal
        open={selectedImage.open}
        onClose={handleCloseModal}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={selectedImage.open}>
          <Box
            sx={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              borderRadius: '16px',
              overflow: 'auto',
              outline: 'none',
              p: 2,
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 'auto',
                  minHeight: '400px',
                }}
              >
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  width={800}
                  height={600}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto',
                    maxHeight: '80vh',
                  }}
                  priority
                />
              </Box>
              <Typography variant="h6" sx={{ mt: 2, color: 'text.primary' }}>
                {selectedImage.title}
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ProductsPage;