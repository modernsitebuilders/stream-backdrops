// categories-config.js - Auto-generated category configuration
// Updated for curated collection

export const CATEGORIES = {
  "professional-shelves": {
    "name": "Professional Shelves",
    "description": "Professional office shelves with books and plants - perfect for business video calls",
    "count": 42
  },
  "home-lifestyle": {
    "name": "Home & Lifestyle",
    "description": "Stylish home offices and lifestyle spaces - ideal for creative professionals",
    "count": 48
  }
};

export const CATEGORY_ORDER = [
  "professional-shelves",
  "home-lifestyle"
];

export const DEFAULT_CATEGORY = 'professional-shelves';

export const TOTAL_IMAGES = 90;

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
