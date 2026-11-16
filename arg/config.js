// Add pages and answer branches here. Destinations refer to keys in pages.
const backToQuestion = [{ label: 'Voltar', to: 'nome' }];
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
      answers: [
        { aliases: ['Florzinha'], to: 'lembranca' },
        { aliases: ['Flor'], to: 'flor' },
        { aliases: ['Claire'], to: 'claire' },
        { aliases: ['Gaia'], to: 'nome', action: 'reset' },
        { aliases: ['Terra'], to: 'terra' },
        { aliases: ['Ellias'], to: 'ellias' },
        { aliases: ['Tupihani'], to: 'tupihani' },
        { aliases: ['Hamanabe', 'Ratanabá', 'Ratanaba'], to: 'hamanabe' },
        { aliases: ['Rato', 'Favour'], to: 'rato' },
        { aliases: ['Yodacu', 'Yodácu'], to: 'yodacu' },
        { aliases: ['Nomion Voss', 'nomion', 'voss'], to: 'nomion' },
        { aliases: ['FG', 'From Gaia', 'Navika'], to: 'juramento' },
        { aliases: ['Cavaleira', 'Serpente', 'Carter'], to: 'culto' },
        { aliases: ['Charu'], to: 'charu' },
        { aliases: ['Kid'], to: 'kid' },
        { aliases: ['Comerciante', 'Lojista'], to: 'comerciante' },
        { aliases: ['Johnny Luckymann', 'johnny', 'luckymann'], to: 'johnny' },
      ],
      fallback: 'esquecimento',
      music: 'spring',
    },
    lembranca: { text: 'E então, um belo oásis formou-se.', style: 'life', music: 'spring' },
    flor: { links: backToQuestion, text: 'Você está bem perto', style: 'near', music: 'spring' },
    claire: { links: backToQuestion, text: 'Um poço de bondade e VIDA', highlights: ['VIDA'], music: 'spring' },
    terra: { links: backToQuestion,
      title: 'Terra',
      image: { src: 'images/earth.jpg', alt: 'Terra totalmente borrada, com cores invertidas.', style: 'distorted-earth' },
    },
    ellias: { links: backToQuestion, text: 'bruh.', style: 'deadpan', music: 'spring' },
    tupihani: { links: backToQuestion, text: 'OS ANJOS DESCERÃO A TERRA E NOS DIRÃO A RESPOSTA DESSE ARG ... mas não é essa a resposta.', style: 'proclamation', music: 'spring' },
    hamanabe: { links: backToQuestion, text: 'Ser devorado por ele não deve ser uma boa experiencia.', style: 'ominous', music: 'spring' },
    rato: { links: backToQuestion, text: 'A Chave.', style: 'key', music: 'spring' },
    yodacu: { links: backToQuestion,
      title: 'Yodacu',
      image: { src: 'images/car.jpg', alt: 'Um carro vermelho.', sound: 'audio/horn.wav', label: 'Buzinar' },
      music: 'spring',
    },
    nomion: { links: backToQuestion, text: 'Um bom homem.', style: 'gentle', music: 'spring' },
    juramento: { links: backToQuestion,
      text: '“Juro solenemente ███████ █████ ████ █ minhas capacidades █ ██████ ██ ██████████, █ proteção da ████████████ do █████ e à ████████ dos ████████ ██████████ de toda ████ █████████; ███ profundezas do ████████ aos ███████ ██ ███████, enquanto ██ █████. E ██████ ██ ███████████ por ██████ que ███████, █████ ███ única ████████: █ █████.”',
      style: 'oath', music: 'spring',
    },
    culto: { links: backToQuestion, text: 'O Culto Lembrará.', style: 'ominous', music: 'spring' },
    charu: { links: backToQuestion, text: 'Você não tem tacos o suficiente.', style: 'deadpan', music: 'spring' },
    kid: { links: backToQuestion, text: 'Mais um nome perdido sob a poeira estelar.', style: 'stardust', music: 'spring' },
    comerciante: { links: backToQuestion, text: 'Ele conspira.', style: 'whisper', music: 'spring' },
    johnny: { links: backToQuestion, text: 'VOCÊ NÃO PERDERIA A OPORTUNIDADE DE FAZER NEGÓCIO COM JONNY LUCKYMANN', style: 'salesman', music: 'spring' },
    esquecimento: { links: backToQuestion,
      text: 'Não era esse o nome.',
      music: 'spring',
    },
  },
};

export function resolveAnswer(page, input) {
  const branch = matchAnswer(page, input);
  if (!input.trim()) return null;
  return branch?.to ?? page.fallback;
}

export function matchAnswer(page, input) {
  const normalized = input.trim().toLocaleLowerCase('pt-BR');
  if (!normalized) return null;
  return page.answers?.find(branch => branch.aliases.some(
    alias => alias.trim().toLocaleLowerCase('pt-BR') === normalized,
  ));
}
