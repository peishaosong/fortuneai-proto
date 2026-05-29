// FortuneAI i18n - 中文/English localization

export type Lang = 'zh' | 'en';

export const i18n = {
  // ── App / Tab titles ──
  app: {
    tabTitles: {
      report: { zh: 'AI运势报告', en: 'AI Fortune Reading' },
      names: { zh: '姓名解析', en: 'Name Analysis' },
      calendar: { zh: '择日吉凶', en: 'Date Selection' },
      fengshui: { zh: '风水堪舆', en: 'Feng Shui' },
      guanyin: { zh: '观音灵签', en: 'Guanyin Divination' },
    },
    tabLabels: {
      report: { zh: '运势报告', en: 'Fortune Reading' },
      names: { zh: '姓名解析', en: 'Name Analysis' },
      calendar: { zh: '择日吉凶', en: 'Date Selection' },
      fengshui: { zh: '风水堪舆', en: 'Feng Shui' },
      guanyin: { zh: '观音灵签', en: 'Guanyin Divination' },
    },
    nameLoading: { zh: '☯ 姓名解析中...', en: '☯ Analyzing name...' },
  },

  // ── TabNav ──
  tabNav: {
    report: { zh: '运势报告', en: 'Fortune Reading' },
    names: { zh: '姓名解析', en: 'Name Analysis' },
    calendar: { zh: '择日吉凶', en: 'Date Selection' },
    fengshui: { zh: '风水堪舆', en: 'Feng Shui' },
    guanyin: { zh: '观音灵签', en: 'Guanyin Divination' },
  },

  // ── BaZiInputCard ──
  bazi: {
    title: { zh: '八字精批', en: 'BaZi Analysis' },
    subtitle: { zh: '输入出生信息，获取命运指引', en: 'Enter your birth details for destiny guidance' },
    birthDate: { zh: '出生日期', en: 'Birth Date' },
    birthHour: { zh: '出生时辰', en: 'Birth Hour' },
    gender: { zh: '性别', en: 'Gender' },
    submit: { zh: '开始排盘', en: 'Generate Chart' },
    timeHints: {
      '子时': { zh: '子时', en: 'Zi Hour (23:00-00:59)' },
      '丑时': { zh: '丑时', en: 'Chou Hour (01:00-02:59)' },
      '寅时': { zh: '寅时', en: 'Yin Hour (03:00-04:59)' },
      '卯时': { zh: '卯时', en: 'Mao Hour (05:00-06:59)' },
      '辰时': { zh: '辰时', en: 'Chen Hour (07:00-08:59)' },
      '巳时': { zh: '巳时', en: 'Si Hour (09:00-10:59)' },
      '午时': { zh: '午时', en: 'Wu Hour (11:00-12:59)' },
      '未时': { zh: '未时', en: 'Wei Hour (13:00-14:59)' },
      '申时': { zh: '申时', en: 'Shen Hour (15:00-16:59)' },
      '酉时': { zh: '酉时', en: 'You Hour (17:00-18:59)' },
      '戌时': { zh: '戌时', en: 'Xu Hour (19:00-20:59)' },
      '亥时': { zh: '亥时', en: 'Hai Hour (21:00-22:59)' },
    },
  },

  // ── FortuneReport ──
  fortuneReport: {
    title: { zh: 'AI运势报告', en: 'AI Fortune Reading' },
    yuanzhuCount: { zh: '已有 %d 位缘主解读命盘', en: '%d readings generated today' },
    pillars: {
      year: { zh: '年柱', en: 'Year' },
      month: { zh: '月柱', en: 'Month' },
      day: { zh: '日柱', en: 'Day' },
      hour: { zh: '时柱', en: 'Hour' },
    },
    sections: {
      '命盘总论': { zh: '命盘总论', en: 'Life Destiny Overview' },
      '事业运势': { zh: '事业运势', en: 'Career' },
      '感情姻缘': { zh: '感情姻缘', en: 'Love & Relationships' },
      '财富运势': { zh: '财富运势', en: 'Wealth' },
      '健康提醒': { zh: '健康提醒', en: 'Health' },
    },
    shareBtn: { zh: '📤 生成分享海报', en: '📤 Generate Share Poster' },
    loading: { zh: '命盘解读中...', en: 'Analyzing your destiny...' },
    loadingSub: { zh: 'AI正在分析您的命盘，请稍候', en: 'The Oracle is reading your chart' },
    loadingDetail: { zh: '正在生成六大维度报告...', en: 'Generating six-dimensional report...' },
    noResult: { zh: '☯ 暂无解读', en: '☯ No reading available' },
  },

  // ── NameInputCard ──
  nameInput: {
    title: { zh: '姓名解析', en: 'Name Analysis' },
    subtitle: { zh: '输入姓名，获取姓名评分与五行分析', en: 'Get name score and Five Elements analysis' },
    placeholder: { zh: '请输入姓名（如：张伟）', en: 'Enter name (e.g. Zhang Wei)' },
    nameLabel: { zh: '姓名', en: 'Name' },
    genderLabel: { zh: '性别', en: 'Gender' },
    submit: { zh: '开始解析 →', en: 'Analyze →' },
    hint: { zh: '单名或双名皆可', en: 'Single or double character names' },
  },

  // ── NameResult ──
  nameResult: {
    title: { zh: '「%s」姓名解析', en: '「%s」Name Analysis' },
    genderLabel: { zh: '%s性 · 五格剖象法', en: '%s · Five Grid Method' },
    gridLabels: {
      天格: { zh: '天格', en: 'Heaven' },
      地格: { zh: '地格', en: 'Earth' },
      人格: { zh: '人格', en: 'Life' },
      总格: { zh: '总格', en: 'Total' },
      外格: { zh: '外格', en: 'Outside' },
    },
    wuxingIndex: { zh: '五行指数', en: 'Five Elements Index' },
    wuxingBalance: { zh: '五行均衡', en: 'Element Balance' },
    aiLabel: { zh: 'AI 姓名解读', en: 'AI Name Analysis' },
    strokes: { zh: '划', en: '' },
  },

  // ── FengShui ──
  fengshui: {
    title: { zh: '风水堪舆', en: 'Feng Shui' },
    subtitle: { zh: '输入户型信息，AI分析财运健康桃花位', en: 'Enter your floor plan for wealth, health & love analysis' },
    roomLabel: { zh: '分析房间', en: 'Room to Analyze' },
    facingLabel: { zh: '朝向/坐向', en: 'Facing/Direction' },
    descLabel: { zh: '补充说明', en: 'Additional Notes' },
    submit: { zh: '开始分析', en: 'Analyze' },
    placeholder: { zh: '如：门对窗、镜对床、梁压顶、采光不足、邻居情况等...', en: 'e.g. door facing window, mirror opposite bed, beam overhead, poor lighting...' },
    facingPlaceholder: { zh: '选择朝向（选填）', en: 'Select facing (optional)' },
    loading: { zh: '风水分析中...', en: 'Analyzing feng shui...' },
    loadingSub: { zh: 'AI正在罗盘定位，请稍候', en: 'The compass is spinning...' },
    noResult: { zh: '☯ 暂无解读', en: '☯ No reading available' },
    error: { zh: '☯ 服务器繁忙，请稍后再试', en: '☯ Server busy, please try again' },
    retry: { zh: '🏠 再分析一个', en: '🏠 Analyze another' },
    rooms: {
      living: { label: { zh: '客厅', en: 'Living Room' }, desc: { zh: '影响全家财运与事业', en: 'Affects family wealth & career' } },
      bedroom: { label: { zh: '卧室', en: 'Bedroom' }, desc: { zh: '影响健康与感情运势', en: 'Affects health & relationships' } },
      kitchen: { label: { zh: '厨房', en: 'Kitchen' }, desc: { zh: '影响家宅健康与财运', en: 'Affects home health & wealth' } },
      office: { label: { zh: '办公室', en: 'Office' }, desc: { zh: '影响事业与贵人运', en: 'Affects career &贵人 luck' } },
      entrance: { label: { zh: '大门/玄关', en: 'Entrance/Hallway' }, desc: { zh: '影响整体气场与运势', en: 'Affects overall energy flow' } },
      bathroom: { label: { zh: '卫生间', en: 'Bathroom' }, desc: { zh: '需注意化解污煞', en: 'Needs cleansing for negative energy' } },
    },
    facings: {
      '正东': { zh: '正东', en: 'East' },
      '正南': { zh: '正南', en: 'South' },
      '正西': { zh: '正西', en: 'West' },
      '正北': { zh: '正北', en: 'North' },
      '东南': { zh: '东南', en: 'Southeast' },
      '西南': { zh: '西南', en: 'Southwest' },
      '东北': { zh: '东北', en: 'Northeast' },
      '西北': { zh: '西北', en: 'Northwest' },
      '坐北朝南': { zh: '坐北朝南', en: 'Facing South' },
      '坐南朝北': { zh: '坐南朝北', en: 'Facing North' },
      '坐东朝西': { zh: '坐东朝西', en: 'Facing West' },
      '坐西朝东': { zh: '坐西朝东', en: 'Facing East' },
    },
  },

  // ── Guanyin ──
  guanyin: {
    title: { zh: '观音灵签', en: 'Guanyin Divination' },
    subtitle: { zh: '诚心摇一签，菩萨为您指点迷津', en: 'Shake devotionally for Guanyin\'s guidance' },
    shakeTip: { zh: '点击签筒 · 心念所求 · 诚心摇动', en: 'Click the fortune stick · Focus your mind · Shake devotionally' },
    shakeCount: { zh: '已摇 %d 次', en: 'Shaken %d times' },
    noticeTitle: { zh: '摇签须知', en: 'How to Draw' },
    notices: {
      0: { zh: '心中默念所求之事，诚心摇动签筒', en: 'Mentally focus on your question, shake the tube devotionally' },
      1: { zh: '摇至签筒发出声响，落出一签为止', en: 'Shake until a stick falls out with a sound' },
      2: { zh: '抽得签文后，点击"请观音菩萨指点"获取详解', en: 'After drawing, tap "Ask Guanyin for Guidance" for full analysis' },
    },
    submit: { zh: '诚心摇签', en: 'Shake Devotionally' },
    shaking: { zh: '摇动中...', en: 'Shaking...' },
    drawnLabel: { zh: '签筒已收 · 抽中第 %d 签', en: 'Received · Drawn No. %d' },
    poemLabel: { zh: '观音灵签 · 诗曰', en: 'Guanyin Divination · Poem' },
    askBtn: { zh: '🙏 请观音菩萨指点', en: '🙏 Ask Guanyin for Guidance' },
    drawAnother: { zh: '🔮 再抽一签', en: '🔮 Draw Another' },
    explanationPlaceholder: { zh: '点击上方按钮，获取详细解签', en: 'Tap the button above for detailed reading' },
    stemLabels: {
      '上上': { zh: '上上', en: 'Superior' },
      '上吉': { zh: '上吉', en: 'Upper Auspicious' },
      '中吉': { zh: '中吉', en: 'Moderately Auspicious' },
      '吉': { zh: '吉', en: 'Auspicious' },
      '中平': { zh: '中平', en: 'Moderate' },
      '下吉': { zh: '下吉', en: 'Lower Auspicious' },
      '下下': { zh: '下下', en: 'Inauspicious' },
    },
    // 60 poems - English translations
    poems: [
      // 1-10 (上上)
      [
        { zh: '云开日出正当晴，枯木逢春再发荣。万物枯残偏遇雨，片云散开见天明。求得此签真万金，暗中分明吉来临。', en: 'Clouds part as the sun rises clear, withered trees regain their spring. All things revived by rain, yet sunshine breaks through once again. This divination is truly priceless, good fortune arrives unseen.' },
        { zh: '上圣垂慈降吉祥，诚心一念感穹苍。祸去福来从天降，修身行善福寿长。', en: 'The divine shows compassion, sending blessings down. One sincere thought reaches the heavens above. Misfortune departs as fortune descends, cultivating virtue brings longevity.' },
      ],
      // 11-25 (上吉)
      [
        { zh: '一箭射红心，神明鉴尔真。求名求利事，俱得遂其心。', en: 'An arrow strikes the bull\'s-eye, the gods witness your truth. All pursuits of fame and fortune shall be granted your heart\'s desire.' },
        { zh: '龙虎榜中列姓名，红袍脱去换紫袍。曾经折桂登云路，衣锦归来耀祖宗。', en: 'Your name rises on the dragon and tiger list, red robes exchanged for purple. Having seized the osmanthus branch, you walk the clouds in glory, returning home to honor your ancestors.' },
      ],
      // 26-40 (中吉)
      [
        { zh: '春雷震震起苍龙，大地回春万物生。日暖风和催百草，人安物阜乐升平。', en: 'Spring thunder rouses the azure dragon, the earth awakens with ten thousand things. Warm sun and gentle wind quicken all herbs, people thrive in peaceful harmony.' },
        { zh: '三合百福自然来，财官双美尽堪夸。绿杨深处黄鹂啭，最好风光在杏花。', en: 'Triple harmony brings a hundred blessings naturally, both wealth and honor are yours to celebrate. In green willow depths the oriole sings, the finest scenery lies among the apricot blooms.' },
      ],
      // 41-52 (吉)
      [
        { zh: '枯木逢春再发枝，片云散开见天时。祸去福来终有日，且将心放宽莫疑。', en: 'Withered trees bud anew with spring, scattered clouds reveal the season. Misfortune fades as fortune comes — that day will surely arrive. Ease your heart and doubt not.' },
        { zh: '十年灯火后方开，此日青霄足可阶。大器晚成原有限，更期明岁步金阶。', en: 'After ten years of lamp-lit struggle it finally blossoms, today the azure sky is within reach. Great vessels take longer to complete, yet still we hope for golden steps next year.' },
      ],
      // 53-58 (中平)
      [
        { zh: '云遮月色未为晴，十五圆时再放明。眼前且待风云会，枯木逢春再发荣。', en: 'Clouds veil the moonlight but it is not yet clear; on the fifteenth it shines bright again. Wait for wind and clouds to gather now, withered trees bud once more in spring.' },
        { zh: '风前一箭坠江边，赢得当时兆眼前。不须更问前途事，且宜守旧应安然。', en: 'An arrow before the wind falls by the riverside, its omen won in this moment. No need to ask about the road ahead — maintain your course and remain safe.' },
      ],
      // 59 (下吉)
      [
        { zh: '莫恼春风志未伸，且宜守旧待明春。梅花冷落无消息，直到花开再问津。', en: 'Be not frustrated when spring ambition cannot extend; maintain the status quo and wait for next spring. The plum flower cold and forsaken bears no news — until it blooms, inquire not the crossing.' },
        { zh: '春来风浪正颠连，幸有慈悲俯听言。急去不当宽处去，且宜守旧待安然。', en: 'Spring brings tossing winds and waves; mercifully the compassionate one hears your words. Rush not to wide places, better to hold fast and remain at peace.' },
      ],
      // 60 (下下)
      [
        { zh: '枯井无泉水，暗室不相见。莫信傍人言，祸福在眼前。', en: 'A dry well yields no water, a dark room reveals nothing. Trust not those who speak beside you — fortune and misfortune lie right before your eyes.' },
        { zh: '枯木逢春不翼飞，暗云遮月影微微。枯井深深无水汲，且宜守旧莫妄为。', en: 'Withered wood cannot fly even with spring, dark clouds veil the faint moonlight. The deep dry well holds no water to draw — maintain the status quo, act not rashly.' },
      ],
    ],
  },

  // ── SelectDate ──
  selectDate: {
    title: { zh: '择日吉凶', en: 'Date Selection' },
    subtitle: { zh: '选择事项，AI为您挑选黄道吉日', en: 'Select an event type for an auspicious date' },
    eventLabel: { zh: '选择事项', en: 'Event Type' },
    dateLabel: { zh: '目标日期（选填）', en: 'Target Date (optional)' },
    zodiacLabel: { zh: '家人属相（选填）', en: 'Family Zodiac (optional)' },
    reqLabel: { zh: '特殊要求（选填）', en: 'Special Requirements (optional)' },
    submit: { zh: '开始择日', en: 'Find Auspicious Dates' },
    zodiacPlaceholder: { zh: '如：属鼠、属虎、属龙', en: 'e.g. Rat, Tiger, Dragon' },
    reqPlaceholder: { zh: '希望是周末 / 避开雨天...', en: 'Weekend preferred / Avoid rainy days...' },
    dateHint: { zh: '不填则推荐最近30天内的吉日', en: 'Leave blank to find the best date within 30 days' },
    zodiacHint: { zh: '可填多个，如：属鼠、属虎', en: 'Multiple allowed, e.g. Rat, Tiger' },
    loading: { zh: '择日分析中...', en: 'Selecting auspicious dates...' },
    loadingSub: { zh: 'AI正在翻阅黄历，请稍候', en: 'Consulting the almanac...' },
    noResult: { zh: '☯ 暂无解读', en: '☯ No reading available' },
    error: { zh: '☯ 服务器繁忙，请稍后再试', en: '☯ Server busy, please try again' },
    retry: { zh: '📅 再择一选', en: '📅 Select another date' },
    events: {
      marriage: { label: { zh: '结婚嫁娶', en: 'Marriage/Wedding' }, desc: { zh: '天喜红鸾，黄道吉日', en: 'Tian Xi Hong Luan, auspicious day' } },
      move: { label: { zh: '搬家入宅', en: 'Moving/Home Relocation' }, desc: { zh: '开日定日，紫微入宅', en: 'Kai day, Zi Wei enters home' } },
      business: { label: { zh: '开业开市', en: 'Business Opening' }, desc: { zh: '天财入库，生意兴隆', en: 'Tian Cai enters treasury, prosperity ahead' } },
      travel: { label: { zh: '出行远行', en: 'Travel' }, desc: { zh: '甲子天恩，一路平安', en: 'Jia Zi Tian En, safe journey' } },
      worship: { label: { zh: '祭祀祈福', en: 'Worship & Prayer' }, desc: { zh: '天德月德，祈福顺利', en: 'Tian De Yue De, prayers answered' } },
      other: { label: { zh: '其他事项', en: 'Other' }, desc: { zh: '综合择日，趋吉避凶', en: 'General date selection, seek fortune avoid misfortune' } },
    },
  },

  // ── DonationSidebar ──
  donation: {
    title: { zh: '打赏结缘', en: 'Support & Tip' },
    tagline: { zh: '算得准就打赏', en: 'Tip if the reading resonated' },
    subTagline: { zh: '您的支持是我更新的动力', en: 'Your support fuels our updates' },
    todayLabel: { zh: '今日已有', en: 'Readings today' },
    todayUnit: { zh: '位缘主解读命盘', en: 'generated' },
    qrTitle: { zh: '扫码打赏', en: 'Scan to tip' },
    close: { zh: '关闭', en: 'Close' },
  },

  // ── ComingSoon ──
  comingSoon: {
    features: {
      0: { zh: 'AI智能分析，精准解读', en: 'AI-powered intelligent analysis' },
      1: { zh: '一键生成完整报告', en: 'One-click full report generation' },
      2: { zh: '可生成分享海报', en: 'Shareable poster generation' },
    },
    footer: { zh: '☺️ 功能开发中，即将上线', en: '☺️ Coming soon' },
    footerSub: { zh: '关注公众号，第一时间体验', en: 'Stay tuned for early access' },
  },
};

// ── Translation helper ──
export function tv<T extends object>(obj: T, lang: Lang): string {
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'object' && obj !== null && 'zh' in obj) {
    return (obj as Record<string, string>)[lang] ?? (obj as Record<string, string>).zh ?? '';
  }
  return String(obj);
}

export function tf(template: string, _lang: Lang, ...args: (string | number)[]): string {
  let result = template;
  args.forEach(arg => {
    result = result.replace('%s', String(arg));
    result = result.replace('%d', String(arg));
  });
  return result;
}

// For plural/singular
export function tf2(template: { zh: string; en: string }, count: number): string {
  return template.zh.replace('%d', String(count));
}