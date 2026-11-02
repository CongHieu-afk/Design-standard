import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { verifyCandidate } from '../design_standard/scripts/verify-candidate.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

function candidateCopy() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'design-standard-candidate-'));
  fs.cpSync(repoRoot, root, {
    recursive: true,
    filter: (source) => !['.git', 'node_modules'].some((name) =>
      source.includes(`${path.sep}${name}${path.sep}`) || source.endsWith(`${path.sep}${name}`)),
  });
  return root;
}

test('trusted guard accepts the intact repository', () => {
  assert.deepEqual(verifyCandidate(repoRoot), []);
});

test('trusted guard rejects scripts that only pretend to run verification', () => {
  const root = candidateCopy();
  const packageFile = path.join(root, 'package.json');
  const candidatePackage = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  candidatePackage.scripts.test = 'node -e "process.exit(0)"';
  candidatePackage.scripts.verify = 'echo "npm run test && npm run check:policy"';
  fs.writeFileSync(packageFile, `${JSON.stringify(candidatePackage, null, 2)}\n`);

  assert.match(verifyCandidate(root).join('\n'), /script test|script verify/i);
});

test('trusted guard rejects a verify step hidden in echo or disabled by condition', () => {
  const root = candidateCopy();
  const workflowFile = path.join(root, '.github/workflows/verify.yml');
  const workflow = fs.readFileSync(workflowFile, 'utf8')
    .replace('      - run: npm run verify', '      - if: false\n        run: echo "npm run verify"');
  fs.writeFileSync(workflowFile, workflow);

  assert.match(verifyCandidate(root).join('\n'), /workflow verify|if:|echo/i);
});

test('trusted guard rejects a no-op privileged policy guard', () => {
  const root = candidateCopy();
  const workflowFile = path.join(root, '.github/workflows/policy-guard.yml');
  const workflow = fs.readFileSync(workflowFile, 'utf8')
    .replace(/run: node trusted\/design_standard\/scripts\/verify-candidate\.mjs[^\r\n]*/, 'run: echo candidate-ok');
  fs.writeFileSync(workflowFile, workflow);

  assert.match(verifyCandidate(root).join('\n'), /policy-guard|trusted base checker/i);
});

test('trusted guard rejects mutable action tags', () => {
  const root = candidateCopy();
  const workflowFile = path.join(root, '.github/workflows/verify.yml');
  const workflow = fs.readFileSync(workflowFile, 'utf8').replace(/actions\/checkout@[a-f0-9]{40}/, 'actions/checkout@v4');
  fs.writeFileSync(workflowFile, workflow);

  assert.match(verifyCandidate(root).join('\n'), /full commit SHA/i);
});

test('trusted guard rejects checkout rewiring and permission escalation', () => {
  const verifyRoot = candidateCopy();
  const verifyFile = path.join(verifyRoot, '.github/workflows/verify.yml');
  fs.writeFileSync(verifyFile, fs.readFileSync(verifyFile, 'utf8')
    .replace('persist-credentials: false', 'ref: ${{ github.event.pull_request.base.sha }}\n          persist-credentials: false')
    .replace('contents: read', 'contents: read\n  checks: write'));
  assert.match(verifyCandidate(verifyRoot).join('\n'), /trust root|workflow verify/i);

  const guardRoot = candidateCopy();
  const guardFile = path.join(guardRoot, '.github/workflows/policy-guard.yml');
  const guard = fs.readFileSync(guardFile, 'utf8')
    .replace('path: trusted', 'path: swapped')
    .replace('path: candidate', 'path: trusted')
    .replace('path: swapped', 'path: candidate');
  fs.writeFileSync(guardFile, guard);
  assert.match(verifyCandidate(guardRoot).join('\n'), /trust root|policy-guard/i);
});

test('trusted guard rejects disabled checker, tests, audit, and consumer template', () => {
  for (const [file, replacement] of [
    ['design_standard/scripts/verify-repo.mjs', 'process.exit(0);\n'],
    ['tests/governance.test.mjs', '// assertions removed\n'],
    ['design_standard/scripts/audit.mjs', 'process.exit(0);\n'],
    ['design_standard/scripts/ci/ui-standard.github.yml', 'name: disabled\n'],
  ]) {
    const root = candidateCopy();
    fs.writeFileSync(path.join(root, file), replacement);
    assert.match(verifyCandidate(root).join('\n'), /trust root/i, file);
  }
});

test('trusted guard rejects npm script-shell hijacking', () => {
  const root = candidateCopy();
  fs.writeFileSync(path.join(root, '.npmrc'), 'script-shell=./ci/noop-shell\n');
  assert.match(verifyCandidate(root).join('\n'), /trust root/i);
});
