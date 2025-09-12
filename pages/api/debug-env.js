export default async function handler(req, res) {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  
  res.status(200).json({
    hasServiceEmail: !!process.env.GOOGLE_SERVICE_EMAIL,
    hasPrivateKey: !!privateKey,
    hasSheetId: !!process.env.GOOGLE_SHEET_ID,
    privateKeyLength: privateKey?.length || 0,
    // Check if it has actual line breaks or \n characters
    hasActualLineBreaks: privateKey?.includes('\n') || false,
    hasEscapedLineBreaks: privateKey?.includes('\\n') || false,
    // Show the first line to see the format
    firstLine: privateKey?.split(/\r?\n/)[0] || 'missing',
    // Count lines
    lineCount: privateKey?.split(/\r?\n/).length || 0
  });
}