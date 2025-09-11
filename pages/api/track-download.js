import { google } from 'googleapis';

// Initialize Google Sheets
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
    // Prepare data for sheets
    const downloadData = [
      new Date().toISOString(), // Timestamp
      filename,                 // Image filename
      category,                 // Category
      req.headers['x-forwarded-for'] || 'unknown', // IP
      req.headers['user-agent'] || 'unknown',      // Browser
      new Date().toLocaleDateString(), // Date only
      new Date().toLocaleTimeString()  // Time only
    ];

    // Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Downloads!A:G', // Assumes sheet named "Downloads"
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [downloadData]
      }
    });

    console.log('Download logged to Google Sheets:', filename);
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Google Sheets logging failed:', error);
    
    // Fallback to console log if Sheets fails
    console.log('DOWNLOAD_TRACKED_FALLBACK:', {
      filename,
      category,
      timestamp: timestamp || new Date().toISOString(),
      ip: req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent']
    });
    
    res.status(200).json({ success: true, fallback: true });
  }
}

// Step 4: Environment variables to add in Vercel dashboard
// GOOGLE_SERVICE_EMAIL=your-service-account@project.iam.gserviceaccount.com
// GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
// GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j (from your sheet URL)

// Step 5: Google Sheets setup
// 1. Create new Google Sheet
// 2. Name first sheet "Downloads"
// 3. Add headers in row 1:
//    A1: Timestamp
//    B1: Filename  
//    C1: Category
//    D1: IP Address
//    E1: User Agent
//    F1: Date
//    G1: Time
// 4. Share sheet with your service account email (view/edit permissions)

// Optional: Add analytics formulas in your sheet
// Most downloaded images: =QUERY(A:G,"SELECT B, COUNT(B) WHERE B != 'Filename' GROUP BY B ORDER BY COUNT(B) DESC")
// Downloads by category: =QUERY(A:G,"SELECT C, COUNT(C) WHERE C != 'Category' GROUP BY C ORDER BY COUNT(C) DESC")
// Daily download counts: =QUERY(A:G,"SELECT F, COUNT(F) WHERE F != 'Date' GROUP BY F ORDER BY F DESC")

// Step 6: Simple view page - pages/analytics-link.js (optional)
export default function AnalyticsLink() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Download Analytics</h1>
      <p>Your download data is automatically logged to Google Sheets.</p>
      <a 
        href={`https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_SHEET_ID || 'YOUR_SHEET_ID'}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          backgroundColor: '#2563eb',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem'
        }}
      >
        View Analytics in Google Sheets
      </a>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Data includes: timestamp, filename, category, IP, browser info
      </p>
    </div>
  );
}