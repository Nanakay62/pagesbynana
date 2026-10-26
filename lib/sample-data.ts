import { Book, SiteSettings } from './types';

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Pages by Nana',
  tagline: 'Original fiction, quietly told.',
  author_name: 'Nana Kwame Dickson',
  author_bio: 'Nana Kwame Dickson writes quiet fiction about memory, language, and the small ceremonies of ordinary life. Based between Accra and the coast, believing that a story, told slowly, can outlast almost anything.',
  paystack_url: 'https://paystack.com/pay/pagesbynana',
  kofi_url: 'https://ko-fi.com/pagesbynana',
  admin_email: 'nanakwamedickson@outlook.com',
};

export const SAMPLE_BOOKS: Book[] = [
  {
    id: 'b0000001-0000-0000-0000-000000000001',
    slug: 'the-lantern-keeper',
    title: 'The Lantern Keeper',
    genre: 'Literary Fantasy',
    status: 'published',
    is_featured: true,
    cover_url: 'cover-a',
    synopsis: 'In a city where every streetlamp holds a memory, one young woman inherits the duty of keeping them lit. When the oldest lantern begins to flicker, she must decide which memories are worth saving — and which are better left in the dark.',
    tags: ['memory', 'family', 'magical realism', 'slow burn'],
    chapters: [
      {
        id: 'c0000001-0000-0000-0000-000000000001',
        book_id: 'b0000001-0000-0000-0000-000000000001',
        number: 1,
        slug: 'the-flickering',
        title: 'The Flickering',
        word_count: 2140,
        status: 'published',
        content_html: `
<p>The first lantern to fail was the one on Sable Street, and nobody noticed for three days. It simply went out on a Tuesday, quietly, the way old things do when they have been tired for a long time. By the time Maren walked past it on her way to the bakery, the glass was already cold, and the little curl of smoke that used to live inside it had gone somewhere else entirely.</p>
<p>She stopped, because stopping was what keepers did, and she had been a keeper now for eleven days — though she still did not quite believe it. Her grandmother's keys sat heavy in her coat pocket, seven of them, each one cut for a different lantern post. The biggest one, the one with the worn teeth, was for the lantern at the corner of Sable and Thread. It had been her grandmother's first posting, sixty years ago.</p>
<p>"You'll know when it's time," her grandmother had told her, the week before the hospice nurse came for the last time. "The lanterns speak, if you've the patience to listen. They don't shout. They <em>hint</em>."</p>
<p>Maren had nodded, because what else does one do when a dying woman tells you the streetlamps have opinions. She had not expected to understand. She had certainly not expected to inherit.</p>
<p>But here she was, standing in the November drizzle, looking at a dead lamp and feeling — something. Not grief, exactly. More like the quiet you feel in a house after someone has left it for the last time. The lantern had been holding Mrs. Adebayo's laugh, the one she used when her grandchildren visited on Sundays. Maren could almost hear it, a bright, surprised sound, the kind that starts in the chest and ends somewhere near the ceiling.</p>
<p>Now there was only the rain.</p>
<div class="scene-break"></div>
<p>She climbed the three iron steps of the post the way her grandmother had taught her, one hand on the cold rail, the other holding the oilskin bag of wicks. The city had tried, twenty years ago, to replace all the old lanterns with electric ones. The citizens had rioted. Not violently — nothing in Ashenmoor was ever violent — but with petitions, and bake sales, and a very long letter written in twelve different handwritings. The city had relented. The lanterns stayed.</p>
<p>Maren fitted a new wick, struck the match, and held it to the thread. The flame caught, small and yellow, and then — slowly, the way a sleeper wakes — it began to remember.</p>
<p>She heard Mrs. Adebayo's laugh again, fainter now, but there. And beneath it, something else. A man's voice, singing. A child's feet on wooden stairs. The lantern was not simply relit; it was <em>repopulated</em>, and Maren understood, in the way keepers understand things, that the flickering she had been warned about had already begun.</p>
<p>She climbed down, wiped her hands on her apron, and walked the remaining four blocks to her grandmother's house, where seven more lanterns were waiting to speak.</p>
        `
      },
      {
        id: 'c0000001-0000-0000-0000-000000000002',
        book_id: 'b0000001-0000-0000-0000-000000000001',
        number: 2,
        slug: 'the-inventory-of-flames',
        title: 'The Inventory of Flames',
        word_count: 1860,
        status: 'published',
        content_html: `
<p>The ledger lived in the bottom drawer of the desk, beneath a stack of unpaid gas bills and a tin of her grandmother's peppermints that had gone soft. Maren pulled it out on the fourth morning and opened it on the kitchen table, where the light was best.</p>
<p>It was not, strictly speaking, a ledger. It was a kind of diary, written in three different hands across sixty-odd years. Her great-aunt Elsie had started it, in a neat, slanting script that smelled faintly of lavender. Her grandmother had taken over in the fifties, her handwriting bolder, more hurried, full of crossings-out and marginal notes. The last entries were in pencil, shaky, the letters growing larger as the hand that wrote them grew weaker.</p>
<p><em>14 March. Sable Street lantern low. Refilled with memory of the first snow, 1962. Burns well.</em></p>
<p><em>2 April. Thread &amp; Sable. The Adebayo laugh is fading. Add the sound of her garden gate, the one that sings in B-flat.</em></p>
<p>Maren read these entries the way one reads a map of a country one has never visited: with fascination, and a slight, persistent disbelief. She did not know how to add the sound of a garden gate to a lantern. She did not even know, really, what it meant to add anything.</p>
<blockquote>"The lanterns do not hold light," her grandmother had written, on the very first page, in ink that had gone the color of tea. "They hold the things that light is for."</blockquote>
<p>Maren closed the ledger. She made tea. She considered, for the first time since the funeral, whether she was entirely equal to the job.</p>
        `
      },
      {
        id: 'c0000001-0000-0000-0000-000000000003',
        book_id: 'b0000001-0000-0000-0000-000000000001',
        number: 3,
        slug: 'what-the-oil-remembers',
        title: 'What the Oil Remembers',
        word_count: 2310,
        status: 'published',
        content_html: `
<p>The oil came from a man named Callum who lived at the edge of the marsh and who, according to her grandmother, had been alive for longer than was strictly reasonable. He did not sell the oil so much as trade for it, and the currency he accepted was unusual.</p>
<p>"A memory," he told Maren, when she arrived at his door for the first time, the empty bottle in her hand. "Not a big one. Nothing that would change the shape of you. Just a small, bright thing you don't quite need anymore."</p>
<p>Maren thought about this. She thought about the taste of the orange her father had given her on her seventh birthday, the one that had been so sweet it made her cry. She thought about the particular quality of the light in her old bedroom at four in the afternoon. She thought about — and here she paused, because the choosing of it mattered — the sound of her grandmother's key in the front door, coming home.</p>
<p>"That last one," she said.</p>
<p>Callum nodded, as if she had passed an examination. He took the empty bottle, held it between his palms, and asked her to speak the memory into it. She did. The bottle grew warm. When he handed it back, it was full of a pale, amber oil that moved slowly, like honey, and smelled — impossibly — of keys and rain.</p>
<div class="scene-break"></div>
<p>She walked home through the dusk, the bottle careful in both hands. The lanterns along Thread Street flickered as she passed, greeting her, or perhaps greeting what she carried. By the time she reached her grandmother's house, she had forgotten the exact sound of the key in the door. She knew, abstractedly, that it had existed. The feeling of it remained — the relief, the homecoming — but the sound itself was gone, traded for oil, given to the lanterns to keep.</p>
<p>She did not yet know whether this was a loss or a kind of mercy.</p>
        `
      }
    ]
  },
  {
    id: 'b0000001-0000-0000-0000-000000000002',
    slug: 'ember-and-ink',
    title: 'Ember & Ink',
    genre: 'Literary Fiction',
    status: 'published',
    is_featured: false,
    cover_url: 'cover-b',
    synopsis: 'A retired teacher in a small coastal town begins writing letters to a woman she never met — and discovers, page by page, that the letters are being answered.',
    tags: ['epistolary', 'grief', 'coastal', 'quiet'],
    chapters: [
      {
        id: 'c0000001-0000-0000-0000-000000000004',
        book_id: 'b0000001-0000-0000-0000-000000000002',
        number: 1,
        slug: 'the-first-letter',
        title: 'The First Letter',
        word_count: 1540,
        status: 'published',
        content_html: `
<p>I am writing to you because I do not know anyone else to write to, and because the sea is loud tonight and the sound of a pen on paper seems the only reasonable reply.</p>
<p>My name is Adwoa. I am seventy-three years old. I have lived in this house for forty-one of them, and before that I lived in the one on the hill, and before that in a village whose name I am beginning, shamefully, to forget. I taught children for thirty-eight years. I taught them to read, and to add, and to be kind to one another, which is the hardest lesson and the one they forget soonest.</p>
<p>I do not know your name. I found your photograph in a book I bought at the secondhand shop on Friday — the one with the green awning, next to the fishmonger's. You were standing on a beach I do not recognise, wearing a hat I very much admire. The book's previous owner had folded down the corner of page 117, and on that page, in pencil, someone had written: <em>for E., who would have known what to say.</em></p>
<p>I have decided that you were E. I have decided, because I am lonely and because the sea is loud, that I will write to you as if you might read it.</p>
        `
      },
      {
        id: 'c0000001-0000-0000-0000-000000000005',
        book_id: 'b0000001-0000-0000-0000-000000000002',
        number: 2,
        slug: 'the-green-awning',
        title: 'The Green Awning',
        word_count: 1720,
        status: 'published',
        content_html: `
<p>The secondhand shop is called, improbably, "Pages &amp; Plums." The owner, a young man with kind eyes and a persistent cold, does not question my visits. I go every Friday. I buy one book. I sometimes read it.</p>
<p>This Friday I bought a collection of essays by a woman whose name I have already forgotten, which is perhaps the point. Between the pages I found three things: your photograph, the inscription to E., and a pressed flower — a sea lavender, I think, though I am not certain any more — that smelled, impossibly, still of summer.</p>
<p>I took them home. I made tea. I laid them out on the kitchen table the way one lays out evidence, or relics. Then I sat with them for a long time, listening to the gulls, and I began this letter.</p>
        `
      }
    ]
  },
  {
    id: 'b0000001-0000-0000-0000-000000000003',
    slug: 'woven-chapters',
    title: 'Woven Chapters',
    genre: 'Magical Realism',
    status: 'completed',
    is_featured: false,
    cover_url: 'cover-c',
    synopsis: 'In a village where every life story is woven into a tapestry, a young woman discovers her own thread has been cut — and sets out to find who holds the scissors.',
    tags: ['folklore', 'fate', 'coming-of-age'],
    chapters: [
      {
        id: 'c0000001-0000-0000-0000-000000000006',
        book_id: 'b0000001-0000-0000-0000-000000000003',
        number: 1,
        slug: 'the-cut-thread',
        title: 'The Cut Thread',
        word_count: 1980,
        status: 'published',
        content_html: `
<p>The tapestry room smelled of dust and lavender and the particular kind of silence that belongs to old wool. Esi had been allowed inside exactly twice before her sixteenth birthday — once at seven, when she had hidden beneath the great loom during a storm, and once at twelve, when the village elder had permitted her to touch a single thread, just to feel what a life felt like before it was woven in.</p>
<p>Now she was sixteen, and the elder was dead, and the door stood open, and Esi walked in alone because nobody had thought to tell her she shouldn't.</p>
<p>The tapestries covered every wall. They hung from the ceiling in long, quiet columns, each one the story of a family, each thread a single life. She found her own family's column easily — the reds and golds were unmistakable, the colors her mother's mother's mother had chosen, generations ago, for the dye.</p>
<p>And there, near the bottom, she saw it. Her thread. It ran bright and strong through the weaving for fifteen years' worth of cloth, and then — abruptly, messily — it stopped. The end was not woven in. It was cut.</p>
        `
      }
    ]
  },
  {
    id: 'b0000001-0000-0000-0000-000000000004',
    slug: 'nightingales-tale',
    title: "The Nightingale's Tale",
    genre: 'Historical Fiction',
    status: 'published',
    is_featured: false,
    cover_url: 'cover-d',
    synopsis: 'A young translator in 1920s Accra discovers a notebook filled with songs in a language no one else remembers, and begins the quiet work of bringing them back.',
    tags: ['historical', 'language', 'music', 'slow burn'],
    chapters: [
      {
        id: 'c0000001-0000-0000-0000-000000000007',
        book_id: 'b0000001-0000-0000-0000-000000000004',
        number: 1,
        slug: 'the-notebook',
        title: 'The Notebook',
        word_count: 1640,
        status: 'published',
        content_html: `
<p>Ama found the notebook in the back of a trunk that had belonged to her great-uncle, who had died in 1919 of a fever the doctors could not name. The trunk had sat in the attic of her mother's house for as long as she could remember, and she had opened it only because the roof had leaked in the rains and the plaster was coming down in long, sad sheets.</p>
<p>The notebook was small, bound in cloth the color of old tea, and it was full of handwriting she did not recognise. The script was careful, almost musical, and the language — she was certain of this, though she could not have said how — was not one she had ever heard spoken.</p>
<p>She carried it downstairs. She made coffee. She sat at the kitchen table in the early light and began, slowly, to read.</p>
        `
      }
    ]
  }
];
