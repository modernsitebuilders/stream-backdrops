export default async function handler(req, res) {
  res.status(200).json({
    hasServiceEmail: !!process.env.GOOGLE_SERVICE_EMAIL,
    hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
    hasSheetId: !!process.env.GOOGLE_SHEET_ID,
    serviceEmailLength: process.env.GOOGLE_SERVICE_EMAIL?.length || 0,
    privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
    sheetIdLength: process.env.GOOGLE_SHEET_ID?.length || 0,
    // Show first few characters to verify they're being read
    serviceEmailStart: process.env.GOOGLE_SERVICE_EMAIL?.substring(0, 20) || 'missing',
    privateKeyStart: process.env.GOOGLE_PRIVATE_KEY?.substring(0, 20) || 'missing'
  });
}