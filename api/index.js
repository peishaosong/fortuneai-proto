/**
 * FortuneAI API - Vercel Serverless Functions (JavaScript)
 */

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const STEM_ELEMENTS = {甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水'};
const BRANCH_ELEMENTS = {子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水'};
const BRANCH_HIDDEN = {
  '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'],
  '卯': ['乙'], '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'], '未': ['己', '丁', '乙'], '申': ['庚', '壬', '戊'],
  '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
};

function calculateBazi(year, month, day, hour) {
  const yearStem = (year - 1984 + 120) % 10;
  const yearBranch = (year - 1984 + 120) % 12;
  const monthStem = (yearStem * 2 + month + 10) % 10;
  const monthBranch = (month + 2) % 12;
  const dayStem = (year * 10 + month * 30 + day + 70) % 10;
  const dayBranch = (year * 12 + month * 30 + day + 72) % 12;
  const hourStem = (dayStem * 2 + Math.floor(hour / 2) + 36) % 10;
  const hourBranch = (Math.floor(hour / 2) + 2) % 12;

  const allHiddenBranches = [yearBranch, monthBranch, dayBranch, hourBranch].map(b => BRANCH_HIDDEN[BRANCHES[b % 12]] || []);
  const hiddenStems = allHiddenBranches.flat();
  const allEls = [
    STEM_ELEMENTS[STEMS[yearStem]], STEM_ELEMENTS[STEMS[monthStem]],
    STEM_ELEMENTS[STEMS[dayStem]], STEM_ELEMENTS[STEMS[hourStem]],
    BRANCH_ELEMENTS[BRANCHES[yearBranch % 12]], BRANCH_ELEMENTS[BRANCHES[monthBranch % 12]],
    BRANCH_ELEMENTS[BRANCHES[dayBranch % 12]], BRANCH_ELEMENTS[BRANCHES[hourBranch % 12]],
    ...hiddenStems.map(s => STEM_ELEMENTS[s])
  ];

  const wuXing = {木: 0, 火: 0, 土: 0, 金: 0, 水: 0};
  allEls.forEach(e => wuXing[e]++);

  const dayEl = STEM_ELEMENTS[STEMS[dayStem]];
  const dayStr = wuXing[dayEl] >= 5 ? '偏旺' : wuXing[dayEl] <= 2 ? '偏弱' : '中和';
  const useful = dayStr === '偏旺' ? ['金', '水', '土'] : dayStr === '偏弱' ? ['木', '火'] : ['木', '火', '金', '水', '土'];

  const daYun = [];
  for (let i = 0; i < 10; i++) {
    const startAge = 8 + i * 10;
    daYun.push({
      age: startAge,
      year: year + startAge,
      stem: STEMS[(dayStem + i * 2) % 10],
      branch: BRANCHES[(dayBranch + i * 2) % 12],
      description: ['大运初行', '运势上升', '高峰期', '贵人大助', '事业突破', '大运平顺', '运势回调', '贵人离去', '大运尾声', '新旧交替'][i]
    });
  }

  return {
    year_idx: [yearStem, yearBranch],
    month_idx: [monthStem, monthBranch],
    day_idx: [dayStem, dayBranch],
    hour_idx: [hourStem, hourBranch],
    year_hidden: hiddenStems.slice(0, 3).map(s => STEMS.indexOf(s)),
    month_hidden: (BRANCH_HIDDEN[BRANCHES[monthBranch % 12]] || []).map(s => STEMS.indexOf(s)),
    day_hidden: (BRANCH_HIDDEN[BRANCHES[dayBranch % 12]] || []).map(s => STEMS.indexOf(s)),
    hour_hidden: (BRANCH_HIDDEN[BRANCHES[hourBranch % 12]] || []).map(s => STEMS.indexOf(s)),
    wu_xing: wuXing,
    day_strength: dayStr,
    useful_gods: useful,
    avoid_gods: [],
    da_yun: daYun,
    palace: {life: '迁移宫', body: '夫妻宫'}
  };
}

function makePillar(stemIdx, branchIdx, hiddenList = []) {
  const stem = STEMS[stemIdx % 10];
  const branch = BRANCHES[branchIdx % 12];
  return {
    stem,
    branch,
    stem_element: STEM_ELEMENTS[stem],
    branch_element: BRANCH_ELEMENTS[branch],
    hidden: hiddenList.map(i => STEMS[Math.abs(i) % 10])
  };
}

async function callLLM(messages) {
  const apiKey = process.env.MINIMAX_API_KEY;
  console.log('[LLM] API key present:', !!apiKey, 'key length:', apiKey ? apiKey.length : 0);
  if (!apiKey) return '☯ AI服务暂未配置，请稍后再试。';
  try {
    const res = await fetch('https://api.minimaxi.com/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        max_tokens: 3000,
        messages
      })
    });
    console.log('[LLM] Response status:', res.status);
    if (res.status !== 200) {
      const text = await res.text();
      console.log('[LLM] Error response:', text.substring(0, 200));
      return `☯ AI服务异常（${res.status}）`;
    }
    const data = await res.json();
    for (const item of (data.content || [])) {
      if (item.type === 'text') return item.text;
    }
    return '☯ AI服务暂无返回。';
  } catch (e) {
    console.log('[LLM] Exception:', e.message);
    return '☯ AI服务暂不可用。';
  }
}

