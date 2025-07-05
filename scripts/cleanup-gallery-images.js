const fs = require('fs');
const path = require('path');

// Define the images we want to keep (high quality ones)
const keepImages = {
  'main': [
    'Team.jpg',
    '476090611_607359335376923_6698951151074247924_n.jpg',
    '475969919_607359408710249_8516488549860876522_n.jpg',
    '476169254_607359535376903_7286281109057041354_n.jpg',
    '475780202_607359382043585_3034294918827921029_n.jpg',
    '475980485_607359355376921_1824534271337068094_n.jpg',
    '475155703_601036529342537_8421055415684565978_n.jpg',
    '475053085_601036852675838_2402443290344397682_n.jpg',
    '475144344_601036842675839_4404505197731612851_n.jpg',
    '474779314_601036762675847_3541346204575328241_n.jpg',
    '474850664_601036476009209_4739041144709341589_n.jpg',
    '474795441_601036752675848_3189221237306170939_n.jpg',
    '474866685_601036869342503_8599911458419294757_n.jpg',
    '474682136_601036496009207_8639658317074689251_n.jpg',
    '475142254_601036782675845_6634806078986385702_n.jpg',
    '474738817_601036732675850_1375881422591087309_n.jpg',
    '475195562_601036736009183_6750024295008285303_n.jpg',
    '475142209_601036779342512_1060912070919921037_n.jpg',
    '474765961_601036846009172_4953905943138151340_n.jpg',
    '474956406_601036816009175_6723609090066033292_n.jpg',
    '474626647_601036489342541_1279715244984058606_n.jpg',
    '474623786_601036502675873_417465206065548771_n.jpg',
    '474074724_598396812939842_962371998718308862_n.jpg',
    '474256181_598396836273173_5250701498619979485_n.jpg',
    '474007589_598396856273171_2111071297923646773_n.jpg',
    '474096011_598395709606619_2962262759380864078_n.jpg',
    '474071584_598395686273288_3457685561741518136_n.jpg',
    '485143849_641439991968857_8166740877775122323_n.jpg',
    '481140462_626892440090279_6752106142656858356_n.jpg',
    '485062990_641440001968856_1788598474458634496_n.jpg',
    '485063030_641440021968854_1074023557985153228_n.jpg',
    '488908023_653579827421540_5935849463958993947_n.jpg',
    '490592059_658446380268218_23591485498949886_n.jpg',
    '490848064_658446366934886_1742058043239402373_n.jpg',
    '490177832_658446420268214_347614883182770774_n.jpg',
    '490443846_658446426934880_5562347315263916673_n.jpg',
    '490647100_658446473601542_4306727507599707816_n.jpg',
    '494353075_672776775501845_4965141204955899499_n.jpg',
    '494314495_672776768835179_1497338477261864599_n.jpg',
    '495013016_672776815501841_6112291942365215539_n.jpg',
    '494644807_672776822168507_3210103914200477472_n.jpg',
    'DSC_0014.jpg',
    'DSC_0013.jpg',
    'DSC_0012.jpg',
    'DSC_0011.jpg',
    'DSC_0010.jpg',
    'DSC_0009.jpg',
    'DSC_0008.jpg',
    'DSC_0007.jpg',
  ],
  'after-match': [
    '481302045_623994717046718_6367270203417339327_n.jpg',
    '480980877_623996403713216_5920153029135494897_n.jpg',
    '480988725_623995013713355_2013348546939563105_n.jpg',
  ],
  'events': [
    '481276435_623998250379698_8736554557242586485_n.jpg',
    '481262373_623998213713035_7248181858664384245_n.jpg',
    '475506305_607359298710260_2334271900033905389_n.jpg',
    '476208910_607359245376932_3593847638994941124_n.jpg',
    '475792307_607359232043600_2943844154310647044_n.jpg',
    '475951713_607359278710262_1054903980676307615_n.jpg',
    '475839465_607359168710273_3036126754752063146_n.jpg',
    '475698443_607359302043593_3511584171185863671_n.jpg',
  ]
};

function analyzeImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  
  console.log('🔍 Analyzing gallery images...\n');
  
  // Check main images directory
  const mainImages = fs.readdirSync(imagesDir).filter(file => 
    file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
  );
  
  console.log('📁 Main Images Directory:');
  console.log(`Total images: ${mainImages.length}`);
  console.log(`Images to keep: ${keepImages.main.length}`);
  
  const unusedMainImages = mainImages.filter(img => !keepImages.main.includes(img));
  if (unusedMainImages.length > 0) {
    console.log(`\n❌ Unused images (can be removed):`);
    unusedMainImages.forEach(img => {
      const filePath = path.join(imagesDir, img);
      const stats = fs.statSync(filePath);
      console.log(`  - ${img} (${(stats.size / 1024).toFixed(1)}KB)`);
    });
  }
  
  // Check After Match directory
  const afterMatchDir = path.join(imagesDir, 'After Match');
  if (fs.existsSync(afterMatchDir)) {
    const afterMatchImages = fs.readdirSync(afterMatchDir).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
    
    console.log(`\n📁 After Match Directory:`);
    console.log(`Total images: ${afterMatchImages.length}`);
    console.log(`Images to keep: ${keepImages['after-match'].length}`);
    
    const unusedAfterMatchImages = afterMatchImages.filter(img => !keepImages['after-match'].includes(img));
    if (unusedAfterMatchImages.length > 0) {
      console.log(`\n❌ Unused After Match images (can be removed):`);
      unusedAfterMatchImages.forEach(img => {
        const filePath = path.join(afterMatchDir, img);
        const stats = fs.statSync(filePath);
        console.log(`  - ${img} (${(stats.size / 1024).toFixed(1)}KB)`);
      });
    }
  }
  
  // Check Events directory
  const eventsDir = path.join(imagesDir, 'Events');
  if (fs.existsSync(eventsDir)) {
    const eventsImages = fs.readdirSync(eventsDir).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
    
    console.log(`\n📁 Events Directory:`);
    console.log(`Total images: ${eventsImages.length}`);
    console.log(`Images to keep: ${keepImages.events.length}`);
    
    const unusedEventsImages = eventsImages.filter(img => !keepImages.events.includes(img));
    if (unusedEventsImages.length > 0) {
      console.log(`\n❌ Unused Events images (can be removed):`);
      unusedEventsImages.forEach(img => {
        const filePath = path.join(eventsDir, img);
        const stats = fs.statSync(filePath);
        console.log(`  - ${img} (${(stats.size / 1024).toFixed(1)}KB)`);
      });
    }
  }
  
  console.log('\n✅ Analysis complete!');
  console.log('\n💡 To remove unused images, you can:');
  console.log('1. Review the list above');
  console.log('2. Manually delete the files you don\'t want');
  console.log('3. Or run this script with --remove flag to automatically delete them');
}

function removeUnusedImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  
  console.log('🗑️  Removing unused images...\n');
  
  // Remove unused main images
  const mainImages = fs.readdirSync(imagesDir).filter(file => 
    file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
  );
  
  const unusedMainImages = mainImages.filter(img => !keepImages.main.includes(img));
  unusedMainImages.forEach(img => {
    const filePath = path.join(imagesDir, img);
    fs.unlinkSync(filePath);
    console.log(`🗑️  Removed: ${img}`);
  });
  
  // Remove unused After Match images
  const afterMatchDir = path.join(imagesDir, 'After Match');
  if (fs.existsSync(afterMatchDir)) {
    const afterMatchImages = fs.readdirSync(afterMatchDir).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
    
    const unusedAfterMatchImages = afterMatchImages.filter(img => !keepImages['after-match'].includes(img));
    unusedAfterMatchImages.forEach(img => {
      const filePath = path.join(afterMatchDir, img);
      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed: After Match/${img}`);
    });
  }
  
  // Remove unused Events images
  const eventsDir = path.join(imagesDir, 'Events');
  if (fs.existsSync(eventsDir)) {
    const eventsImages = fs.readdirSync(eventsDir).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
    
    const unusedEventsImages = eventsImages.filter(img => !keepImages.events.includes(img));
    unusedEventsImages.forEach(img => {
      const filePath = path.join(eventsDir, img);
      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed: Events/${img}`);
    });
  }
  
  console.log('\n✅ Cleanup complete!');
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--remove')) {
  removeUnusedImages();
} else {
  analyzeImages();
} 