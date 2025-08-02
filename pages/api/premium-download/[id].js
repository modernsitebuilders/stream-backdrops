import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { gumroadOrderId } = req.body;
  
  // TODO: Verify Gumroad purchase here
  if (!gumroadOrderId || gumroadOrderId.length < 10) {
    return res.status(401).json({ error: 'Valid purchase required' });
  }
  
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${id}.png`,
      Expires: 3600, // 1 hour
      ResponseContentDisposition: `attachment; filename="${id}.png"`
    };
    
    const signedUrl = s3.getSignedUrl('getObject', params);
    
    res.status(200).json({ 
      success: true,
      downloadUrl: signedUrl,
      expires: new Date(Date.now() + 3600000).toISOString()
    });
    
  } catch (error) {
    console.error('S3 error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
}