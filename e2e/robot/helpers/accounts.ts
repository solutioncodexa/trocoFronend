/** Comptes QA seedés pour le robot live (voir trocoBackend/scripts/seed-plan-test-tenants.mjs). */
export const ROBOT_PASSWORD = process.env.ROBOT_PASSWORD || 'Test1234!';

export const ACCOUNTS = {
  basic: {
    email: process.env.ROBOT_BASIC_EMAIL || 'basic@yopmail.com',
    password: ROBOT_PASSWORD,
    slug: 'basic',
    plan: 'basic',
  },
  pro: {
    email: process.env.ROBOT_PRO_EMAIL || 'pro@yopmail.com',
    password: ROBOT_PASSWORD,
    slug: 'pro',
    plan: 'pro',
  },
  business: {
    email: process.env.ROBOT_BUSINESS_EMAIL || 'business@yopmail.com',
    password: ROBOT_PASSWORD,
    slug: 'business',
    plan: 'business',
  },
  superAdmin: {
    email: process.env.ROBOT_SA_EMAIL || 'superadmin@matjarona.ma',
    password: process.env.ROBOT_SA_PASSWORD || 'SuperAdmin1234',
  },
} as const;

export type AccountKey = keyof typeof ACCOUNTS;
