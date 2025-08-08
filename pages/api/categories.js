// pages/api/categories.js - Updated for new category structure
export default function handler(req, res) {
  const categories = {
    'professional-shelves': {
      name: 'Professional Shelves',
      count: 42,
      description: 'Professional office shelves with books and plants'
    },
    'home-lifestyle': {
      name: 'Home & Lifestyle',
      count: 48, 
      description: 'Stylish home offices and lifestyle spaces'
    }
  };
  
  res.status(200).json(categories);
}
