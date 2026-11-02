import assert from 'node:assert/strict';
import test from 'node:test';

import { inspectProject } from '../design_standard/scripts/verify-project.mjs';

const valid = {
  language: ['vi'],
  tokens: 'tokens.json',
  preview: { url: 'http://127.0.0.1:4173', command: 'npm run preview' },
  verify: { commands: ['npm test', 'npm run build'] },
  screens: [{
    id: 'home', platform: 'web', path: '/', source: ['src/home/'], type: 'home',
    tier: 'C', expression: 'E1', ready: 'main', states: [],
  }],
};

test('project inspection rejects an uncovered changed UI file', () => {
  const result = inspectProject(valid, ['src/admin/index.tsx']);

  assert.equal(result.ok, false);
  assert.match(result.problems.join('\n'), /src\/admin\/index\.tsx/);
});

test('project inspection accepts declared UI coverage', () => {
  const result = inspectProject(valid, ['src/home/index.tsx']);

  assert.deepEqual(result, { ok: true, problems: [] });
});
