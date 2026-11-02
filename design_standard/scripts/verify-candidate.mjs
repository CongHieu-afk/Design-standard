#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const safeRead = (root, file, problems) => {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) { problems.push(`Thiếu ${file}`); return ''; }
  if (fs.lstatSync(target).isSymbolicLink()) { problems.push(`${file} không được là symlink`); return ''; }
  return fs.readFileSync(target, 'utf8');
};

const trustedRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const normalize = (text) => text.replace(/\r\n/g, '\n');
const digest = (text) => crypto.createHash('sha256').update(normalize(text)).digest('hex');
const manifestDigest = (value) => {
  if (!/^sha256:(?:[a-f0-9]{8}-){7}[a-f0-9]{8}$/.test(value)) return null;
  return value.slice('sha256:'.length).replaceAll('-', '');
};

function verifyTrustRoot(candidateRoot, problems) {
  const file = '.github/trusted-policy.json';
  let trusted;
  let candidate;
  try { trusted = JSON.parse(fs.readFileSync(path.join(trustedRoot, file), 'utf8')); }
  catch (error) { problems.push(`Trust manifest gốc không hợp lệ: ${error.message}`); return; }
  try { candidate = JSON.parse(safeRead(candidateRoot, file, problems)); }
  catch (error) { problems.push(`${file} không hợp lệ: ${error.message}`); return; }

  if (trusted.version !== 1 || candidate.version !== 1) problems.push(`${file} phải dùng version 1`);
  for (const [protectedFile, allowed] of Object.entries(trusted.files || {})) {
    const text = safeRead(candidateRoot, protectedFile, problems);
    const hash = digest(text);
    if (!Array.isArray(allowed) || !allowed.map(manifestDigest).includes(hash)) {
      problems.push(`${protectedFile} đổi trust root khi hash chưa được duyệt ở PR trước`);
    }
  }
  for (const [protectedFile, allowed] of Object.entries(candidate.files || {})) {
    const text = safeRead(candidateRoot, protectedFile, problems);
    const hash = digest(text);
    if (!Array.isArray(allowed) || !allowed.every(manifestDigest) || !allowed.map(manifestDigest).includes(hash)) {
      problems.push(`${file}: ${protectedFile} phải chứa hash hiện tại và chỉ gồm SHA-256`);
    }
  }
  for (const protectedFile of Object.keys(trusted.files || {})) {
    if (!Object.hasOwn(candidate.files || {}, protectedFile)) problems.push(`${file} không được bỏ trust root ${protectedFile}`);
  }
}

const EXPECTED_SCRIPTS = {
  test: 'node --test',
  'check:policy': 'node design_standard/scripts/verify-repo.mjs',
  'check:syntax': 'node --check design_standard/scripts/audit.mjs && node --check design_standard/scripts/check_gates.mjs && node --check design_standard/scripts/check_tokens.mjs && node --check design_standard/scripts/prepush.mjs && node --check design_standard/scripts/verify-project.mjs && node --check design_standard/scripts/verify-candidate.mjs && node --check design_standard/scripts/verify-repo.mjs && node --check design_standard/runtime/motion.js && node --check design_standard/runtime/lifecycle.js && node --check design_standard/runtime/primitives.js',
  verify: 'npm run test && npm run check:policy && npm run check:syntax',
};

const lines = (text) => text.split(/\r?\n/);
const trimmedLines = (text, prefix) => lines(text)
  .map((line) => line.trim().replace(/^-\s+/, ''))
  .filter((line) => line.startsWith(prefix));

function yamlBlock(text, header, indentation) {
  const all = lines(text);
  const exact = `${' '.repeat(indentation)}${header}:`;
  const start = all.findIndex((line) => line === exact);
  if (start < 0) return '';
  const body = [];
  for (let index = start + 1; index < all.length; index += 1) {
    const line = all[index];
    if (line.trim() && !line.trimStart().startsWith('#') && line.search(/\S/) <= indentation) break;
    body.push(line);
  }
  return body.join('\n');
}

function requireLines(text, file, required, problems) {
  const present = new Set(lines(text).map((line) => line.trim()));
  for (const line of required) if (!present.has(line)) problems.push(`${file} thiếu cấu trúc bắt buộc: ${line}`);
}

