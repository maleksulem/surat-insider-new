import { execSync } from 'child_process';
try {
  execSync('git checkout src/components/SuratSOTYHero.tsx');
  console.log("Restored");
} catch(e) {
  console.log(e.toString());
}
