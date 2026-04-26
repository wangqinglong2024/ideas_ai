/**
 * E08 — Courses seed: bumps every track to 6 lessons in stage 1 to satisfy
 * the E08 DoD (≥ 24 lessons across 4 tracks), plus a pinyin-intro course
 * with the 3 onboarding lessons (initials / finals / tones).
 *
 * Idempotent (ON CONFLICT). Run after the learning seed.
 */
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('[courses-e08 seed] DATABASE_URL is required');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { max: 2, prepare: false });

type Lng = Record<string, string>;

interface LessonSpec {
  slug: string;
  i18n_title: Lng;
  is_free: boolean;
  is_pinyin_intro?: boolean;
  steps: Array<{ type: string; title: Lng; payload?: Record<string, unknown> }>;
}

interface CourseSpec {
  slug: string;
  track: string;
  stage_no: number;
  hsk_level: number;
  is_premium: boolean;
  i18n_title: Lng;
  i18n_summary: Lng;
  cover_url: string;
  sort_order: number;
  lessons: LessonSpec[];
}

function basicSteps(label: string): LessonSpec['steps'] {
  return [
    {
      type: 'intro',
      title: { en: `${label} · Intro`, zh: `${label} · 引入` },
      payload: { body: { en: `Welcome to ${label}.`, zh: `欢迎来到 ${label}。` } },
    },
    {
      type: 'word',
      title: { en: `${label} · Words`, zh: `${label} · 词汇` },
      payload: {
        words: [
          { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: { en: 'hello', zh: '你好' } },
          { hanzi: '谢谢', pinyin: 'xiè xie', meaning: { en: 'thanks', zh: '谢谢' } },
        ],
        pass_threshold: 0.8,
      },
    },
    {
      type: 'sentence',
      title: { en: `${label} · Sentences`, zh: `${label} · 句子` },
      payload: { sentences: [{ hanzi: '我学中文。', pinyin: 'wǒ xué zhōngwén' }] },
    },
    {
      type: 'pinyin',
      title: { en: `${label} · Pinyin`, zh: `${label} · 拼音` },
      payload: {
        items: [
          { question_id: 'p1', hanzi: '好', correct_pinyin: 'hǎo', options: ['hǎo', 'hāo', 'hào'] },
        ],
      },
    },
    {
      type: 'listen',
      title: { en: `${label} · Listen`, zh: `${label} · 听力` },
      payload: {
        items: [
          {
            question_id: 'l1',
            audio_url: '/audio/lessons/placeholder.mp3',
            options: [
              { id: 'a', text: '你好', is_correct: true },
              { id: 'b', text: '再见', is_correct: false },
            ],
          },
        ],
      },
    },
    {
      type: 'speak',
      title: { en: `${label} · Speak`, zh: `${label} · 跟读` },
      payload: {
        items: [{ question_id: 's1', hanzi: '你好' }],
        asr_adapter: 'fake',
      },
    },
    {
      type: 'read',
      title: { en: `${label} · Read`, zh: `${label} · 阅读` },
      payload: {
        passage: { hanzi: '你好，我叫小明。' },
        questions: [
          {
            question_id: 'r1',
            prompt: 'Who is speaking?',
            options: [
              { id: 'a', text: '小明', is_correct: true },
              { id: 'b', text: '小红', is_correct: false },
            ],
          },
        ],
      },
    },
    {
      type: 'write',
      title: { en: `${label} · Write`, zh: `${label} · 书写` },
      payload: { characters: [{ hanzi: '你' }, { hanzi: '好' }] },
    },
    {
      type: 'practice',
      title: { en: `${label} · Practice`, zh: `${label} · 练习` },
      payload: { game_slug: 'whack-hanzi', pass_score: 100 },
    },
    {
      type: 'quiz',
      title: { en: `${label} · Quiz`, zh: `${label} · 小测` },
      payload: {
        items: [
          {
            question_id: 'q1',
            kind: 'single',
            options: [
              { id: 'a', text: '你好', is_correct: true },
              { id: 'b', text: '再见', is_correct: false },
            ],
          },
        ],
        pass_threshold: 0.7,
      },
    },
  ];
}

function trackLessons(track: string, names: string[]): LessonSpec[] {
  return names.map((name, i) => ({
    slug: `${track}-s1-l${i + 1}-${name.toLowerCase().replace(/\s+/g, '-')}`,
    i18n_title: { en: name, zh: name },
    is_free: i < 2, // first 2 lessons free, rest premium for paywall demo
    steps: basicSteps(name),
  }));
}

