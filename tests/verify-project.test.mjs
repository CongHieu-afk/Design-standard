import assert from 'node:assert/strict';
import test from 'node:test';

import { inspectProject } from '../design_standard/scripts/verify-project.mjs';

const valid = {
  language: ['vi'],
  tokens: 'tokens.json',
  uiRoots: ['src/'],
  preview: { url: 'http://127.0.0.1:4173', command: 'npm run preview' },
  verify: { commands: ['npm test', 'npm run build'] },
  screens: [{
    id: 'home', platform: 'web', path: '/', source: ['src/home/'], type: 'home',
    tier: 'C', expression: 'E1', ready: 'main', states: [],
    stateCoverage: {
      loading: 'n/a: trang tĩnh', empty: 'n/a: không có danh sách',
      error: 'n/a: không gọi API', dialog: 'n/a: không có hộp thoại',
    },
  }],
};

test('project inspection rejects an uncovered changed UI file', () => {
  const result = inspectProject(valid, ['src/admin/theme.scss']);

  assert.equal(result.ok, false);
  assert.match(result.problems.join('\n'), /src\/admin\/theme\.scss/);
});

test('project inspection accepts declared UI coverage', () => {
  const result = inspectProject(valid, ['src/home/index.tsx']);

  assert.deepEqual(result, { ok: true, problems: [] });
});
