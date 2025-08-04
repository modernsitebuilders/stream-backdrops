// New file - handles premium downloads
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export default async function handler(req, res) {
  const { imageId, purchaseToken } = req.query;
  
  // For now, simple token check (replace with Gumroad verification later)
  if (!purchaseToken) {
    return res.status(403).json({ error: 'Purchase required' });
  }
  
  try {
    const params = {
      Bucket: 'streambackdrops-premium',
      Key: `${imageId}-4k.png`,
      Expires: 3600, // 1 hour
      ResponseContentDisposition: `attachment; filename="${imageId}-premium-4k.png"`
    };
    
    const downloadUrl = s3.getSignedUrl('getObject', params);
    res.redirect(downloadUrl);
    
  } catch (error) {
    res.status(500).json({ error: 'Download failed' });
  }
}