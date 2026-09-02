// One-off migration: copies existing candidates (results) and job positions
// from the Google Sheets backend into Supabase. Session data (in-progress
// tests) is intentionally not migrated — only finished results matter long
// term, and candidates mid-test can simply restart under the new backend.
//
// Usage: node scripts/migrate-to-supabase.js
// Requires APPS_SCRIPT_URL/APPS_SCRIPT_SECRET and SUPABASE_URL/SUPABASE_SERVICE_KEY in .env.

import 'dotenv/config';
import * as sheetsStore from '../stores/sheetsStore.js';
import * as supabaseStore from '../stores/supabaseStore.js';

async function main() {
  console.log('Lendo candidatos do Google Sheets...');
  const results = await sheetsStore.getResults();
  console.log(`Encontrados ${results.length} candidato(s).`);

  let ok = 0;
  let failed = 0;
  for (const result of results) {
    const res = await supabaseStore.saveResult(result);
    if (res && res.error) {
      failed += 1;
      console.error(`Falha ao migrar ${result.email || result.id}: ${res.error}`);
    } else {
      ok += 1;
    }
  }
  console.log(`Candidatos migrados: ${ok} ok, ${failed} falha(s).`);

  console.log('Lendo vagas do Google Sheets...');
  const { jobPositions } = await sheetsStore.getJobPositions();
  console.log(`Encontradas ${jobPositions.length} vaga(s).`);

  for (const nome of jobPositions) {
    const res = await supabaseStore.addJobPosition({ nome });
    if (res && res.error) {
      console.error(`Falha ao migrar vaga "${nome}": ${res.error}`);
    }
  }
  console.log('Vagas migradas.');
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
