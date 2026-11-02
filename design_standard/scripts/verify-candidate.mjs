#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const safeRead = (root, file, problems) => {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) { problems.push(`Thiếu ${file}`); return ''; }
  if (fs.lstatSync(target).isSymbolicLink()) { problems.push(`${file} không được là symlink`); return ''; }
  return fs.readFileSync(target, 'utf8');
};

export function verifyCandidate(candidateRoot) {
  const root = path.resolve(candidateRoot);
  const problems = [];
  const agents = safeRead(root, 'AGENTS.md', problems);
  const constraints = safeRead(root, 'CONSTRAINTS.md', problems);
  const packageText = safeRead(root, 'package.json', problems);
  const workflow = safeRead(root, '.github/workflows/verify.yml', problems);
  safeRead(root, '.github/workflows/policy-guard.yml', problems);
  const prepush = safeRead(root, 'design_standard/scripts/prepush.mjs', problems);
  const installer = safeRead(root, 'design_standard/scripts/install_hooks.mjs', problems);
  for (const file of [
    'design_standard/runtime/motion.js', 'design_standard/runtime/lifecycle.js',
    'design_standard/runtime/primitives.js', 'tests/runtime-primitives.test.mjs',
    'tests/audit-integration.test.mjs',
  ]) safeRead(root, file, problems);

  for (const marker of ['Kiểm thử là bắt buộc', 'npm run verify', 'Không dùng `--no-verify`']) {
    if (!agents.includes(marker)) problems.push(`AGENTS.md thiếu bất biến: ${marker}`);
  }
  for (const marker of ['Không blocker/major trong baseline', 'Không commit khi `npm test` đỏ']) {
    if (!constraints.includes(marker)) problems.push(`CONSTRAINTS.md thiếu bất biến: ${marker}`);
  }

  try {
    const scripts = JSON.parse(packageText).scripts || {};
    if (!scripts.test) problems.push('package.json thiếu script test');
    if (!scripts['check:policy']) problems.push('package.json thiếu script check:policy');
    if (!scripts.verify || !scripts.verify.includes('npm run test') || !scripts.verify.includes('npm run check:policy')) {
      problems.push('package.json script verify phải chạy test và check:policy');
    }
  } catch (error) { problems.push(`package.json không hợp lệ: ${error.message}`); }

  for (const marker of ['pull_request:', 'push:', 'npm run verify']) {
    if (!workflow.includes(marker)) problems.push(`verify workflow thiếu ${marker}`);
  }
  for (const text of [prepush, installer]) for (const bypass of ['DESIGN_STANDARD_SKIP', '--quick', '--no-verify']) {
    if (text.includes(bypass)) problems.push(`Enforcement chứa đường bypass ${bypass}`);
  }
  return problems;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { candidate: { type: 'string' } } });
  if (!values.candidate) { console.error('Thiếu --candidate'); process.exit(2); }
  const problems = verifyCandidate(values.candidate);
  if (problems.length) {
    console.error(`Candidate CHƯA đạt (${problems.length}):\n- ${problems.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Candidate giữ nguyên các bất biến governance.');
}
