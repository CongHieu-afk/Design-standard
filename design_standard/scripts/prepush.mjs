#!/usr/bin/env node
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const { values } = parseArgs({ options: {
  project: { type: 'string', default: '.' },
  'changed-from': { type: 'string', default: 'origin/main' },
} });
const project = path.resolve(values.project);
const verifier = path.join(path.dirname(fileURLToPath(import.meta.url)), 'verify-project.mjs');
const result = spawnSync(process.execPath, [
  verifier,
  '--config', path.join(project, 'design.config.json'),
  '--changed-from', values['changed-from'],
  '--run',
], { cwd: project, stdio: 'inherit' });

if (result.status !== 0) {
  console.error('[design-standard] Push bị chặn: sửa lỗi và chạy lại.');
  process.exit(result.status || 1);
}
