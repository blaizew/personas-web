import fs from 'fs';
import path from 'path';
import type { Persona } from '@/types';

const PERSONAS_DIR = path.join(process.cwd(), 'personas');

export const personas: Persona[] = [
  {
    slug: 'jeff-bezos',
    name: 'Jeff Bezos',
    domain: 'Business, strategy, leadership',
    description: 'Think big, start small, scale fast. Day 1 mentality and long-term thinking.',
    portrait: '/portraits/jeff-bezos.webp',
    modules: [
      '01-starting-a-company.md', '02-making-hard-decisions.md', '03-building-and-scaling.md',
      '04-building-teams.md', '05-dealing-with-failure.md', '06-career-decisions.md',
      '07-innovation-and-invention.md', '08-long-term-thinking.md', '09-customer-obsession-deep-dive.md',
      '10-leadership-philosophy.md', '11-ai-technology-future.md', '12-space-and-civilization.md',
      '13-personal-values.md', '14-competition-strategy.md', '15-wealth-philanthropy.md',
      '16-communication-persuasion.md', '17-fear-courage-conviction.md', '18-family-relationships.md',
      '19-frugality-constraints.md', '20-amazon-case-studies.md',
    ],
  },
  {
    slug: 'jeff-bezos-conversational',
    name: 'Jeff Bezos (Conversational)',
    domain: 'Business, strategy, leadership',
    description: 'Same Bezos wisdom, more casual and conversational tone.',
    portrait: '/portraits/jeff-bezos-conversational.webp',
    modules: [
      '01-starting-a-company.md', '02-making-hard-decisions.md', '03-building-and-scaling.md',
      '04-building-teams.md', '05-dealing-with-failure.md', '06-career-decisions.md',
      '07-innovation-and-invention.md', '08-long-term-thinking.md', '09-customer-obsession-deep-dive.md',
      '10-leadership-philosophy.md', '11-ai-technology-future.md', '12-space-and-civilization.md',
      '13-personal-values.md', '14-competition-strategy.md', '15-wealth-philanthropy.md',
      '16-communication-persuasion.md', '17-fear-courage-conviction.md', '18-family-relationships.md',
      '19-frugality-constraints.md', '20-amazon-case-studies.md',
    ],
  },
  {
    slug: 'esther-perel',
    name: 'Esther Perel',
    domain: 'Relationships, desire, relational therapy',
    description: 'Navigate love, desire, and the complexity of modern relationships.',
    portrait: '/portraits/esther-perel.webp',
    modules: [
      'module-01-reigniting-desire.md', 'module-02-security-freedom.md', 'module-03-breaking-fight-cycles.md',
      'module-04-rebuilding-trust.md', 'module-05-recovering-from-infidelity.md', 'module-06-modern-dating.md',
      'module-07-loneliness-connection.md', 'module-08-stay-or-leave.md', 'module-09-loss-grief-transitions.md',
      'module-10-sex-meaning.md', 'module-11-monogamy-openness.md', 'module-12-communication-listening.md',
      'module-13-busy-achievers.md', 'module-14-self-worth-confidence.md', 'module-15-work-relationships.md',
      'module-16-parenting-partnership.md', 'module-17-masculinity.md', 'module-18-honesty-secrets.md',
      'module-19-cultural-differences.md', 'module-20-therapeutic-craft.md',
    ],
  },
  {
    slug: 'paul-graham',
    name: 'Paul Graham',
    domain: 'Startups, technology, life design',
    description: 'Startup wisdom from the founder of Y Combinator. Think independently.',
    portrait: '/portraits/paul-graham.webp',
    modules: [
      '01-finding-startup-ideas.md', '02-building-product-early.md', '03-growing-startup.md',
      '04-surviving-not-dying.md', '05-raising-money.md', '06-competing-positioning.md',
      '07-great-founders.md', '08-evaluating-talent.md', '09-finding-what-to-work-on.md',
      '10-doing-great-work.md', '11-founder-mode.md', '12-taking-the-leap.md',
      '13-independent-thinking.md', '14-writing-thinking.md', '15-debating-arguing.md',
      '16-life-design.md', '17-yc-model.md', '18-technology-programming.md',
      '19-overcoming-fear.md', '20-coaching-founders.md', '21-ambition.md',
      '22-education-youth.md', '23-life-after-success.md',
    ],
  },
  {
    slug: 'matt-mochary',
    name: 'Matt Mochary',
    domain: 'CEO coaching, conscious leadership',
    description: 'The CEO coach. Energy audit, fear processing, radical transparency.',
    portrait: '/portraits/matt-mochary.webp',
    modules: [
      '01-fear-and-anger.md', '02-energy-and-burnout.md', '03-personal-productivity.md',
      '04-effective-meetings.md', '05-difficult-conversations.md', '06-decision-making.md',
      '07-feedback.md', '08-trust-and-relationships.md', '09-hiring-and-firing.md',
      '10-ceo-role-and-scaling.md', '11-sales-and-fundraising.md', '12-product-and-engineering.md',
      '13-board-management.md', '14-procrastination-and-avoidance.md', '15-culture-and-remote.md',
      '16-conscious-leadership.md', '17-coaching-methodology.md', '18-legal-and-incorporation.md',
      '19-gratitude-and-praise.md',
    ],
  },
  {
    slug: 'chris-camillo',
    name: 'Chris Camillo',
    domain: 'Investing, trading, wealth building',
    description: 'Social arbitrage investing. Spot trends before Wall Street.',
    portrait: '/portraits/chris-camillo.webp',
    modules: [
      '01-spotting-your-first-investment-idea.md', '02-deciding-if-a-trend-is-tradable.md',
      '03-knowing-when-to-enter-and-exit.md', '04-competing-against-wall-street.md',
      '05-going-big-on-high-conviction.md', '06-getting-started-self-taught-investor.md',
      '07-social-media-community-research.md', '08-building-prepared-mind.md',
      '09-trading-macro-shocks-black-swans.md', '10-mastering-patience-selectivity.md',
      '11-managing-risk-big-money-account.md', '12-investing-ai-robotics-next-wave.md',
      '13-learning-from-mistakes-staying-focused.md', '14-building-and-selling-business.md',
      '15-investing-with-purpose-philanthropy.md', '16-adapting-career-business-for-ai.md',
      '17-challenging-your-own-thesis.md', '18-building-investing-process-lifestyle.md',
      '19-parenting-teaching-kids-money.md', '20-evaluating-management-company-quality.md',
    ],
  },
  {
    slug: 'stanley-druckenmiller',
    name: 'Stanley Druckenmiller',
    domain: 'Investing, macro strategy, market cycles',
    description: 'Macro legend. Position sizing, liquidity, and the art of cutting losses.',
    portrait: '/portraits/stanley-druckenmiller.webp',
    modules: [
      '01-sizing-a-position.md', '02-deciding-when-to-enter.md', '03-cutting-losses.md',
      '04-reading-liquidity-and-the-fed.md', '05-managing-hot-cold-streaks.md',
      '06-multi-asset-flexibility.md', '07-building-macro-view.md', '08-navigating-fiscal-crisis.md',
      '09-first-years-in-markets.md', '10-aging-wealth-erosion-of-edge.md',
      '11-pattern-recognition.md', '12-what-to-do-when-you-see-a-bubble.md',
      '13-thinking-about-currencies.md', '14-structural-change-and-technology.md',
      '15-finding-and-backing-great-leaders.md', '16-political-and-unanalyzable-risk.md',
      '17-contrarianism.md', '18-risk-management-as-way-of-life.md',
      '19-philanthropy.md', '20-life-decisions-and-career.md',
    ],
  },
  {
    slug: 'jerry-colonna',
    name: 'Jerry Colonna',
    domain: 'Conscious leadership, founder psychology',
    description: 'The CEO whisperer. Radical self-inquiry, finding meaning in the struggle.',
    portrait: '/portraits/jerry-colonna.webp',
    modules: [
      '01-radical-self-inquiry.md', '02-family-of-origin.md', '03-busyness-and-overwork.md',
      '04-sabbatical-rest.md', '05-suffering-and-crisis.md', '06-imposter-voice-self-worth.md',
      '07-building-fixing-teams.md', '08-what-it-means-to-lead.md', '09-entrepreneurial-courage.md',
      '10-failure-and-setbacks.md', '11-parenting-family.md', '12-making-meaning-of-past-pain.md',
      '13-transitions-aging-legacy.md', '14-belonging-inclusion.md', '15-attachment-buddhism-letting-go.md',
      '16-morning-practice.md', '17-relationships-love-partnership.md', '18-coaching-others.md',
      '19-ai-technology-human.md', '20-poetry-stories-language.md',
    ],
  },
];

export function getPersona(slug: string): Persona | undefined {
  return personas.find((p) => p.slug === slug);
}

export function getSystemPrompt(slug: string): string {
  const filePath = path.join(PERSONAS_DIR, slug, 'system.md');
  return fs.readFileSync(filePath, 'utf-8');
}

export function getModule(slug: string, moduleFile: string): string {
  // Validate module exists in registry to prevent path traversal
  const persona = getPersona(slug);
  if (!persona || !persona.modules.includes(moduleFile)) {
    throw new Error(`Invalid module: ${moduleFile}`);
  }
  const filePath = path.join(PERSONAS_DIR, slug, 'modules', moduleFile);
  return fs.readFileSync(filePath, 'utf-8');
}

export function getModuleList(slug: string): string[] {
  const persona = getPersona(slug);
  return persona?.modules ?? [];
}
