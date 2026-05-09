import { runSeed } from './run.js';

const reset = process.argv.includes('--reset');
runSeed({ resetSchema: reset })
  .then(() => {
    console.log(reset ? 'Esquema reiniciado y datos sembrados.' : 'Datos sembrados.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error en seed:', err);
    process.exit(1);
  });
