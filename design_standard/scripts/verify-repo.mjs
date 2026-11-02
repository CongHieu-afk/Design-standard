#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateManifest } from './governance-core.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

export function verifyRepo() {
  const problems = [];
  const required = [
    'AGENTS.md', 'CONSTRAINTS.md', 'CLAUDE.md', 'GEMINI.md', 'package.json',
    '.github/CODEOWNERS', '.github/workflows/verify.yml', '.github/workflows/policy-guard.yml', 'docs/PROCESS.md',
    'design_standard/design.config.schema.json',
    'design_standard/runtime/motion.js', 'design_standard/runtime/lifecycle.js', 'design_standard/runtime/primitives.js',
    'tests/runtime-primitives.test.mjs', 'tests/audit-integration.test.mjs',
  ];
  for (const file of required) if (!fs.existsSync(path.join(root, file))) problems.push(`Thiếu ${file}`);

  for (const file of ['CLAUDE.md', 'GEMINI.md', '.agents/skills/design-standard/SKILL.md', '.claude/skills/design-standard/SKILL.md']) {
    if (!fs.existsSync(path.join(root, file))) { problems.push(`Thiếu adapter ${file}`); continue; }
    const text = read(file);
    if (!text.includes('AGENTS.md')) problems.push(`${file} không trỏ AGENTS.md`);
    if (text.split(/\r?\n/).length > 20) problems.push(`${file} dài quá 20 dòng; adapter không được chứa policy riêng`);
  }

  for (const file of ['package.json', 'design_standard/design.config.schema.json', 'design_standard/scripts/design.config.example.json', 'design_standard/examples/rang-moc/design.config.json']) {
    try { JSON.parse(read(file)); } catch (error) { problems.push(`${file} không phải JSON hợp lệ: ${error.message}`); }
  }

  for (const file of ['design_standard/scripts/design.config.example.json', 'design_standard/examples/rang-moc/design.config.json']) {
    try {
      for (const problem of validateManifest(JSON.parse(read(file)))) problems.push(`${file}: ${problem}`);
    } catch { /* lỗi JSON đã báo ở trên */ }
  }

  if (fs.existsSync(path.join(root, 'package.json'))) {
    const scripts = JSON.parse(read('package.json')).scripts || {};
    for (const name of ['test', 'check:policy', 'verify']) if (!scripts[name]) problems.push(`package.json thiếu script ${name}`);
  }

  if (fs.existsSync(path.join(root, '.github/workflows/verify.yml'))) {
    const workflow = read('.github/workflows/verify.yml');
    for (const marker of ['pull_request:', 'push:', 'npm run verify']) if (!workflow.includes(marker)) problems.push(`Workflow thiếu ${marker}`);
  }

  const gitignore = fs.existsSync(path.join(root, '.gitignore')) ? read('.gitignore') : '';
  if (/^GEMINI\.md$/m.test(gitignore)) problems.push('.gitignore không được bỏ qua GEMINI.md');
  for (const file of ['design_standard/scripts/prepush.mjs', 'design_standard/scripts/install_hooks.mjs']) {
    const text = read(file);
    for (const bypass of ['DESIGN_STANDARD_SKIP', '--quick', '--no-verify']) {
      if (text.includes(bypass)) problems.push(`${file} chứa đường bypass ${bypass}`);
    }
  }
  return problems;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const problems = verifyRepo();
  if (problems.length) {
    console.error(`Policy CHƯA đạt (${problems.length}):\n- ${problems.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Policy đạt: một nguồn luật, adapter ngắn, schema/config/workflow hợp lệ.');
}
