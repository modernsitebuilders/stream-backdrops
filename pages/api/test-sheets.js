import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    console.log('Starting Google Sheets test...');
    
    // Get the private key and ensure proper format
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    
    // Remove surrounding quotes if present
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    
    // Replace escaped newlines with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    console.log('Private key first 50 chars:', privateKey.substring(0, 50));
    console.log('Private key has newlines:', privateKey.includes('\n'));
    
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_EMAIL,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    console.log('Auth created successfully');
    
    await auth.authorize();
    console.log('Auth authorized successfully');
    
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    
    res.status(200).json({ 
      success: true, 
      sheetTitle: response.data.properties.title,
      message: 'Google Sheets connection working'
    });
    
  } catch (error) {
    console.error('Google Sheets test failed:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      details: error.toString()
    });
  }
}