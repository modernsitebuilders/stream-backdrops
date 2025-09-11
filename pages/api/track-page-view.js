// Step 1: Create new API endpoint - pages/api/track-page-view.js
import { google } from 'googleapis';

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { page, category, referrer } = req.body;
  
  try {
    const pageViewData = [
      new Date().toISOString(),
      'page_view',                              // Event type
      page,                                     // Page URL
      category,                                 // Category viewed
      referrer || 'direct',                     // Where they came from
      req.headers['x-forwarded-for'] || 'unknown',
      req.headers['user-agent'] || 'unknown',
      new Date().toLocaleDateString(),
      new Date().toLocaleTimeString()
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Analytics!A:I', // New sheet for all events
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [pageViewData]
      }
    });

    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Page view tracking failed:', error);
    res.status(200).json({ success: true, fallback: true });
  }
}

// Step 2: Updated download tracking - pages/api/track-download.js
import { google } from 'googleapis';

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { filename, category, timestamp } = req.body;
  
  try {
    const downloadData = [
      new Date().toISOString(),
      'download',                               // Event type
      filename,                                 // Filename downloaded
      category,                                 // Category
      req.headers['referer'] || 'direct',       // Current page
      req.headers['x-forwarded-for'] || 'unknown',
      req.headers['user-agent'] || 'unknown',
      new Date().toLocaleDateString(),
      new Date().toLocaleTimeString()
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Analytics!A:I', // Same sheet as page views
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [downloadData]
      }
    });

    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Download tracking failed:', error);
    res.status(200).json({ success: true, fallback: true });
  }
}

// Step 3: Add page view tracking to your category pages
// Add this to your pages/category/[slug].js file, in the CategoryContent component:

function CategoryContent({ slug }) {
  const [previewImage, setPreviewImage] = useState(null);
  const category = categoryInfo[slug];

  // Track page view when component loads
  useEffect(() => {
    if (category) {
      fetch('/api/track-page-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: window.location.pathname,
          category: slug,
          referrer: document.referrer
        })
      }).catch(err => console.log('Page tracking failed:', err));
    }
  }, [slug, category]);

  // ... rest of your existing code

// Step 4: Google Sheets setup
// Create a new sheet called "Analytics" with these headers:
// A1: Timestamp
// B1: Event Type (page_view or download)
// C1: Page/Filename  
// D1: Category
// E1: Referrer/Source
// F1: IP Address
// G1: User Agent
// H1: Date
// I1: Time

// Step 5: Analytics formulas for your Google Sheet
// Add these in separate cells to get insights:

// Page views by category:
// =QUERY(A:I,"SELECT D, COUNT(D) WHERE B='page_view' AND D != 'Category' GROUP BY D ORDER BY COUNT(D) DESC")

// Downloads by category:
// =QUERY(A:I,"SELECT D, COUNT(D) WHERE B='download' AND D != 'Category' GROUP BY D ORDER BY COUNT(D) DESC")

// Conversion rate by category (downloads/page views):
// Create a pivot table or use COUNTIFS formulas like:
// =COUNTIFS(B:B,"download",D:D,"well-lit")/COUNTIFS(B:B,"page_view",D:D,"well-lit")

// Most viewed pages but lowest conversion:
// =ARRAYFORMULA(QUERY({
//   QUERY(A:I,"SELECT D, COUNT(D) WHERE B='page_view' GROUP BY D"),
//   QUERY(A:I,"SELECT D, COUNT(D) WHERE B='download' GROUP BY D")
// },"SELECT Col1, Col2, Col4, Col4/Col2 ORDER BY Col2 DESC"))

// Top traffic sources:
// =QUERY(A:I,"SELECT E, COUNT(E) WHERE B='page_view' AND E != 'Referrer/Source' GROUP BY E ORDER BY COUNT(E) DESC")

// Step 6: Don't forget to add useEffect import to your category page:
// import { useState, useEffect } from 'react';