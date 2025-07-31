import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import imageMetadata from '../../data/image-metadata.json';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Category info
  const categoryInfo = {
    'home-offices': {
      name: 'Home Offices',
      description: 'Professional home office backgrounds perfect for remote work and video calls'
    },
    'executive-offices': {
      name: 'Executive Offices', 
      description: 'Luxury executive office backgrounds for leadership meetings and professional calls'
    },
    'conference-rooms': {
      name: 'Conference Rooms',
      description: 'Professional meeting room backgrounds for team calls and presentations'
    },
    'open-offices': {
      name: 'Open Offices',
      description: 'Modern open workspace backgrounds for collaborative video calls'
    },
    'lounges': {
      name: 'Lounges',
      description: 'Comfortable lounge backgrounds for casual meetings and calls'
    }
  };

  // Filter images for this category
  const categoryImages = useMemo(() => {
    if (!slug || !imageMetadata) return [];
    
    return Object.entries(imageMetadata)
      .filter(([_, data]) => data.category === slug)
      .map(([key, data]) => ({ key, ...data }));
  }, [slug]);

  // Filter images based on search
  const filteredImages = useMemo(() => {
    return categoryImages.filter(image => {
      const matchesSearch = searchTerm === '' || 
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }, [categoryImages, searchTerm]);

  // Updated download function - converts WebP to PNG
  const handleDownload = async (image) => {
    try {
      // Create a canvas to convert WebP to PNG
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Convert to PNG and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = image.filename.replace('.webp', '.png');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/png', 1.0); // 1.0 = maximum quality
      };
      
      img.onerror = () => {
        console.error('Failed to load image');
        // Fallback to direct download if conversion fails
        const link = document.createElement('a');
        link.href = `/images/${image.filename}`;
        link.download = image.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
      // Load the WebP image
      img.crossOrigin = 'anonymous';
      img.src = `/images/${image.filename}`;
      
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct download
      const link = document.createElement('a');
      link.href = `/images/${image.filename}`;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!slug || !categoryInfo[slug]) {
    return <div>Loading...</div>;
  }

  const category = categoryInfo[slug];

  return (
    <>
      <Head>
        <title>{category.name} Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content={`Download ${category.description.toLowerCase()}. High-quality ${category.name.toLowerCase()} backgrounds for Zoom, Teams, and professional video calls.`} />
      </Head>

      <di
