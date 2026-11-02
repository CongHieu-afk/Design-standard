#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

import { validateChangedCoverage, validateManifest } from './governance-core.mjs';

export function inspectProject(config, changedFiles = []) {
  const problems = validateManifest(config);
  for (const file of validateChangedCoverage(changedFiles, config?.screens || [], config?.uiRoots || [])) {
    problems.push(`UI source chưa thuộc screen nào: ${file}`);
  }
  return { ok: problems.length === 0, problems };
}

const run = (command, cwd) => {
  console.log(`\n> ${command}`);
  const result = spawnSync(command, { cwd, shell: true, stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`Lệnh thất bại (${result.status ?? 'không chạy được'}): ${command}`);
};

const runNode = (script, args, cwd) => {
  const result = spawnSync(process.execPath, [script, ...args], { cwd, stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`${path.basename(script)} thất bại (${result.status ?? 'không chạy được'})`);
};

async function main() {
  const { values } = parseArgs({ options: {
    config: { type: 'string', default: 'design.config.json' },
    'changed-from': { type: 'string' },
    run: { type: 'boolean', default: false },
    base: { type: 'string' },
  } });
  const configPath = path.resolve(values.config);
  const project = path.dirname(configPath);
  if (!fs.existsSync(configPath)) throw new Error(`Không thấy ${configPath}`);
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  let changedFiles = [];
  if (values['changed-from']) {
    const diff = spawnSync('git', ['diff', '--name-only', `${values['changed-from']}...HEAD`], { cwd: project, encoding: 'utf8' });
    if (diff.status !== 0) throw new Error(`Không đọc được diff từ ${values['changed-from']}: ${diff.stderr.trim()}`);
    changedFiles = diff.stdout.split(/\r?\n/).filter(Boolean);
  }
  const inspection = inspectProject(config, changedFiles);
  if (!inspection.ok) throw new Error(`Project manifest chưa đạt:\n- ${inspection.problems.join('\n- ')}`);

  for (const [label, relative] of [['tokens', config.tokens], ['gates', config.gates]]) {
    if (relative && !fs.existsSync(path.resolve(project, relative))) throw new Error(`Không thấy ${label}: ${relative}`);
  }
  if (!values.run) {
    console.log('Project manifest đạt. Thêm --run để chạy test/build/token/gate/audit.');
    return;
  }

  for (const command of config.verify.commands) run(command, project);
  const here = path.dirname(fileURLToPath(import.meta.url));
  runNode(path.join(here, 'check_tokens.mjs'), [config.tokens, '--config', path.basename(configPath)], project);
  if (config.gates) runNode(path.join(here, 'check_gates.mjs'), [config.gates], project);

  const base = values.base || config.preview.url;
  let response;
  try { response = await fetch(base, { signal: AbortSignal.timeout(3000) }); } catch { /* báo bên dưới */ }
  if (!response || response.status >= 500) throw new Error(`Preview ${base} chưa chạy; khởi động bằng: ${config.preview.command}`);
  runNode(path.join(here, 'audit.mjs'), ['--config', path.basename(configPath), '--base', base, '--out', 'audit_out/verify', '--overwrite'], project);
  console.log('\nVERIFY đạt: test/build, token, gate và audit đều xanh.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`VERIFY thất bại: ${error.message}`);
    process.exit(1);
  });
}
