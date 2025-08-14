import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Minimal, idempotent seed.
 * - Creates one Organization (by slug)
 * - Creates one ADMIN user (by email)
 * - Creates one Course in the org (by orgId+code)
 *
 * Safe to run multiple times: uses upsert/find+create and unique keys.
 */
async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const orgName = process.env.SEED_ORG_NAME || 'AdmitAI Academy';
    const orgSlug = process.env.SEED_ORG_SLUG || 'admitai-academy';

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@admitai.kr';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const adminFirstName = process.env.SEED_ADMIN_FIRST_NAME || 'Site';
    const adminLastName = process.env.SEED_ADMIN_LAST_NAME || 'Admin';

    const courseTitle = process.env.SEED_COURSE_TITLE || 'Sample Admissions Course';
    const courseCode = process.env.SEED_COURSE_CODE || 'ADM101';
    const courseDescription = process.env.SEED_COURSE_DESCRIPTION || 'An introductory course for the admissions journey.';

    // 1) Organization by unique slug
    const organization = await prisma.organization.upsert({
      where: { slug: orgSlug },
      update: {
        name: orgName,
      },
      create: {
        name: orgName,
        slug: orgSlug,
      },
    });

    // 2) Admin user by unique email (role string per current schema)
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    let hashedPassword: string | undefined;
    if (!existingUser) {
      // Hash only if creating
      hashedPassword = await bcrypt.hash(adminPassword, 10);
    }

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        firstName: adminFirstName,
        lastName: adminLastName,
        role: 'ADMIN',
        language: 'KO',
      },
      create: {
        email: adminEmail,
        password: hashedPassword || (await bcrypt.hash(adminPassword, 10)),
        firstName: adminFirstName,
        lastName: adminLastName,
        role: 'ADMIN',
        language: 'KO',
      },
    });

    // 3) Course in organization (unique by orgId+code)
    //   Note: compound unique requires a matching unique in the Prisma schema: @@unique([orgId, code])
    await prisma.course.upsert({
      where: {
        orgId_code: {
          orgId: organization.id,
          code: courseCode,
        },
      },
      update: {
        title: courseTitle,
        description: courseDescription,
      },
      create: {
        orgId: organization.id,
        title: courseTitle,
        code: courseCode,
        description: courseDescription,
      },
    });

    // Log summary
    console.log('Minimal seed complete:');
    console.log(`- Organization: ${organization.name} (${organization.slug})`);
    console.log(`- Admin user: ${adminEmail}`);
    console.log(`- Course: ${courseCode} — ${courseTitle}`);
  } finally {
    // Ensure the client is disconnected even if an error occurs
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Minimal seed failed:', error);
  process.exit(1);
});

