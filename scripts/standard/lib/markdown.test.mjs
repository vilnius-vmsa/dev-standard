import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toPlainText, createHeadingSlugger, stripCustomId } from './markdown.mjs';

test('toPlainText strips bold, code, links and escapes', () => {
  assert.equal(toPlainText('Naudoti **HTTPS** ir `TLS 1.2`.'), 'Naudoti HTTPS ir TLS 1.2.');
  assert.equal(toPlainText('feature/\\* → dev'), 'feature/* → dev');
  assert.equal(toPlainText('Žr. [4.8](04-kodo-kurimo-gaires.md#48-x).'), 'Žr. 4.8.');
  assert.equal(toPlainText('a <b> {c}\n    *   d'), 'a <b> {c} * d');
});

test('heading slugs match Docusaurus heading ids', () => {
  const slug = createHeadingSlugger();
  assert.equal(slug('4.8. DI priemonių naudojimas (AI Coding Assistants)'), '48-di-priemonių-naudojimas-ai-coding-assistants');
  assert.equal(slug('8.3. CD (Continuous Delivery/Deployment) {#83-cd-continuous-delivery-deployment}'), '83-cd-continuous-delivery-deployment');
  assert.equal(slug('Pavyzdys'), 'pavyzdys');
  assert.equal(slug('Pavyzdys'), 'pavyzdys-1');
});

test('stripCustomId removes a trailing {#id}', () => {
  assert.equal(stripCustomId('7.9. Testai {#79-testai}'), '7.9. Testai');
  assert.equal(stripCustomId('7.9. Testai'), '7.9. Testai');
});
