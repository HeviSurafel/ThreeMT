// app/components/ProductsSection.tsx
'use client';

import React, { useState, useEffect, JSX } from 'react';
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
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  BakeryDining as BakeryDiningIcon,
  LocalCafe as LocalCafeIcon,
  Kitchen as KitchenIcon,
  FitnessCenter as FitnessCenterIcon,
  Agriculture as AgricultureIcon,
  SoupKitchen as SoupKitchenIcon,
  Construction as ConstructionIcon,
  Recycling as RecyclingIcon,
  Restaurant as RestaurantIcon,
  RequestQuote as RequestQuoteIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
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

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ open: boolean; url: string; title: string }>({
    open: false,
    url: '',
    title: '',
  });

  // Category mapping for icons and colors
  const categoryConfig: Record<string, { icon: JSX.Element; color: string; amharic: string }> = {
    'Bakery Machines': {
      icon: <BakeryDiningIcon sx={{ fontSize: 40 }} />,
      color: '#d97706',
      amharic: 'የዳቦ ቤት ማሽን',
    },
    'Injera Production Machines': {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      color: '#e67e22',
      amharic: 'የእንጀራ ማምረቻ',
    },
    'Food Processing Equipment': {
      icon: <KitchenIcon sx={{ fontSize: 40 }} />,
      color: '#f39c12',
      amharic: 'የባልትና ማቀነባበሪያ',
    },
    'Coffee Processing Machines': {
      icon: <LocalCafeIcon sx={{ fontSize: 40 }} />,
      color: '#8B4513',
      amharic: 'የቡና ማቀነባበሪያ',
    },
    'Animal Feed Processing': {
      icon: <AgricultureIcon sx={{ fontSize: 40 }} />,
      color: '#4CAF50',
      amharic: 'መኖ ማቀነባበሪያ',
    },
    'Soap Manufacturing Equipment': {
      icon: <SoupKitchenIcon sx={{ fontSize: 40 }} />,
      color: '#9C27B0',
      amharic: 'የሳሙና ማምረቻ',
    },
    'Construction Machines': {
      icon: <ConstructionIcon sx={{ fontSize: 40 }} />,
      color: '#607D8B',
      amharic: 'የኮንስትራክሽን ማሽኖች',
    },
    'Plastic Recycling Systems': {
      icon: <RecyclingIcon sx={{ fontSize: 40 }} />,
      color: '#00ACC1',
      amharic: 'ፕላስቲክ ሪሳይክል ማሽኖች',
    },
    'Gym Equipment': {
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
      color: '#F44336',
      amharic: 'የጂም ማሽኖች',
    },
    'Kitchen Equipment': {
      icon: <KitchenIcon sx={{ fontSize: 40 }} />,
      color: '#FF5722',
      amharic: 'የኩሽና ማሽኖች',
    },
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

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return primaryImage.url;
    }
    return '/images/placeholder-product.jpg';
  };

  const getProductColor = (product: Product) => {
    return categoryConfig[product.category]?.color || '#d97706';
  };

  const getCategoryAmharic = (category: string) => {
    return categoryConfig[category]?.amharic || '';
  };

  const getCategoryIcon = (category: string) => {
    return categoryConfig[category]?.icon || <BakeryDiningIcon sx={{ fontSize: 40 }} />;
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = {
        category: product.category,
        products: [],
      };
    }
    acc[product.category].products.push(product);
    return acc;
  }, {} as Record<string, { category: string; products: Product[] }>);

  const handleImageClick = (url: string, title: string) => {
    setSelectedImage({ open: true, url, title });
  };

  const handleCloseModal = () => {
    setSelectedImage({ open: false, url: '', title: '' });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDialog = () => {
    setSelectedProduct(null);
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
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#fafafa', textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#d97706' }} />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#fafafa', textAlign: 'center' }}>
        <Typography variant="h6">No products available at the moment.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#fafafa' }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 800,
              textAlign: 'center',
              mb: 2,
              color: 'text.primary',
            }}
          >
            Our <Box component="span" sx={{ color: 'primary.main' }}>Products</Box>
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 600,
              textAlign: 'center',
              mb: 3,
              color: 'text.primary',
            }}
          >
            Industrial Manufacturing Solutions for Growing Businesses
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              mb: 6,
              fontSize: '1.05rem',
              lineHeight: 1.7,
            }}
          >
            At 3MT Manufacturing & Technology, we design, manufacture, and supply high-quality industrial machinery 
            and equipment that empower businesses to increase productivity, improve efficiency, and achieve sustainable 
            growth.
          </Typography>
        </motion.div>

        {/* Products by Category with Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {Object.values(groupedProducts).map((category) => {
            const categoryColor = categoryConfig[category.category]?.color || '#d97706';
            
            return (
              <Box key={category.category} sx={{ mb: 6 }}>
                {/* Category Header */}
                <motion.div variants={fadeInUp}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                      pb: 2,
                      borderBottom: `3px solid ${categoryColor}`,
                    }}
                  >
                    <Box sx={{ color: categoryColor }}>{getCategoryIcon(category.category)}</Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {category.category}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {getCategoryAmharic(category.category)}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${category.products.length} Products`}
                      sx={{
                        backgroundColor: `${categoryColor}20`,
                        color: categoryColor,
                        fontWeight: 600,
                        ml: 'auto',
                      }}
                    />
                  </Box>
                </motion.div>

                {/* Product Cards Grid */}
                <Grid container spacing={3}>
                  {category.products.map((product) => {
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
              </Box>
            );
          })}
        </motion.div>

        {/* Custom Manufacturing Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Paper
            elevation={0}
            sx={{
              mt: 6,
              p: { xs: 3, md: 5 },
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #d97706 0%, #f97316 100%)',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}>
              Custom Manufacturing Solutions
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.95, maxWidth: '700px', mx: 'auto' }}>
              Need a custom solution? Our engineering team can design and manufacture equipment tailored to your specific requirements.
            </Typography>
            <Button
              component={Link}
              href="/inquiries"
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#d97706',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Request Custom Solution
            </Button>
          </Paper>
        </motion.div>

        {/* Why Choose 3MT Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 700,
                mb: 4,
                color: 'text.primary',
              }}
            >
              Why Choose <Box component="span" sx={{ color: 'primary.main' }}>3MT</Box>?
            </Typography>
            <Grid container spacing={2}>
              {[
                'Locally Manufactured',
                'Expert Engineering Team',
                'High-Quality Materials',
                'Competitive Pricing',
                'Installation Support',
                'After-Sales Service',
                'Custom Design',
                'Fast Delivery',
              ].map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      {item}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
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
              mt: 6,
              p: { xs: 4, md: 5 },
              backgroundColor: '#fff5eb',
              borderRadius: '24px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
              Ready to upgrade your production capacity?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Contact 3MT today and let our experts help you find the right solution for your business.
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
              Request a Quote
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

export default ProductsSection;