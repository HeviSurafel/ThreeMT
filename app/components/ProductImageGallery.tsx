// app/components/ProductImageGallery.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Modal,
  Fade,
  Typography,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from '@mui/icons-material';
import Image from 'next/image';

interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const thumbnailImages = images.filter(img => !img.isPrimary).slice(0, 4);

  const handleOpenLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height: 400,
          bgcolor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '16px',
        }}
      >
        <Typography variant="body2" color="textSecondary">No image available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Main Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 400,
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer',
          mb: 2,
          bgcolor: '#f5f5f5',
        }}
        onClick={() => handleOpenLightbox(0)}
      >
        <Image
          src={primaryImage.url}
          alt={primaryImage.alt}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box sx={{ display: 'flex', gap: 1, overflow: 'auto' }}>
          {images.map((img, idx) => (
            <Box
              key={idx}
              sx={{
                position: 'relative',
                width: 80,
                height: 80,
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: selectedImageIndex === idx ? '2px solid #d97706' : '1px solid #ddd',
                flexShrink: 0,
              }}
              onClick={() => handleOpenLightbox(idx)}
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

      {/* Lightbox Modal */}
      <Modal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        closeAfterTransition
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Fade in={lightboxOpen}>
          <Box
            sx={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              bgcolor: 'black',
              borderRadius: '16px',
              overflow: 'hidden',
              outline: 'none',
            }}
          >
            <IconButton
              onClick={() => setLightboxOpen(false)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <CloseIcon />
            </IconButton>

            {images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <PrevIcon />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <NextIcon />
                </IconButton>
              </>
            )}

            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].alt}
                width={800}
                height={600}
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
              }}
            >
              <Typography variant="body2">{productName}</Typography>
              <Typography variant="caption">
                {selectedImageIndex + 1} / {images.length}
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ProductImageGallery;