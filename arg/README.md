# ARG

Run the repository with `python3 -m http.server` and open `/arg/index.html`.
The homepage footer's `?` is the entrance. No build or dependencies are needed.

## Editing the story

Edit `config.js`. `story.start` names the first page; each key in `story.pages`
is a page ID, reachable directly at `index.html?page=ID`. IDs must be nonempty.
Each page can define:

- `question`: shows an answer form.
- `text`: an ending heading, or supporting text below a question.
- `answers`: ordered branches with `aliases` (accepted strings) and `to` (page ID).
- `fallback`: destination for an unmatched, nonempty answer. Omit to keep players on the question.
- `links`: optional `{ label, to }` navigation links.
- `music`: a key in `story.tracks`. Omit for silence.

Answers ignore capitalization and surrounding whitespace, but not spelling,
accents, punctuation, or spaces within a name. Empty answers never navigate.
The first matching branch wins. All text renders as plain text, not HTML.

For example, add this branch to `nome.answers`:

```js
{ aliases: ['jardim', 'o jardim'], to: 'jardim' }
```

Then add this entry to `story.pages`:

```js
jardim: {
  question: 'O que ficou para trás?',
  answers: [{ aliases: ['uma carta', 'carta'], to: 'lembranca' }],
  fallback: 'esquecimento',
  music: 'spring',
},
```

Use existing IDs for every destination. Unknown IDs show a recovery link.
Navigation uses browser history; refresh and shared URLs work on a static server.
Answers and endings are visible in the source and accessible by URL. There is
no authentication, progress storage, or server-side puzzle protection.

## Music

Tracks declare `sources` (local URLs relative to `arg/index.html`, with MIME
types), `credit`, `source`, `license`, `licenseName`, and `note`. Add licensed
files under `audio/` and update those fields when replacing a track.
Pages sharing a music key keep the same playback position during navigation.
Refresh starts a new player. Autoplay may require the “Ativar som” button;
mute is retained during in-page navigation. Audio failure does not block play.

Bundled music: **Spring Song, Op. 62 No. 6**, composed by Felix Mendelssohn,
performed by **ROSA Pianist**.

- [Source and original OGG](https://commons.wikimedia.org/wiki/File:ROSA_Pianist_-_Mendelssohn%27s_Songs_Without_Words,_Book_5,_Op_62,_No._6,_Allegretto_grazioso_(Spring_Song),_MWV_U_161.ogg)
- [Original performance](https://www.youtube.com/watch?v=sojYxciyv98)
- [Creative Commons Attribution 3.0 Unported](https://creativecommons.org/licenses/by/3.0/)

The OGG is unmodified. The MP3 is a format conversion for browser compatibility.
Playback loops at reduced volume; the recording has not been cut or rearranged.
The recording is licensed for reuse with attribution, not copyright-free.