const COURSES: CourseSpec[] = [
  {
    slug: 'daily-stage-1',
    track: 'daily',
    stage_no: 1,
    hsk_level: 1,
    is_premium: false,
    i18n_title: { en: 'Daily Chinese · Stage 1', zh: '日常汉语 · 第1阶段' },
    i18n_summary: { en: 'Greetings, intro, numbers, food.', zh: '问候 · 介绍 · 数字 · 点餐' },
    cover_url: '/img/courses/daily-s1.png',
    sort_order: 10,
    lessons: trackLessons('daily', ['Greetings', 'Numbers', 'Food', 'Family', 'Time', 'Weather']),
  },
  {
    slug: 'ecommerce-stage-1',
    track: 'ecommerce',
    stage_no: 1,
    hsk_level: 3,
    is_premium: true,
    i18n_title: { en: 'E-commerce · Stage 1', zh: '电商 · 第1阶段' },
    i18n_summary: { en: 'Customer service basics.', zh: '客服基础话术' },
    cover_url: '/img/courses/ecom-s1.png',
    sort_order: 20,
    lessons: trackLessons('ecommerce', ['Apology', 'Refund', 'Shipping', 'Reviews', 'Promo', 'Followup']),
  },
  {
    slug: 'factory-stage-1',
    track: 'factory',
    stage_no: 1,
    hsk_level: 2,
    is_premium: false,
    i18n_title: { en: 'Factory · Stage 1', zh: '工厂 · 第1阶段' },
    i18n_summary: { en: 'Safety + briefing.', zh: '安全 + 班前会' },
    cover_url: '/img/courses/factory-s1.png',
    sort_order: 30,
    lessons: trackLessons('factory', ['PPE', 'Signs', 'Briefing', 'Tools', 'Reports', 'First-Aid']),
  },
  {
    slug: 'hsk-stage-1',
    track: 'hsk',
    stage_no: 1,
    hsk_level: 1,
    is_premium: false,
    i18n_title: { en: 'HSK · Stage 1', zh: 'HSK · 第1阶段' },
    i18n_summary: { en: 'HSK1 vocab + grammar.', zh: 'HSK1 词汇 + 语法' },
    cover_url: '/img/courses/hsk-s1.png',
    sort_order: 40,
    lessons: trackLessons('hsk', ['Pronouns', 'Time', 'Numbers', 'Verbs', 'Adjectives', 'Particles']),
  },
];

const PINYIN_COURSE: CourseSpec = {
  slug: 'pinyin-intro',
  track: 'pinyin',
  stage_no: 0,
  hsk_level: 0,
  is_premium: false,
  i18n_title: { en: 'Pinyin Onboarding', zh: '拼音入门' },
  i18n_summary: { en: 'Initials · Finals · Tones', zh: '声母 · 韵母 · 声调' },
  cover_url: '/img/courses/pinyin.png',
  sort_order: 1,
  lessons: [
    {
      slug: 'pinyin-intro-initials',
      i18n_title: { en: 'Initials (23)', zh: '声母 (23)' },
      is_free: true,
      is_pinyin_intro: true,
      steps: [
        {
          type: 'intro',
          title: { en: 'Initials', zh: '声母' },
          payload: { body: { en: '23 initials of mandarin.', zh: '普通话的 23 个声母。' } },
        },
        {
          type: 'p1',
          title: { en: 'Hear → pick pinyin', zh: '听音选拼音' },
          payload: {
            items: [
              { question_id: 'i1', audio_url: '/audio/pinyin/b.mp3', correct_pinyin: 'b', options: ['b', 'p', 'm', 'f'] },
              { question_id: 'i2', audio_url: '/audio/pinyin/d.mp3', correct_pinyin: 'd', options: ['d', 't', 'n', 'l'] },
            ],
          },
        },
        {
          type: 'quiz',
          title: { en: 'Initials quiz', zh: '声母测验' },
          payload: {
            items: [
              {
                question_id: 'qi1',
                kind: 'single',
                options: [
                  { id: 'a', text: 'b', is_correct: true },
                  { id: 'b', text: 'p', is_correct: false },
                ],
              },
            ],
            pass_threshold: 0.7,
          },
        },
      ],
    },
    {
      slug: 'pinyin-intro-finals',
      i18n_title: { en: 'Finals (24)', zh: '韵母 (24)' },
      is_free: true,
      is_pinyin_intro: true,
      steps: [
        {
          type: 'intro',
          title: { en: 'Finals', zh: '韵母' },
          payload: { body: { en: '24 finals.', zh: '24 个韵母。' } },
        },
        {
          type: 'p2',
          title: { en: 'Pinyin → hanzi', zh: '看拼音选汉字' },
          payload: {
            items: [
              { question_id: 'f1', pinyin: 'mā', correct_hanzi: '妈', options: ['妈', '麻', '马', '骂'] },
              { question_id: 'f2', pinyin: 'shū', correct_hanzi: '书', options: ['书', '叔', '舒', '梳'] },
            ],
          },
        },
        {
          type: 'quiz',
          title: { en: 'Finals quiz', zh: '韵母测验' },
          payload: {
            items: [
              {
                question_id: 'qf1',
                kind: 'single',
                options: [
                  { id: 'a', text: 'a', is_correct: true },
                  { id: 'b', text: 'o', is_correct: false },
                ],
              },
            ],
            pass_threshold: 0.7,
          },
        },
      ],
    },
    {
      slug: 'pinyin-intro-tones',
      i18n_title: { en: 'Tones (4)', zh: '声调 (4)' },
      is_free: true,
      is_pinyin_intro: true,
      steps: [
        {
          type: 'intro',
          title: { en: 'Tones', zh: '声调' },
          payload: { body: { en: 'Four tones + neutral.', zh: '四个声调 + 轻声。' } },
        },
        {
          type: 'p3',
          title: { en: 'Tone judging', zh: '声调判断' },
          payload: {
            items: [
              { question_id: 't1', pinyin_no_tone: 'ma', audio_url: '/audio/pinyin/ma1.mp3', correct_tone: 1 },
              { question_id: 't2', pinyin_no_tone: 'ma', audio_url: '/audio/pinyin/ma3.mp3', correct_tone: 3 },
            ],
          },
        },
        {
          type: 'quiz',
          title: { en: 'Tones quiz', zh: '声调测验' },
          payload: {
            items: [
              {
                question_id: 'qt1',
                kind: 'single',
                options: [
                  { id: 'a', text: '1st tone', is_correct: true },
                  { id: 'b', text: '2nd tone', is_correct: false },
                ],
              },
            ],
            pass_threshold: 0.7,
          },
        },
      ],
    },
  ],
};

