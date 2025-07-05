const fs = require('fs');
const path = require('path');

// Define clearly low-quality images that should be removed
const lowQualityImages = [
  // Duplicate files
  '474256181_598396836273173_5250701498619979485_n (1).jpg',
  '475195562_601036736009183_6750024295008285303_n (1).jpg',
  
  // Very small files (likely low quality)
  '475818898_607359325376924_456497694779876643_n.jpg',
  '475848156_607359262043597_4715828726527841259_n.jpg',
  '476234772_607359238710266_119489637807075507_n.jpg',
  
  // Non-gallery images
  'download.png',
  'logo.jpg',
  'logoclub.png',
  'logoclub2.png',
  
  // Events images with very small file sizes
  '475545052_607359248710265_3911065597263512063_n.jpg',
  '475795770_607359112043612_7418395893194555409_n.jpg',
  '475845490_607359155376941_3382075745430913768_n.jpg',
  '480927583_623995920379931_2863727569859176086_n.jpg',
];

function removeLowQualityImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  
  console.log('🧹 Removing clearly low-quality images...\n');
  
  let removedCount = 0;
  let totalSpaceSaved = 0;
  
  // Remove from main directory
  lowQualityImages.forEach(img => {
    const filePath = path.join(imagesDir, img);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed: ${img} (${(stats.size / 1024).toFixed(1)}KB)`);
      removedCount++;
      totalSpaceSaved += stats.size;
    }
  });
  
  // Remove from Events directory
  const eventsDir = path.join(imagesDir, 'Events');
  if (fs.existsSync(eventsDir)) {
    const eventsLowQuality = [
      '475545052_607359248710265_3911065597263512063_n.jpg',
      '475795770_607359112043612_7418395893194555409_n.jpg',
      '475845490_607359155376941_3382075745430913768_n.jpg',
      '480927583_623995920379931_2863727569859176086_n.jpg',
    ];
    
    eventsLowQuality.forEach(img => {
      const filePath = path.join(eventsDir, img);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        fs.unlinkSync(filePath);
        console.log(`🗑️  Removed: Events/${img} (${(stats.size / 1024).toFixed(1)}KB)`);
        removedCount++;
        totalSpaceSaved += stats.size;
      }
    });
  }
  
  console.log(`\n✅ Cleanup complete!`);
  console.log(`📊 Removed ${removedCount} low-quality images`);
  console.log(`💾 Saved ${(totalSpaceSaved / 1024 / 1024).toFixed(2)}MB of space`);
  
  // Show remaining image count
  const remainingMainImages = fs.readdirSync(imagesDir).filter(file => 
    file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
  );
  
  console.log(`\n📁 Remaining images in main directory: ${remainingMainImages.length}`);
  console.log(`🎯 Gallery now contains only high-quality images!`);
}

// Run the cleanup
removeLowQualityImages(); 