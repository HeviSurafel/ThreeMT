// app/blog/page.tsx
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
  TextField,
  InputAdornment,
  Pagination,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import Link from 'next/link';
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
  authorAvatar?: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([]);

  // Fetch blog posts from API
  useEffect(() => {
    fetchBlogPosts();
  }, [page, selectedCategory, searchTerm]);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      let url = `/api/blog?page=${page}&limit=6`;
      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setBlogPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
        
        // Fetch categories for sidebar (only once)
        if (categories.length === 0) {
          const categoryResponse = await fetch('/api/blog/categories');
          const categoryData = await categoryResponse.json();
          if (categoryResponse.ok) {
            setCategories(categoryData.categories);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setPage(1);
        fetchBlogPosts();
      } else if (searchTerm === '') {
        fetchBlogPosts();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const featuredPost = blogPosts[0];

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && blogPosts.length === 0) {
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
          py: { xs: 6, md: 8 },
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
              3MT <Box component="span" sx={{ color: '#fff3e0' }}>Blog</Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                textAlign: 'center',
                maxWidth: '700px',
                mx: 'auto',
                opacity: 0.95,
                mb: 4,
              }}
            >
              Insights, tips, and updates from the world of industrial manufacturing
            </Typography>
            
            {/* Search Bar */}
            <Box sx={{ maxWidth: '500px', mx: 'auto' }}>
              <TextField
                fullWidth
                placeholder="Search articles..."
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

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Featured Post */}
            {!searchTerm && selectedCategory === 'all' && featuredPost && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <Card
                  sx={{
                    mb: 5,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', height: { xs: '200px', md: '300px' } }}>
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <Chip
                      label="Featured"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        backgroundColor: '#d97706',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {formatDate(featuredPost.createdAt)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {featuredPost.author}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                      {featuredPost.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                      {featuredPost.excerpt}
                    </Typography>
                    <Button
                      component={Link}
                      href={`/blog/${featuredPost.slug}`}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ color: '#d97706' }}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Blog Posts Grid */}
            {blogPosts.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
                <Typography variant="h6">No blog posts found</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  Try adjusting your search or filter criteria
                </Typography>
              </Paper>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <Grid container spacing={3}>
                  {(searchTerm || selectedCategory !== 'all' ? blogPosts : blogPosts.slice(1)).map((post) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={post._id}>
                      <motion.div variants={fadeInUp}>
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            },
                          }}
                          onClick={() => window.location.href = `/blog/${post.slug}`}
                        >
                          <Box sx={{ position: 'relative', height: '200px' }}>
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                            <Chip
                              label={post.category}
                              size="small"
                              sx={{
                                position: 'absolute',
                                bottom: 12,
                                left: 12,
                                backgroundColor: '#d97706',
                                color: 'white',
                              }}
                            />
                          </Box>
                          <CardContent sx={{ flexGrow: 1, p: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarIcon sx={{ fontSize: 12 }} />
                                {formatDate(post.createdAt)}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                • {post.readTime}
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1rem' }}>
                              {post.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                              {post.excerpt.substring(0, 100)}...
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar src={post.authorAvatar || '/Images/Logo.png'} sx={{ width: 24, height: 24 }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {post.author}
                                </Typography>
                              </Box>
                              <Button
                                size="small"
                                sx={{ color: '#d97706' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/blog/${post.slug}`;
                                }}
                              >
                                Read
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div variants={fadeInUp}>
              {/* Categories */}
              <Paper sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {categories.map((category) => (
                    <Chip
                      key={category.id}
                      label={`${category.name} (${category.count})`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setPage(1);
                      }}
                      sx={{
                        backgroundColor: selectedCategory === category.id ? '#d97706' : '#f5f5f5',
                        color: selectedCategory === category.id ? 'white' : 'text.primary',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: selectedCategory === category.id ? '#d97706' : '#e0e0e0',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* Recent Posts */}
              <Paper sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Recent Posts
                </Typography>
                {blogPosts.slice(0, 4).map((post) => (
                  <Box key={post._id} sx={{ mb: 2 }}>
                    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                      <Box sx={{ display: 'flex', gap: 2, '&:hover': { opacity: 0.8 } }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            position: 'relative',
                            flexShrink: 0,
                          }}
                        >
                          <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {formatDate(post.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Link>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Paper>

              {/* Popular Tags */}
              <Paper sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Popular Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Manufacturing', 'Bakery', 'Soap Making', 'Coffee', 'Tips', 'Maintenance', 'Success Story', 'Equipment Guide'].map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        backgroundColor: '#f5f5f5',
                        '&:hover': { backgroundColor: '#d97706', color: 'white' },
                      }}
                      onClick={() => {
                        setSearchTerm(tag);
                        setSelectedCategory('all');
                        setPage(1);
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* Newsletter */}
              <Paper sx={{ p: 3, borderRadius: '16px', backgroundColor: '#fff5eb' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Subscribe to Newsletter
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  Get the latest articles and updates delivered to your inbox.
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Your email address"
                  size="small"
                  sx={{ mb: 2, backgroundColor: 'white', borderRadius: '8px' }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: '#d97706',
                    '&:hover': { backgroundColor: '#b45309' },
                  }}
                >
                  Subscribe
                </Button>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogPage;