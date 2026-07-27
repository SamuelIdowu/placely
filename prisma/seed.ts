// prisma/seed.ts
import { prisma } from '../src/infrastructure/db/prisma.client';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('Placely2026!', 10);

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@placely.ng' },
    update: {},
    create: {
      email: 'admin@placely.ng',
      passwordHash,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  console.log('Admin user seeded:', admin.email);

  // 2. Verified Student User
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@unilag.edu.ng' },
    update: {},
    create: {
      email: 'student@unilag.edu.ng',
      passwordHash,
      role: 'STUDENT',
      emailVerified: new Date(),
      student: {
        create: {
          university: 'University of Lagos',
          discipline: 'Computer Science',
          cgpa: 4.5,
          bio: 'Final year computer science student interested in backend systems.',
          verificationStatus: 'VERIFIED',
          profileCompleteness: 100,
        },
      },
    },
  });
  console.log('Student user seeded:', studentUser.email);

  // 3. Verified Employer User
  const employerUser = await prisma.user.upsert({
    where: { email: 'hr@paystack.com' },
    update: {},
    create: {
      email: 'hr@paystack.com',
      passwordHash,
      role: 'EMPLOYER',
      emailVerified: new Date(),
      employer: {
        create: {
          companyName: 'Paystack',
          cacNumber: 'RC123456',
          description: 'Modern payments infrastructure for Africa.',
          websiteUrl: 'https://paystack.com',
          verificationStatus: 'VERIFIED',
        },
      },
    },
    include: {
      employer: true,
    },
  });
  console.log('Employer user seeded:', employerUser.email);

  if (employerUser.employer) {
    const employerProfileId = employerUser.employer.id;

    // 4. Create 2 Listings
    const listing1 = await prisma.listing.create({
      data: {
        employerProfileId,
        title: 'Backend Engineering Intern (SIWES)',
        description: 'Join our core payments backend team for a 6-month SIWES placement.',
        disciplines: ['Computer Science', 'Software Engineering'],
        location: 'Lagos',
        isRemote: false,
        status: 'OPEN',
      },
    });

    const listing2 = await prisma.listing.create({
      data: {
        employerProfileId,
        title: 'Frontend Engineering Intern (SIWES)',
        description: 'Build web interfaces for our merchant dashboard using React and Next.js.',
        disciplines: ['Computer Science', 'Information Technology'],
        location: 'Remote',
        isRemote: true,
        status: 'OPEN',
      },
    });

    console.log('Listings seeded:', listing1.title, ',', listing2.title);
  }

  console.log('Database seeding completed successfully.');
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  });
