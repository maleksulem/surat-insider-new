const { execSync } = require('child_process');
try {
  const output = execSync('git log -p src/components/SuratSOTYHero.tsx').toString();
  const fs = require('fs');
  fs.writeFileSync('./git_history.txt', output);
} catch (e) {
  console.log(e);
}
