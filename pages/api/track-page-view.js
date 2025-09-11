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