import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    console.log('Starting Google Sheets test...');
    
    // Test auth creation
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    console.log('Auth created successfully');
    
    // Test auth token
    await auth.authorize();
    console.log('Auth authorized successfully');
    
    // Test sheets connection
    const sheets = google.sheets({ version: 'v4', auth });
    console.log('Sheets client created');
    
    // Test reading the sheet (simpler than writing)
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    
    console.log('Sheet accessed successfully:', response.data.properties.title);
    
    res.status(200).json({ 
      success: true, 
      sheetTitle: response.data.properties.title,
      message: 'All Google Sheets connections working'
    });
    
  } catch (error) {
    console.error('Google Sheets test failed:', error.message);
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      details: error.toString()
    });
  }
}