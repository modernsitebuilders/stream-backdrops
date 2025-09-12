import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    console.log('Starting Google Sheets test...');
    
    // Check all environment variables
    console.log('Service email exists:', !!process.env.GOOGLE_SERVICE_EMAIL);
    console.log('Private key exists:', !!process.env.GOOGLE_PRIVATE_KEY);
    console.log('Sheet ID exists:', !!process.env.GOOGLE_SHEET_ID);
    
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    console.log('Raw private key length:', privateKey?.length);
    
    // Remove surrounding quotes if present
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
      console.log('Removed quotes, new length:', privateKey.length);
    }
    
    // Replace escaped newlines with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
    console.log('After newline replacement, length:', privateKey.length);
    console.log('Starts with BEGIN:', privateKey.startsWith('-----BEGIN PRIVATE KEY-----'));
    console.log('Ends with END:', privateKey.endsWith('-----END PRIVATE KEY-----\n'));
    
    // Try creating JWT with more explicit parameters
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    console.log('JWT created successfully');
    
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
    console.error('Full error object:', JSON.stringify(error, null, 2));
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      details: error.toString(),
      stack: error.stack
    });
  }
}