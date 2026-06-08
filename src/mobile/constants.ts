export const MOBILE_BREAKPOINT = 576;

export const MOBILE_TABLES = [
  {
    key: 'daily',
    route: 'daily',
    name: '吐槽树洞',
    apiCategory: '吐槽',
    intro: '情绪、碎碎念和匿名感更强的校园日常。',
    tags: ['全部', '情绪吐槽', '随口求助', '日记'],
  },
  {
    key: 'study',
    route: 'study',
    name: '学习经验',
    apiCategory: '学习',
    intro: '课程、考试、保研和选课避坑。',
    tags: ['全部', '课程', '考试', '经验'],
  },
  {
    key: 'project',
    route: 'project',
    name: '比赛项目',
    apiCategory: '艺术',
    intro: '比赛组队、项目招募和实践复盘。',
    tags: ['全部', '比赛', '项目', '实践'],
  },
  {
    key: 'emotion',
    route: 'emotion',
    name: '情感成长',
    apiCategory: '情感',
    intro: '关系、成长与自我整理。',
    tags: ['全部', '感情', '成长', '回顾'],
  },
  {
    key: 'campus',
    route: 'campus',
    name: '校园生活',
    apiCategory: '闲聊',
    intro: '寝室、食堂、活动和校内新鲜事。',
    tags: ['全部', '校园', '生活', '经验'],
  },
  {
    key: 'trade',
    route: 'trade',
    name: '闲置互助',
    apiCategory: '八卦',
    intro: '闲置流转、拼车拼单和互助信息。',
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
