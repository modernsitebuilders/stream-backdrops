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
    res.status(500).json({ error: 'Tracking failed' });
  }
}