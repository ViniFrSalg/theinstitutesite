// Add pages and answer branches here. Destinations refer to keys in pages.
export const story = {
  start: 'nome',
  tracks: {
    spring: {
      sources: [
        { src: 'audio/spring-song.ogg', type: 'audio/ogg' },
        { src: 'audio/spring-song.mp3', type: 'audio/mpeg' },
      ],
      credit: 'Spring Song, Op. 62 No. 6 — Felix Mendelssohn. Piano: ROSA Pianist.',
      source: "https://commons.wikimedia.org/wiki/File:ROSA_Pianist_-_Mendelssohn%27s_Songs_Without_Words,_Book_5,_Op_62,_No._6,_Allegretto_grazioso_(Spring_Song),_MWV_U_161.ogg",
      license: 'https://creativecommons.org/licenses/by/3.0/',
      licenseName: 'CC BY 3.0',
      note: 'OGG original; MP3 convertido. Reprodução em loop.',
    },
  },
  pages: {
    nome: {
      question: 'E qual era o nome?',
      answers: [{ aliases: ['Florzinha'], to: 'lembranca' }],
      fallback: 'esquecimento',
      music: 'spring',
    },
    lembranca: { text: 'Você se lembrou.', music: 'spring' },
    esquecimento: {
      text: 'Não era esse o nome.',
      links: [{ label: 'Tentar novamente', to: 'nome' }],
      music: 'spring',
    },
  },
};

export function resolveAnswer(page, input) {
  const normalized = input.trim().toLocaleLowerCase('pt-BR');
  if (!normalized) return null;
  return page.answers?.find(branch => branch.aliases.some(
    alias => alias.trim().toLocaleLowerCase('pt-BR') === normalized,
  ))?.to ?? page.fallback;
}
