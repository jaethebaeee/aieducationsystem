import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

const universities = [
  {
    name: 'Harvard University',
    shortName: 'Harvard',
    type: 'PRIVATE',
    location: 'Cambridge, MA',
    website: 'https://www.harvard.edu',
    ranking: 1
  },
  {
    name: 'Stanford University',
    shortName: 'Stanford',
    type: 'PRIVATE',
    location: 'Stanford, CA',
    website: 'https://www.stanford.edu',
    ranking: 2
  },
  {
    name: 'Massachusetts Institute of Technology',
    shortName: 'MIT',
    type: 'PRIVATE',
    location: 'Cambridge, MA',
    website: 'https://www.mit.edu',
    ranking: 3
  },
  {
    name: 'Yale University',
    shortName: 'Yale',
    type: 'PRIVATE',
    location: 'New Haven, CT',
    website: 'https://www.yale.edu',
    ranking: 4
  },
  {
    name: 'Princeton University',
    shortName: 'Princeton',
    type: 'PRIVATE',
    location: 'Princeton, NJ',
    website: 'https://www.princeton.edu',
    ranking: 5
  },
  {
    name: 'Columbia University',
    shortName: 'Columbia',
    type: 'PRIVATE',
    location: 'New York, NY',
    website: 'https://www.columbia.edu',
    ranking: 6
  },
  {
    name: 'University of Pennsylvania',
    shortName: 'UPenn',
    type: 'PRIVATE',
    location: 'Philadelphia, PA',
    website: 'https://www.upenn.edu',
    ranking: 7
  },
  {
    name: 'Duke University',
    shortName: 'Duke',
    type: 'PRIVATE',
    location: 'Durham, NC',
    website: 'https://www.duke.edu',
    ranking: 8
  },
  {
    name: 'University of California, Berkeley',
    shortName: 'UC Berkeley',
    type: 'PUBLIC',
    location: 'Berkeley, CA',
    website: 'https://www.berkeley.edu',
    ranking: 9
  },
  {
    name: 'University of California, Los Angeles',
    shortName: 'UCLA',
    type: 'PUBLIC',
    location: 'Los Angeles, CA',
    website: 'https://www.ucla.edu',
    ranking: 10
  },
  {
    name: 'University of Michigan',
    shortName: 'Michigan',
    type: 'PUBLIC',
    location: 'Ann Arbor, MI',
    website: 'https://www.umich.edu',
    ranking: 11
  },
  {
    name: 'University of Virginia',
    shortName: 'UVA',
    type: 'PUBLIC',
    location: 'Charlottesville, VA',
    website: 'https://www.virginia.edu',
    ranking: 12
  },
  {
    name: 'Cornell University',
    shortName: 'Cornell',
    type: 'PRIVATE',
    location: 'Ithaca, NY',
    website: 'https://www.cornell.edu',
    ranking: 13
  },
  {
    name: 'Northwestern University',
    shortName: 'Northwestern',
    type: 'PRIVATE',
    location: 'Evanston, IL',
    website: 'https://www.northwestern.edu',
    ranking: 14
  },
  {
    name: 'University of Chicago',
    shortName: 'UChicago',
    type: 'PRIVATE',
    location: 'Chicago, IL',
    website: 'https://www.uchicago.edu',
    ranking: 15
  },
  {
    name: 'Brown University',
    shortName: 'Brown',
    type: 'PRIVATE',
    location: 'Providence, RI',
    website: 'https://www.brown.edu',
    ranking: 16
  },
  {
    name: 'Johns Hopkins University',
    shortName: 'JHU',
    type: 'PRIVATE',
    location: 'Baltimore, MD',
    website: 'https://www.jhu.edu',
    ranking: 17
  },
  {
    name: 'Vanderbilt University',
    shortName: 'Vanderbilt',
    type: 'PRIVATE',
    location: 'Nashville, TN',
    website: 'https://www.vanderbilt.edu',
    ranking: 18
  },
  {
    name: 'Rice University',
    shortName: 'Rice',
    type: 'PRIVATE',
    location: 'Houston, TX',
    website: 'https://www.rice.edu',
    ranking: 19
  },
  {
    name: 'Washington University in St. Louis',
    shortName: 'WashU',
    type: 'PRIVATE',
    location: 'St. Louis, MO',
    website: 'https://www.wustl.edu',
    ranking: 20
  }
];

export async function seedUniversities() {
  try {
    logger.info('Starting university seeding...');
    
    for (const universityData of universities) {
      const existingUniversity = await prisma.university.findUnique({
        where: { name: universityData.name }
      });
      
      if (!existingUniversity) {
        await prisma.university.create({
          data: universityData
        });
        logger.info(`Created university: ${universityData.name}`);
      } else {
        logger.info(`University already exists: ${universityData.name}`);
      }
    }
    
    logger.info('University seeding completed successfully');

    // Seed minimal cycle data for current year for top 3 schools
    const year = new Date().getFullYear();
    const top = ['Harvard', 'Stanford', 'MIT'];
    for (const shortName of top) {
      const uni = await prisma.university.findFirst({ where: { shortName } });
      if (!uni) continue;
      const existing = await prisma.universityCycle.findFirst({ where: { universityId: uni.id, cycleYear: year } });
      if (existing) continue;
      const cycle = await prisma.universityCycle.create({ data: { universityId: uni.id, cycleYear: year } });
      // Links
      await prisma.universityLinks.create({ data: {
        cycleId: cycle.id,
        admissions: `https://admissions.${shortName.toLowerCase()}.edu`,
        deadlines: undefined,
        apply: 'https://apply.commonapp.org/login',
        prompts: undefined,
        financialAid: undefined,
        international: undefined,
      }});
      // Deadlines (sample)
      const dl = shortName === 'Stanford' ? { plan: 'EA', date: `${year}-11-01` } : { plan: 'ED', date: `${year}-11-01` } as any;
      await prisma.universityDeadline.create({ data: { cycleId: cycle.id, plan: dl.plan, date: new Date(dl.date) } });
      await prisma.universityDeadline.create({ data: { cycleId: cycle.id, plan: 'RD', date: new Date(`${year+1}-01-05`) } });
      // Prompt (sample)
      await prisma.universityPrompt.create({ data: { cycleId: cycle.id, promptType: 'Supplemental', question: 'Why us? Describe your fit and aspirations.', minWords: 100, maxWords: 250, required: true } });
      // Scholarship (sample)
      await prisma.scholarship.create({ data: { cycleId: cycle.id, name: `${shortName} International Excellence`, amountMinUSD: 5000, amountMaxUSD: 20000, external: false, deadline: new Date(`${year}-12-15`) } });
    }
  } catch (error) {
    logger.error('Error seeding universities:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedUniversities()
    .then(() => {
      logger.info('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding failed:', error);
      process.exit(1);
    });
} 