function verifyPinnedActions(text, file, allowed, problems) {
  const actions = trimmedLines(text, 'uses:').map((line) => line.slice('uses:'.length).trim().split(/\s+#/)[0]);
  for (const action of actions) {
    const [name, ref = ''] = action.split('@');
    if (!allowed.includes(name)) problems.push(`${file} dùng action ngoài allowlist: ${name}`);
    if (!/^[a-f0-9]{40}$/.test(ref)) problems.push(`${file} action ${name} phải pin full commit SHA`);
  }
  return actions;
}

function verifyWorkflow(text, problems) {
  const file = '.github/workflows/verify.yml';
  requireLines(text, file, [
    'name: verify', 'pull_request:', 'push:', 'branches: [main]', 'contents: read',
    'verify:', 'runs-on: ubuntu-24.04', 'timeout-minutes: 15', 'persist-credentials: false',
  ], problems);
  const job = yamlBlock(text, 'verify', 2);
  const runs = trimmedLines(job, 'run:').map((line) => line.slice('run:'.length).trim());
  const expectedRuns = ['npm ci', 'npx playwright install --with-deps chromium', 'npm run verify'];
  if (JSON.stringify(runs) !== JSON.stringify(expectedRuns)) {
    problems.push(`${file} job verify phải chạy đúng ba lệnh bắt buộc, không echo/no-op`);
  }
  const actions = verifyPinnedActions(job, file, ['actions/checkout', 'actions/setup-node'], problems);
  if (actions.length !== 2) problems.push(`${file} job verify phải có đúng checkout và setup-node`);
  if (trimmedLines(text, 'permissions:').length !== 1) problems.push(`${file} chỉ được có permissions cấp repo`);
  if (/^\s*(if|continue-on-error|defaults|shell|container|services|env):/m.test(text) || /\|\|\s*true/.test(text)) {
    problems.push(`${file} chứa nhánh tắt hoặc che lỗi`);
  }
}

function verifyPolicyGuard(text, problems) {
  const file = '.github/workflows/policy-guard.yml';
  requireLines(text, file, [
    'name: policy-guard', 'pull_request_target:', 'types: [opened, synchronize, reopened]',
    'contents: read', 'guard:', 'runs-on: ubuntu-24.04',
    'ref: ${{ github.event.pull_request.base.sha }}',
    'repository: ${{ github.event.pull_request.head.repo.full_name }}',
    'ref: ${{ github.event.pull_request.head.sha }}',
    'run: node trusted/design_standard/scripts/verify-candidate.mjs --candidate candidate',
  ], problems);
  const job = yamlBlock(text, 'guard', 2);
  const runs = trimmedLines(job, 'run:').map((line) => line.slice('run:'.length).trim());
  if (JSON.stringify(runs) !== JSON.stringify(['node trusted/design_standard/scripts/verify-candidate.mjs --candidate candidate'])) {
    problems.push(`${file} chỉ được chạy trusted base checker`);
  }
  const actions = verifyPinnedActions(job, file, ['actions/checkout', 'actions/setup-node'], problems);
  if (actions.length !== 3 || actions.filter((action) => action.startsWith('actions/checkout@')).length !== 2) {
    problems.push(`${file} phải checkout đúng base và candidate rồi setup-node`);
  }
  if ((text.match(/^\s*persist-credentials:\s*false\s*$/gm) || []).length !== 2) {
    problems.push(`${file} phải tắt credential ở cả hai checkout`);
  }
  if (trimmedLines(text, 'permissions:').length !== 1) problems.push(`${file} chỉ được có permissions cấp repo`);
  if (/^\s*(if|continue-on-error|defaults|shell|container|services|env):/m.test(text) || /\|\|\s*true/.test(text)) {
    problems.push(`${file} chứa nhánh tắt hoặc che lỗi`);
  }
}

export function verifyCandidate(candidateRoot) {
  const root = path.resolve(candidateRoot);
  const problems = [];
  verifyTrustRoot(root, problems);
  const agents = safeRead(root, 'AGENTS.md', problems);
  const constraints = safeRead(root, 'CONSTRAINTS.md', problems);
  const packageText = safeRead(root, 'package.json', problems);
  const workflow = safeRead(root, '.github/workflows/verify.yml', problems);
  const policyGuard = safeRead(root, '.github/workflows/policy-guard.yml', problems);
  const consumerWorkflow = safeRead(root, 'design_standard/scripts/ci/ui-standard.github.yml', problems);
  const prepush = safeRead(root, 'design_standard/scripts/prepush.mjs', problems);
  const installer = safeRead(root, 'design_standard/scripts/install_hooks.mjs', problems);
  for (const file of [
    'design_standard/runtime/motion.js', 'design_standard/runtime/lifecycle.js',
    'design_standard/runtime/primitives.js', 'tests/runtime-primitives.test.mjs',
    'tests/audit-integration.test.mjs', 'tests/candidate-guard.test.mjs',
    'tests/governance.test.mjs', 'design_standard/scripts/verify-repo.mjs',
  ]) safeRead(root, file, problems);

  for (const marker of ['Kiểm thử là bắt buộc', 'npm run verify', 'Không dùng `--no-verify`']) {
    if (!agents.includes(marker)) problems.push(`AGENTS.md thiếu bất biến: ${marker}`);
  }
  for (const marker of ['Không blocker/major trong baseline', 'Không commit khi `npm test` đỏ']) {
    if (!constraints.includes(marker)) problems.push(`CONSTRAINTS.md thiếu bất biến: ${marker}`);
  }

  try {
    const scripts = JSON.parse(packageText).scripts || {};
    for (const [name, expected] of Object.entries(EXPECTED_SCRIPTS)) {
      if (scripts[name] !== expected) problems.push(`package.json script ${name} phải là: ${expected}`);
    }
  } catch (error) { problems.push(`package.json không hợp lệ: ${error.message}`); }

  verifyWorkflow(workflow, problems);
  verifyPolicyGuard(policyGuard, problems);
  verifyPinnedActions(consumerWorkflow, 'design_standard/scripts/ci/ui-standard.github.yml', [
    'actions/checkout', 'actions/setup-node', 'actions/upload-artifact',
  ], problems);
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
