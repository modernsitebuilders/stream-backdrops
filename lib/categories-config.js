// categories-config.js - Auto-generated category configuration
// Updated for curated collection with improved descriptions

export const CATEGORIES = {
  "well-lit": {
    "name": "Well-Lit",
    "description": "Bright, naturally-lit virtual backgrounds with excellent clarity for professional video calls and presentations",
    "count": 48
  },
  "ambient-lighting": {
    "name": "Ambient Lighting",
    "description": "Warm, softly-lit virtual backgrounds that create a welcoming atmosphere for client meetings and team calls",
    "count": 49
  },
  "office-spaces": {
    "name": "Office Spaces",
    "description": "Professional office environments and workspaces perfect for corporate video conferencing and business meetings",
    "count": 15
  }
};

export const CATEGORY_ORDER = [
  "well-lit",
  "ambient-lighting", 
  "office-spaces"
];

export const DEFAULT_CATEGORY = 'well-lit';

export const TOTAL_IMAGES = 112;

// Helper function to get category display name
export function getCategoryName(slug) {
  return CATEGORIES[slug]?.name || slug;
}

// Helper function to get all categories as array
export function getAllCategories() {
  return Object.entries(CATEGORIES).map(([slug, info]) => ({
    slug,
    ...info
  }));
}

// SEO-optimized category descriptions for meta tags
export const SEO_DESCRIPTIONS = {
  "well-lit": "Download free well-lit virtual backgrounds in HD quality. Perfect for professional video calls with excellent lighting and clarity.",
  "ambient-lighting": "Free ambient lighting virtual backgrounds for video calls. Create a warm, welcoming atmosphere for client meetings and team calls.",
  "office-spaces": "Professional office space virtual backgrounds for corporate video conferencing. HD quality office environments for business meetings."
};

// Keywords for each category (for SEO)
export const CATEGORY_KEYWORDS = {
  "well-lit": ["well lit backgrounds", "bright virtual backgrounds", "natural lighting", "clear video calls", "professional lighting"],
  "ambient-lighting": ["ambient lighting", "warm backgrounds", "cozy office", "soft lighting", "welcoming atmosphere"],
  "office-spaces": ["office backgrounds", "corporate spaces", "business environments", "professional workspaces", "meeting rooms"]
};