import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  auditVerdict,
  canEnterBaseline,
  validateChangedCoverage,
  validateManifest,
  validateWaiver,
} from '../design_standard/scripts/governance-core.mjs';

test('audit fails when any blocker or major remains, even when baselined', () => {
  const verdict = auditVerdict({
    findings: [
      { severity: 'blocker', isNew: false, waived: false },
      { severity: 'major', isNew: false, waived: false },
    ],
    requiredMissing: [],
  });

  assert.equal(verdict.ok, false);
  assert.deepEqual(verdict.reasons, ['1 blocker', '1 major']);
});

test('audit fails closed when a required automated check did not run', () => {
  const verdict = auditVerdict({ findings: [], requiredMissing: ['W17 impeccable'] });

  assert.equal(verdict.ok, false);
  assert.match(verdict.reasons[0], /W17 impeccable/);
});

test('only minor findings may enter a baseline', () => {
  assert.equal(canEnterBaseline({ severity: 'minor' }), true);
  assert.equal(canEnterBaseline({ severity: 'major' }), false);
  assert.equal(canEnterBaseline({ severity: 'blocker' }), false);
});

test('local waivers cannot suppress blockers or majors', () => {
  assert.deepEqual(validateWaiver({
    finding: 'screen|state|rule|cause',
    severity: 'minor',
    reason: 'Browser limitation',
    owner: '@owner',
    expires: '2027-01-01',
    approvalRef: 'https://github.com/acme/project/issues/123',
  }), []);

  assert.match(validateWaiver({
    finding: 'screen|state|rule|cause',
    severity: 'major',
    reason: 'Ignore it',
    owner: 'PO',
    expires: '2099-01-01',
    approvalRef: 'local text',
  }).join('\n'), /minor|GitHub|expiry/i);
});

test('manifest requires explicit testable coverage for every screen', () => {
  const problems = validateManifest({
    language: 'vi',
    screens: [{ id: 'home', path: '/', tier: 'C' }],
  });

  assert.match(problems.join('\n'), /tokens/);
  assert.match(problems.join('\n'), /preview/);
  assert.match(problems.join('\n'), /verify\.commands/);
  assert.match(problems.join('\n'), /expression/);
  assert.match(problems.join('\n'), /ready/);
  assert.match(problems.join('\n'), /source/);
  assert.match(problems.join('\n'), /states/);
  assert.match(problems.join('\n'), /stateCoverage/);
  assert.match(problems.join('\n'), /uiRoots/);
});

test('changed UI source must belong to a declared screen', () => {
  const screens = [{ id: 'home', source: ['src/pages/home/'] }];
  const uiRoots = ['src/pages/', 'src/components/', 'android/app/src/main/res/layout/'];

  assert.deepEqual(validateChangedCoverage(['src/pages/home/index.tsx'], screens, uiRoots), []);
  assert.deepEqual(validateChangedCoverage([
    'src/pages/admin/theme.scss',
    'src/components/card.astro',
    'android/app/src/main/res/layout/activity_main.xml',
    'scripts/release.mjs',
  ], screens, uiRoots), [
    'src/pages/admin/theme.scss',
    'src/components/card.astro',
    'android/app/src/main/res/layout/activity_main.xml',
  ]);
});

