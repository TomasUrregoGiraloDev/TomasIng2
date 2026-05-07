import { runSeed } from '../../src/backend/seeders/run.js';

export default async function globalSetup() {
  await runSeed({ resetSchema: true });
}
