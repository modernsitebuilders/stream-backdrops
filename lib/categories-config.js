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
  },
  "living-room": {
    "name": "Living Room",
    "description": "Comfortable living room backgrounds for casual meetings and personal video calls",
    "count": 37
  },
    "kitchen": {  // ← Add this
    "name": "Kitchen",
    "description": "Warm kitchen spaces that create a friendly, approachable atmosphere for casual video calls",
    "count": 18
  }
};

export const CATEGORY_ORDER = [
  "well-lit",
  "ambient-lighting", 
  "office-spaces",
  "living-room",
  "kitchen"
];

export const DEFAULT_CATEGORY = 'well-lit';

export const TOTAL_IMAGES = 149;

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
  "office-spaces": "Professional office space virtual backgrounds for corporate video conferencing. HD quality office environments for business meetings.",
  "living-room": "Comfortable living room virtual backgrounds for casual video calls and personal meetings. Cozy home settings for relaxed conversations.",
  "kitchen": "Free kitchen virtual backgrounds for video calls. Warm, friendly kitchen spaces perfect for casual meetings and cooking demonstrations."
};

// Keywords for each category (for SEO)
export const CATEGORY_KEYWORDS = {
  "well-lit": ["well lit backgrounds", "bright virtual backgrounds", "natural lighting", "clear video calls", "professional lighting"],
  "ambient-lighting": ["ambient lighting", "warm backgrounds", "cozy office", "soft lighting", "welcoming atmosphere"],
  "office-spaces": ["office backgrounds", "corporate spaces", "business environments", "professional workspaces", "meeting rooms"],
  "living-room": ["living room backgrounds", "home backgrounds", "casual video calls", "comfortable settings", "personal meetings"],
  "kitchen": ["kitchen backgrounds", "cooking backgrounds", "home kitchen", "casual meetings", "friendly atmosphere", "food related calls"]
};