async function upsertCourse(c: CourseSpec): Promise<string> {
  const [row] = await sql<{ id: string }[]>`
    INSERT INTO zhiyu.courses (
      slug, track, stage_no, hsk_level, is_premium, status,
      i18n_title, i18n_summary, cover_url, sort_order
    )
    VALUES (
      ${c.slug}, ${c.track}, ${c.stage_no}, ${c.hsk_level}, ${c.is_premium}, 'published',
      ${sql.json(c.i18n_title)}, ${sql.json(c.i18n_summary)},
      ${c.cover_url}, ${c.sort_order}
    )
    ON CONFLICT (slug) DO UPDATE
      SET track = EXCLUDED.track,
          stage_no = EXCLUDED.stage_no,
          hsk_level = EXCLUDED.hsk_level,
          is_premium = EXCLUDED.is_premium,
          status = EXCLUDED.status,
          i18n_title = EXCLUDED.i18n_title,
          i18n_summary = EXCLUDED.i18n_summary,
          cover_url = EXCLUDED.cover_url,
          sort_order = EXCLUDED.sort_order,
          updated_at = now()
    RETURNING id
  `;
  return row!.id;
}

async function upsertLesson(courseId: string, l: LessonSpec, position: number): Promise<void> {
  await sql`
    INSERT INTO zhiyu.lessons (
      course_id, slug, position, lesson_no, chapter_no,
      is_free, is_pinyin_intro, i18n_title, steps
    )
    VALUES (
      ${courseId}, ${l.slug}, ${position}, ${position}, 1,
      ${l.is_free}, ${l.is_pinyin_intro ?? false},
      ${sql.json(l.i18n_title)}, ${sql.json(l.steps)}
    )
    ON CONFLICT (course_id, slug) DO UPDATE
      SET position = EXCLUDED.position,
          lesson_no = EXCLUDED.lesson_no,
          chapter_no = EXCLUDED.chapter_no,
          is_free = EXCLUDED.is_free,
          is_pinyin_intro = EXCLUDED.is_pinyin_intro,
          i18n_title = EXCLUDED.i18n_title,
          steps = EXCLUDED.steps,
          updated_at = now()
  `;
}

async function run(): Promise<void> {
  let coursesN = 0;
  let lessonsN = 0;
  for (const c of [PINYIN_COURSE, ...COURSES]) {
    const id = await upsertCourse(c);
    coursesN += 1;
    for (let i = 0; i < c.lessons.length; i += 1) {
      await upsertLesson(id, c.lessons[i]!, i + 1);
      lessonsN += 1;
    }
    await sql`UPDATE zhiyu.courses SET lesson_count = ${c.lessons.length} WHERE id = ${id}`;
  }
  console.info(`[courses-e08 seed] courses=${coursesN} lessons=${lessonsN}`);
  await sql.end({ timeout: 5 });
}

run().catch(async (err) => {
  console.error('[courses-e08 seed] failed', err);
  try {
    await sql.end({ timeout: 1 });
  } catch {
    // noop
  }
  process.exit(1);
});
