import { story, resolveAnswer } from './config.js';

const main = document.querySelector('#page');
const sound = document.querySelector('#sound');
const play = document.querySelector('#play');
const mute = document.querySelector('#mute');
const audioStatus = document.querySelector('#audio-status');
const audio = new Audio();
audio.loop = true;
audio.volume = 0.25;
let currentTrack;
let playbackAttempt = 0;

function element(tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
}

function pageURL(id) {
  const url = new URL(location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('page', id);
  return url;
}

function navigate(id) {
  history.pushState(null, '', pageURL(id));
  render();
}

function pageLink(label, id) {
  const link = element('a', label);
  link.href = pageURL(id);
  link.addEventListener('click', event => {
    if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(id);
  });
  return link;
}

async function startAudio() {
  const attempt = ++playbackAttempt;
  try {
    await audio.play();
    if (attempt !== playbackAttempt) return;
    play.hidden = true;
    audioStatus.textContent = '';
  } catch (error) {
    if (attempt !== playbackAttempt) return;
    play.hidden = false;
    audioStatus.textContent = error.name === 'NotAllowedError'
      ? 'Ative o som para ouvir a música.'
      : 'A música não pôde ser reproduzida. Você pode continuar.';
  }
}

function setMusic(id) {
  if (id === currentTrack) return;
  currentTrack = id;
  playbackAttempt++;
  audio.pause();
  audio.removeAttribute('src');
  audio.replaceChildren();
  audioStatus.textContent = '';
  const track = Object.hasOwn(story.tracks, id) ? story.tracks[id] : null;
  sound.hidden = !track;
  if (!track) { audio.load(); return; }
  for (const source of track.sources) {
    const node = document.createElement('source');
    node.src = source.src;
    node.type = source.type;
    audio.append(node);
  }
  const credit = document.querySelector('#credit');
  const sourceLink = element('a', 'Fonte');
  sourceLink.href = track.source;
  const licenseLink = element('a', track.licenseName);
  licenseLink.href = track.license;
  credit.replaceChildren(track.credit + ' ', sourceLink, ' · ', licenseLink, ' — ' + track.note);
  play.hidden = false;
  audio.load();
  startAudio();
}

play.addEventListener('click', startAudio);
mute.addEventListener('click', () => {
  audio.muted = !audio.muted;
  mute.setAttribute('aria-pressed', String(audio.muted));
  mute.textContent = audio.muted ? 'Restaurar som' : 'Silenciar';
});

function render() {
  const id = new URL(location.href).searchParams.get('page') ?? story.start;
  const page = Object.hasOwn(story.pages, id) ? story.pages[id] : null;
  main.replaceChildren();
  if (!page) {
    document.title = 'Página não encontrada';
    main.append(element('h1', 'Não há nada aqui.'), pageLink('Voltar', story.start));
    setMusic(null);
    main.focus();
    return;
  }
  document.title = page.question ?? page.text ?? '…';
  const heading = element('h1', document.title);
  heading.id = 'question';
  main.append(heading);
  if (page.question && page.text) main.append(element('p', page.text));
  if (page.question) {
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'answer';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-labelledby', heading.id);
    input.setAttribute('aria-describedby', 'answer-status');
    const submit = element('button', 'Enviar');
    submit.type = 'submit';
    const status = element('p', '');
    status.id = 'answer-status';
    status.setAttribute('role', 'status');
    form.append(input, submit, status);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const destination = resolveAnswer(page, input.value);
      if (destination) navigate(destination);
      else {
        status.textContent = input.value.trim() ? 'Tente outro nome.' : 'Digite um nome.';
        input.focus();
      }
    });
    main.append(form);
  }
  if (page.links?.length) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Continuar');
    for (const link of page.links) nav.append(pageLink(link.label, link.to));
    main.append(nav);
  }
  setMusic(page.music);
  main.focus();
}

window.addEventListener('popstate', render);
render();
