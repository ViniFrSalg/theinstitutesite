import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.ARG_BASE_URL ?? 'http://localhost:8765';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const Original = window.Audio;
    window.testAudio = [];
    window.Audio = function (...args) {
      const audio = new Original(...args);
      window.testAudio.push(audio);
      return audio;
    };
  });
  const open = () => page.goto(`${base}/arg/index.html`);
  const answer = async text => {
    await page.locator('input').fill(text);
    await page.locator('input').press('Enter');
  };
  await open();
  const caseFailures = await page.evaluate(async () => {
    const { story, resolveAnswer } = await import('./config.js');
    const question = story.pages.nome;
    return question.answers.flatMap(branch => branch.aliases.flatMap(alias => {
      const variants = [alias.toLowerCase(), alias.toUpperCase(),
        [...alias].map((letter, i) => i % 2 ? letter.toUpperCase() : letter.toLowerCase()).join('')];
      return variants.filter(value => resolveAnswer(question, `  ${value}  `) !== branch.to);
    }));
  });
  assert.deepEqual(caseFailures, [], 'Every alias must accept lower, upper, and mixed case');
  const branches = await page.evaluate(async () => (await import('./config.js')).story.pages.nome.answers);
  for (const branch of branches) {
    for (const alias of branch.aliases) {
      await open();
      await answer(`  ${alias.toUpperCase()}  `);
      await page.waitForURL(`**?page=${branch.to}`);
      if (branch.action === 'reset') {
        await page.waitForLoadState();
        assert.equal(await page.locator('input').inputValue(), '');
      } else {
        const expected = await page.evaluate(async id => (await import('./config.js')).story.pages[id].text, branch.to);
        if (expected) assert.equal(await page.locator('h1').textContent(), expected);
        else assert.equal(await page.locator('main img').count(), 1);
        if (branch.to !== 'lembranca') {
          await page.getByRole('link', { name: 'Voltar', exact: true }).click();
          await page.getByRole('heading', { name: 'E qual era o nome?' }).waitFor();
          assert.equal(await page.locator('input').inputValue(), '');
        }
      }
    }
  }
  await open();
  await answer('florzinha');
  assert.equal(await page.locator('h1').evaluate(el => getComputedStyle(el).color), 'rgb(85, 238, 120)');
  await open();
  await answer('claire');
  assert.equal(await page.locator('h1 .life').textContent(), 'VIDA');
  assert.notEqual(await page.locator('h1').evaluate(el => getComputedStyle(el).color), 'rgb(85, 238, 120)');
  await open();
  await page.locator('#play').evaluate(el => el.click());
  await answer('terra');
  assert(await page.evaluate(() => window.testAudio[0].paused));
  assert(await page.locator('#sound').isHidden());
  assert.equal(await page.locator('h1').count(), 0);
  await page.locator('img').evaluate(img => img.decode());
  assert.match(await page.locator('img').evaluate(el => getComputedStyle(el).filter), /invert\(1\).*blur\(22px\)/);
  await page.screenshot({ path: '/tmp/arg-terra.png' });
  await page.getByRole('link', { name: 'Voltar' }).click();
  await answer('yodácu');
  await page.locator('img').evaluate(img => img.decode());
  await page.getByRole('button', { name: 'Buzinar' }).click();
  await page.waitForFunction(() => window.testAudio.at(-1).currentTime > 0);
  await page.getByRole('button', { name: 'Buzinar' }).focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => !window.testAudio.at(-1).paused);
  await page.goBack();
  assert(await page.evaluate(() => window.testAudio.at(-1).paused));
  await page.goForward();
  await page.reload();
  await page.getByRole('button', { name: 'Buzinar' }).waitFor();
  await page.screenshot({ path: '/tmp/arg-car.png' });
  await page.setViewportSize({ width: 375, height: 667 });
  for (const id of ['juramento', 'tupihani', 'johnny', 'terra', 'yodacu']) {
    await page.goto(`${base}/arg/index.html?page=${id}`);
    await page.locator('main').waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id);
  }
  await page.goto(`${base}/arg/index.html?page=juramento`);
  await page.screenshot({ path: '/tmp/arg-oath.png' });
  await open();
  await answer('');
  assert.equal(await page.locator('#answer-status').textContent(), 'Digite um nome.');
  await answer('nome inexistente');
  await page.getByRole('heading', { name: 'Não era esse o nome.' }).waitFor();
  await page.getByRole('link', { name: 'Voltar', exact: true }).click();
  await page.getByRole('heading', { name: 'E qual era o nome?' }).waitFor();
  assert.deepEqual(errors, []);
  console.log('PASS: all aliases, exact configured text, green highlights, Gaia reset, Terra silence/filter/back, car click/keyboard horn, history, refresh, mobile overflow, fallback.');
} finally {
  await browser.close();
}
