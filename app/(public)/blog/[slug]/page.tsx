// app/blog/[slug]/page.tsx (updated section)
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Avatar,
  Divider,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Visibility as ViewsIcon,
  ThumbUp as LikeIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

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
  readTime: string | number;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const SingleBlogPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      const data = await response.json();
      
      if (response.ok) {
        setPost(data.post);
        setLikesCount(data.post.likes || 0);
      } else {
        setError(data.error || 'Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const formatReadTime = (readTime: string | number) => {
    if (typeof readTime === 'number') {
      return `${readTime} min read`;
    }
    return readTime;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatContent = (content: string) => {
    // Replace newlines with <br/> and handle markdown-like formatting
    return content
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^## (.*?)$/gm, '<h2 style="font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 1rem 0;">$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3 style="font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.75rem 0;">$1</h3>')
      .replace(/^- (.*?)$/gm, '<li style="margin-left: 1.5rem;">$1</li>');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#d97706' }} />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error || 'Post not found'}
        </Typography>
        <Button
          component={Link}
          href="/blog"
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{ bgcolor: '#d97706', mt: 2 }}
        >
          Back to Blog
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '300px', md: '400px' },
          overflow: 'hidden',
        }}
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              color: 'white',
            }}
          >
            <Chip
              label={post.category}
              sx={{
                backgroundColor: '#d97706',
                color: 'white',
                mb: 2,
                alignSelf: 'flex-start',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem', lg: '3rem' },
                fontWeight: 800,
                mb: 2,
                maxWidth: '800px',
              }}
            >
              {post.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={post.authorAvatar || '/Images/Logo.png'} sx={{ width: 32, height: 32 }} />
                <Typography variant="body2">{post.author}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{formatDate(post.createdAt)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TimeIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{formatReadTime(post.readTime)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ViewsIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{post.views} views</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: '16px' }}>
              {/* Breadcrumbs */}
              <Breadcrumbs sx={{ mb: 3 }}>
                <MuiLink component={Link} href="/" color="inherit">
                  Home
                </MuiLink>
                <MuiLink component={Link} href="/blog" color="inherit">
                  Blog
                </MuiLink>
                <Typography color="textPrimary">{post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title}</Typography>
              </Breadcrumbs>

              {/* Content */}
              <div dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Tags:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {post.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag.replace(/"/g, '')}
                        size="small"
                        onClick={() => router.push(`/blog?tag=${encodeURIComponent(tag.replace(/"/g, ''))}`)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Author Info */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: '16px', textAlign: 'center' }}>
              <Avatar
                src={post.authorAvatar || '/Images/Logo.png'}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#d97706' }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {post.author}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Manufacturing Expert at 3MT
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button
                component={Link}
                href="/inquiries"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#d97706' }}
              >
                Contact Author
              </Button>
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
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SingleBlogPage;