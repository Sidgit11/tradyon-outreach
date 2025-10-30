import { seedMatchReasons } from './utils/seedMatchReasons';

console.log('Starting database seeding...\n');

seedMatchReasons()
  .then(() => {
    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Database seeding failed:', error);
    process.exit(1);
  });