test('state coverage must account for loading, empty, error and dialog paths', () => {
  const base = {
    language: ['vi'], tokens: 'tokens.json', uiRoots: ['src/'],
    preview: { url: 'http://localhost:4173', command: 'npm run preview' },
    verify: { commands: ['npm test'] },
  };
  const screen = {
    id: 'orders', platform: 'web', path: '/', source: ['src/orders/'], type: 'list',
    tier: 'B', expression: 'E0', ready: 'main',
    states: [{ id: 'empty' }, { id: 'error' }, { id: 'confirm', dialog: true }],
    stateCoverage: {
      loading: 'n/a: dữ liệu dựng phía máy chủ', empty: 'empty', error: 'error', dialog: 'confirm',
    },
  };

  assert.deepEqual(validateManifest({ ...base, screens: [screen] }), []);
  assert.match(validateManifest({ ...base, screens: [{ ...screen, stateCoverage: { ...screen.stateCoverage, error: 'missing' } }] }).join('\n'), /stateCoverage\.error.*missing/);
  assert.match(validateManifest({ ...base, screens: [{ ...screen, stateCoverage: { ...screen.stateCoverage, dialog: 'empty' } }] }).join('\n'), /stateCoverage\.dialog.*dialog/);
  assert.match(validateManifest({ ...base, screens: [{ ...screen, stateCoverage: { ...screen.stateCoverage, loading: 'n\/a: x' } }] }).join('\n'), /stateCoverage\.loading.*lý do/);
  assert.match(validateManifest({ ...base, uiRoots: ['unrelated/'], screens: [screen] }).join('\n'), /source.*uiRoots/);
  assert.match(validateManifest({ ...base, uiRoots: ['./'], screens: [{ ...screen, source: ['./'] }] }).join('\n'), /uiRoots|source/);
  assert.match(validateManifest({ ...base, uiRoots: ['.'], screens: [{ ...screen, source: ['.'] }] }).join('\n'), /uiRoots|source/);
  assert.match(validateManifest({ ...base, uiRoots: ['src/../'], screens: [screen] }).join('\n'), /uiRoots/);
  assert.deepEqual(validateChangedCoverage(['src/admin/view.kt'], [{ source: ['src/orders'] }], ['src']), ['src/admin/view.kt']);
  assert.match(validateManifest({ ...base, screens: [{ ...screen, stateCoverage: { ...screen.stateCoverage, typo: 'empty' } }] }).join('\n'), /stateCoverage.*typo/);
});

test('malformed coverage config fails closed instead of crashing the verifier', () => {
  const malformed = {
    language: ['vi'], tokens: 'tokens.json', uiRoots: [42],
    preview: { url: 'http://localhost:4173', command: 'npm run preview' },
    verify: { commands: ['npm test'] },
    screens: [{
      id: 'broken', platform: 'web', path: '/', ready: 'main', type: 'home', tier: 'C', expression: 'E0',
      source: [null], states: {}, stateCoverage: 'invalid',
    }],
  };

  assert.doesNotThrow(() => validateManifest(malformed));
  assert.match(validateManifest(malformed).join('\n'), /uiRoots|source|states|stateCoverage/);
  assert.doesNotThrow(() => validateChangedCoverage(['src/index.tsx'], malformed.screens, malformed.uiRoots));
});

test('primary 4.0 configuration example is executable, not a partial migration snippet', async () => {
  const chapter = await readFile(new URL('../design_standard/02_PHAN_CAP.md', import.meta.url), 'utf8');
  const example = JSON.parse(chapter.match(/```json\s*([\s\S]*?)```/)?.[1] || 'null');
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

  assert.deepEqual(validateManifest(example), []);
  assert.equal(example.standard, `design_standard@${pkg.version.split('.')[0]}.0`);
});

test('all client adapters point to the canonical root policy', async () => {
  for (const file of ['CLAUDE.md', 'GEMINI.md', '.agents/skills/design-standard/SKILL.md', '.claude/skills/design-standard/SKILL.md']) {
    const text = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(text, /AGENTS\.md/);
    assert(text.split(/\r?\n/).length <= 20, `${file} must stay a short adapter`);
  }
});

test('CI pins an operating system supported by the locked Playwright version', async () => {
  for (const file of [
    '.github/workflows/verify.yml',
    '.github/workflows/policy-guard.yml',
    'design_standard/scripts/ci/ui-standard.github.yml',
  ]) {
    const workflow = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(workflow, /runs-on:\s*ubuntu-latest/, `${file} must not drift to an unsupported OS`);
    assert.match(workflow, /runs-on:\s*ubuntu-24\.04/, `${file} must pin Ubuntu 24.04`);
  }
  const verifier = await readFile(new URL('../.github/workflows/verify.yml', import.meta.url), 'utf8');
  assert.match(verifier, /playwright install --with-deps chromium/);
});
