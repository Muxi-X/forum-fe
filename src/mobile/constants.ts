export const MOBILE_BREAKPOINT = 576;

export const MOBILE_TABLES = [
  {
    key: 'daily',
    route: 'daily',
    name: '即时 吐槽 树洞',
    apiCategory: '即时 · 日常 · 树洞',
    intro: '轻轻放下今天的情绪和碎碎念。',
    tags: ['全部', '情绪吐槽', '随口求助', '日记'],
  },
  {
    key: 'study',
    route: 'study',
    name: '学习 决策 经验',
    apiCategory: '学习 · 决策 · 经验',
    intro: '课程、考试、保研与选择经验。',
    tags: ['全部', '课程', '考试', '经验'],
  },
  {
    key: 'project',
    route: 'project',
    name: '比赛 项目 实践',
    apiCategory: '比赛 · 项目 · 实践',
    intro: '组队、复盘和实践记录。',
    tags: ['全部', '比赛', '项目', '实践'],
  },
  {
    key: 'emotion',
    route: 'emotion',
    name: '感情 成长 回顾',
    apiCategory: '感情 · 成长 · 回顾',
    intro: '关系、成长与自我整理。',
    tags: ['全部', '感情', '成长', '回顾'],
  },
  {
    key: 'campus',
    route: 'campus',
    name: '校园生活 日常经验',
    apiCategory: '校园生活 · 日常经验',
    intro: '在校园里生活得更顺手一点。',
    tags: ['全部', '校园', '生活', '经验'],
  },
  {
    key: 'trade',
    route: 'trade',
    name: '闲置 出物 互助',
    apiCategory: '闲置 · 出物 · 互助',
    intro: '闲置流转与互助信息。',
    tags: ['全部', '闲置', '出物', '互助'],
  },
] as const;

export const DEFAULT_TABLE = MOBILE_TABLES[0];

export const TARGET_TYPE = {
  post: 1,
  sipScore: 2,
} as const;

export const SORT_TYPE = {
  newest: 1,
  hottest: 2,
  highest: 3,
  lowest: 4,
} as const;

export const TYPE_NAME = {
  post: 'post',
  comment: 'comment',
  firstLevel: 'first-level',
  secondLevel: 'second-level',
  subPost: 'sub-post',
  sipScoreEntryCommentRating: 'sip-score-entry-comment-rating',
} as const;

export const mobileTableByRoute = (route?: string) =>
  MOBILE_TABLES.find((item) => item.route === route || item.key === route);

export const mobileTableByCategory = (category?: string) =>
  MOBILE_TABLES.find((item) => item.apiCategory === category) || DEFAULT_TABLE;