import { analyzeName } from './names.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).send('');

  const path = req.url?.split('?')[0] || '/api';

  if (path === '/api' || path === '/api/health') {
    return res.json({
      status: 'ok',
      llm_configured: !!process.env.MINIMAX_API_KEY,
      api_version: '2.0.1'
    });
  }

  if (path === '/api/bazi') {
    const body = req.body || {};
    const date = body.birth_date || '1990-01-01';
    const timeStr = body.birth_time || '子时 (23:00-00:59)';
    const gender = body.gender || '男';
    const timeMap = {子时: 0, 丑时: 1, 寅时: 2, 卯时: 3, 辰时: 4, 巳时: 5, 午时: 6, 未时: 7, 申时: 8, 酉时: 9, 戌时: 10, 亥时: 11};
    const hour = (timeMap[timeStr.split(' ')[0]] || 0) * 2;
    const [y, m, d] = date.split('-').map(Number);
    const bazi = calculateBazi(y, m, d, hour);

    return res.json({
      success: true,
      data: {
        birth_info: {date, time: timeStr, gender},
        ba_zi: {
          year: makePillar(...bazi.year_idx, bazi.year_hidden),
          month: makePillar(...bazi.month_idx, bazi.month_hidden),
          day: makePillar(...bazi.day_idx, bazi.day_hidden),
          hour: makePillar(...bazi.hour_idx, bazi.hour_hidden)
        },
        wu_xing: bazi.wu_xing,
        day_master: {
          stem: STEMS[bazi.day_idx[0] % 10],
          element: STEM_ELEMENTS[STEMS[bazi.day_idx[0] % 10]],
          strength: bazi.day_strength
        },
        gods: {useful: bazi.useful_gods, avoid: bazi.avoid_gods},
        da_yun: bazi.da_yun,
        palace: bazi.palace
      }
    });
  }

  if (path === '/api/chat') {
    const body = req.body || {};
    const message = body.message || '';
    const bi = body.birth_info;
    const baziData = body.bazi_data;

    console.log('[CHAT] message:', message.substring(0, 50));
    console.log('[CHAT] birth_info:', JSON.stringify(bi));
    console.log('[CHAT] bazi_data keys:', baziData ? Object.keys(baziData) : 'NONE');
    console.log('[CHAT] ba_zi present:', baziData?.ba_zi ? 'YES' : 'NO');

    let userContent = message;
    if (baziData) {
      const bz = baziData.ba_zi || {};
      const wx = baziData.wu_xing || {};
      const dm = baziData.day_master || {};
      const gods = baziData.gods || {};
      const dy = baziData.da_yun || [];

      const baziDesc = `【命盘数据】出生：${bi?.date || ''} ${bi?.time || ''} ${bi?.gender || ''}命

四柱排盘：
年柱：${bz.year?.stem || ''}${bz.year?.branch || ''} | 藏干：${(bz.year?.hidden || []).join('')}
月柱：${bz.month?.stem || ''}${bz.month?.branch || ''} | 藏干：${(bz.month?.hidden || []).join('')}
日柱：${bz.day?.stem || ''}${bz.day?.branch || ''} | 藏干：${(bz.day?.hidden || []).join('')}
时柱：${bz.hour?.stem || ''}${bz.hour?.branch || ''} | 藏干：${(bz.hour?.hidden || []).join('')}

五行分数：木${wx.木||0} 火${wx.火||0} 土${wx.土||0} 金${wx.金||0} 水${wx.水||0}
日主：${dm.stem || ''}（${dm.element || ''}气，${dm.strength || ''}）
用神：${(gods.useful || []).join('、')} | 忌神：${(gods.avoid || []).join('、')}

大运（前5步）：${dy.slice(0, 5).map(d => `${d.age}岁${d.stem}${d.branch}(${d.year}年)`).join(' | ') || '暂无'}`;

      userContent = baziDesc + '\n\n请根据以上命盘数据，回答用户问题："' + message + '"。直接给出分析，不要问用户补充信息。';
      console.log('[CHAT] baziDesc:', baziDesc.substring(0, 100));
    }

    const reply = await callLLM([
      {role: 'system', content: '你是一位精通八字命理的AI命理师。用户会提供命盘数据，你需要根据数据直接给出专业分析，不要要求用户提供更多信息。如果数据中有"暂无"或明显占位符，可以指出但仍要尽力分析。语气专业但亲切，善用emoji。'},
      {role: 'user', content: userContent}
    ]);
    console.log('[CHAT] reply:', reply ? reply.substring(0, 100) : 'NONE');
    return res.json({success: true, reply, intent: 'bazi'});
  }

  if (path === '/api/names') {
    const body = req.body || {};
    const name = (body.name || '').trim();
    const gender = body.gender || '男';
    if (!name || name.length < 2) {
      return res.json({ success: false, detail: '姓名至少需要2个字符' });
    }
    try {
      const result = analyzeName(name, gender);
      return res.json({ success: true, data: result });
    } catch(e) {
      return res.json({ success: false, detail: '姓名解析失败' });
    }
  }


  return res.json({success: false, detail: 'Not found'});
}
