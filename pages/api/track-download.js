import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { filename, category, timestamp } = req.body;
  
  try {
    // Fix private key format (same as working test-sheets endpoint)
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const downloadData = [
      new Date().toISOString(),
      'download',
      filename,
      category,
      req.headers['referer'] || 'direct',
      req.headers['x-forwarded-for'] || 'unknown',
      req.headers['user-agent'] || 'unknown',
      new Date().toLocaleDateString(),
      new Date().toLocaleTimeString()
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Analytics!A:I',
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