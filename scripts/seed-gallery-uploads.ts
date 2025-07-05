import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedGalleryUploads() {
  try {
    // Get a user to associate uploads with
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    // Create some test gallery uploads
    const uploads = [
      {
        filename: 'test-upload-1.jpg',
        path: '/images/Team.jpg', // Using existing image for demo
        category: 'general',
        userId: user.id,
      },
      {
        filename: 'test-upload-2.jpg',
        path: '/images/476090611_607359335376923_6698951151074247924_n.jpg',
        category: 'after-match',
        userId: user.id,
      },
      {
        filename: 'test-upload-3.jpg',
        path: '/images/475969919_607359408710249_8516488549860876522_n.jpg',
        category: 'events',
        userId: user.id,
      },
    ];

    for (const upload of uploads) {
      await prisma.galleryImage.create({
        data: upload,
      });
    }

    console.log('Gallery uploads seeded successfully!');
  } catch (error) {
    console.error('Error seeding gallery uploads:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedGalleryUploads(); 