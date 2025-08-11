// pages/api/categories.js - Updated without casual-backgrounds category
export default function handler(req, res) {
  // Prevent caching to ensure fresh data
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  const categories = {
    'ambient-lighting': {
      name: 'Ambient Lighting',
      count: 49,
      description: 'Professional office shelves with books and plants - perfect for business video calls'
    },
    'well-lit': {
      name: 'Well Lit',
      count: 48, 
      description: 'Stylish home offices and casual lifestyle spaces - from polished to relaxed'
    },
    'office spaces': {
      name: 'Office Spaces',
      count: 15, 
      description: 'Stylish offices spaces'
    }
  };
  
  console.log('📊 Serving categories:', Object.keys(categories));
  res.status(200).json(categories);
}
