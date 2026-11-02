import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { verifyCandidate } from '../design_standard/scripts/verify-candidate.mjs';

test('trusted guard rejects a candidate that removes mandatory verification', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'design-standard-candidate-'));
  fs.mkdirSync(path.join(root, '.github/workflows'), { recursive: true });
  fs.writeFileSync(path.join(root, 'AGENTS.md'), 'short');
  fs.writeFileSync(path.join(root, 'CONSTRAINTS.md'), 'short');
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ scripts: { test: 'node --test' } }));
  fs.writeFileSync(path.join(root, '.github/workflows/verify.yml'), 'on: pull_request');

  const problems = verifyCandidate(root);

  assert.match(problems.join('\n'), /npm run verify|script verify|policy-guard/i);
});
