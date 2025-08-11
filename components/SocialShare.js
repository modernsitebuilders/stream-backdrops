// Create this file: components/SocialShare.js
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon
} from 'react-share';
import { useState } from 'react';

export default function SocialShare({ 
  image, 
  title, 
  size = 'small', 
  showLabels = false, 
  vertical = false 
}) {
  const [copied, setCopied] = useState(false);
  
  // Create the share URL for the specific image/category
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://streambackdrops.com'}/category/${image.category}`;
  
  // Share text
  const shareText = title || `Check out this professional virtual background from StreamBackdrops!`;
  
  // Pinterest needs an image URL
  const imageUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://streambackdrops.com'}/images/${image.category}/${image.filename}`;
  
  // Icon size based on size prop
  const iconSize = size === 'large' ? 40 : size === 'small' ? 28 : 32;
  
  // Container styles
  const containerStyle = {
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row',
    gap: '0.5rem',
    alignItems: 'center'
  };

  // Copy link function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div style={containerStyle}>
      {/* X (formerly Twitter) - Custom X Icon */}
      <TwitterShareButton url={shareUrl} title={shareText}>
        <div style={{
          background: '#000000',
          borderRadius: '50%',
          width: iconSize,
          height: iconSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width={iconSize * 0.6} height={iconSize * 0.6} fill="white" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>
        {showLabels && <span style={{ fontSize: '0.75rem', color: 'white' }}>X</span>}
      </TwitterShareButton>

      {/* Facebook */}
      <FacebookShareButton url={shareUrl} quote={shareText}>
        <FacebookIcon size={iconSize} round />
        {showLabels && <span style={{ fontSize: '0.75rem', color: 'white' }}>Facebook</span>}
      </FacebookShareButton>

      {/* LinkedIn */}
      <LinkedinShareButton url={shareUrl} title={shareText}>
        <LinkedinIcon size={iconSize} round />
        {showLabels && <span style={{ fontSize: '0.75rem', color: 'white' }}>LinkedIn</span>}
      </LinkedinShareButton>

      {/* Pinterest */}
      <PinterestShareButton 
        url={shareUrl} 
        media={imageUrl}
        description={shareText}
      >
        <PinterestIcon size={iconSize} round />
        {showLabels && <span style={{ fontSize: '0.75rem', color: 'white' }}>Pinterest</span>}
      </PinterestShareButton>

      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        style={{
          background: copied ? '#059669' : '#6b7280',
          border: 'none',
          borderRadius: '50%',
          width: iconSize,
          height: iconSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
        title={copied ? 'Copied!' : 'Copy link'}
      >
        <svg 
          width={iconSize * 0.6} 
          height={iconSize * 0.6} 
          fill="white" 
          viewBox="0 0 24 24"
        >
          {copied ? (
            // Checkmark icon
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          ) : (
            // Copy/link icon
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          )}
        </svg>
        {showLabels && <span style={{ fontSize: '0.75rem', color: 'white' }}>{copied ? 'Copied!' : 'Copy'}</span>}
      </button>
    </div>
  );
}