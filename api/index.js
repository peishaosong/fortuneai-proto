/**
 * FortuneAI API - Vercel Serverless Functions (JavaScript)
 * P0+P1 安全修复版
 * v4.0.0 - 2026-05-26
 */

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const STEM_ELEMENTS = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const BRANCH_ELEMENTS = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
const BRANCH_HIDDEN = {
  '子':['癸'],'丑':['己','癸','辛'],'寅':['甲','丙','戊'],'卯':['乙'],
  '辰':['戊','乙','癸'],'巳':['丙','庚','戊'],'午':['丁','己'],'未':['己','丁','乙'],
  '申':['庚','壬','戊'],'酉':['辛'],'戌':['戊','辛','丁'],'亥':['壬','甲']
};

// 允许的来源（生产环境应从环境变量读取）
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
const DEFAULT_ORIGIN = 'https://dearfuture.cc';

/** P0: 安全Headers设置 */
function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cache-Control', 'no-store');
}

/** P0: CORS限制 */
function setCors(res, origin) {
  const allowed = ALLOWED_ORIGINS.length > 0
    ? (ALLOWED_ORIGINS.includes(origin) ? origin : '')
    : (origin || DEFAULT_ORIGIN);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/** P0: 日期字符串校验 */
function isValidDateStr(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  // YYYY-MM-DD 格式
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  // 合理范围：1900-2100
  const y = d.getFullYear();
  if (y < 1900 || y > 2100) return false;
  return true;
}

/** P0: 出生时辰校验 */
function isValidTimeStr(timeStr) {
  const validTimes = ['子时','丑时','寅时','卯时','辰时','巳时','午时','未时','申时','酉时','戌时','亥时'];
  if (!timeStr || typeof timeStr !== 'string') return false;
  // 兼容 "亥时" 和 "21:00-22:59" 格式
  const normalized = timeStr.includes(' ') ? timeStr.split(' ')[0] + '时' : timeStr;
  return validTimes.includes(normalized) || validTimes.some(t => timeStr.includes(t.split('时')[0]));
}

/** P0: 性别枚举校验 */
function isValidGender(gender) {
  return gender === '男' || gender === '女';
}

/** P0: 消息内容校验（非空+长度限制+去恶意字符） */
function sanitizeMessage(msg) {
  if (!msg || typeof msg !== 'string') return '';
  // 限制最大长度 2000 字
  let clean = msg.trim().slice(0, 2000);
  // 过滤控制字符（\x00-\x1F 排除 \n\r\t）
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  return clean;
}

/** P0: 姓名格式校验（允许中英文+常见符号） */
function isValidName(name) {
  if (!name || typeof name !== 'string') return false;
  const clean = name.trim();
  if (clean.length < 1 || clean.length > 50) return false;
  // 只允许中文、英文字母、空格、点
  if (!/^[\u4e00-\u9fa5a-zA-Z\s.·']+$/.test(clean)) return false;
  return true;
}

// 1984-01-01 = 甲子日（第0天）
const BASE_DATE = new Date('1984-01-01');

/** 甲子表查日柱 */
function dateToDayGanZhi(dateStr) {
  const d = new Date(dateStr);
  const delta = Math.floor((d - BASE_DATE) / 86400000);
  const idx = ((delta % 60) + 60) % 60;
  return { stem: STEMS[idx % 10], branch: BRANCHES[idx % 12], idx };
}

/** 年柱干支 */
function getYearGanZhi(year) {
  const stemIdx = (year - 1984 + 120) % 10;
  const branchIdx = (year - 1984 + 120) % 12;
  return { stem: STEMS[stemIdx], branch: BRANCHES[branchIdx] };
}

/** 月柱干支 */
function getMonthGanZhi(yearStem, month) {
  const monthStemTable = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const stemIdx = (monthStemTable[yearStem] + month) % 10;
  const monthBranchTable = [1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const branchIdx = monthBranchTable[month - 1];
  return { stem: STEMS[stemIdx], branch: BRANCHES[branchIdx] };
}

/** 时柱干支 */
function getHourGanZhi(dayStemIdx, hourBranch) {
  const hourStemTable = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const stemIdx = (hourStemTable[dayStemIdx] + hourBranch) % 10;
  return { stem: STEMS[stemIdx], branch: BRANCHES[hourBranch] };
}

const TIME_MAP = {子时:0,丑时:1,寅时:2,卯时:3,辰时:4,巳时:5,午时:6,未时:7,申时:8,酉时:9,戌时:10,亥时:11};

/** 计算大运 */
function calcDayun(dayStem, dayBranch, birthYear, gender) {
  const dayStemIdx = STEMS.indexOf(dayStem);
  const dayBranchIdx = BRANCHES.indexOf(dayBranch);
  const isYang = [0, 2, 4, 6, 8].includes(dayStemIdx);
  const isMale = gender === '男';
  const forward = (isYang && isMale) || (!isYang && !isMale);
  const startAge = 2;

  const daYun = [];
  let stemIdx = dayStemIdx;
  let branchIdx = dayBranchIdx;

  for (let i = 0; i < 10; i++) {
    if (forward) {
      stemIdx = (stemIdx + 1) % 10;
      branchIdx = (branchIdx + 1) % 12;
    } else {
      stemIdx = (stemIdx - 1 + 10) % 10;
      branchIdx = (branchIdx - 1 + 12) % 12;
    }
    const age = startAge + i * 10;
    daYun.push({
      age,
      year: birthYear + age,
      stem: STEMS[stemIdx],
      branch: BRANCHES[branchIdx],
      description: ['大运初行','运势上升','高峰期','贵人大助','事业突破','大运平顺','运势回调','贵人离去','大运尾声','新旧交替'][i]
    });
  }
  return daYun;
}

/** 计算八字主函数 */
function calculateBazi(year, month, day, birthTime, gender) {
  const timeLabel = birthTime.startsWith('19') ? birthTime.split(' ')[0] + '时' : birthTime;
  const hourBranch = TIME_MAP[timeLabel] ?? 0;

  const yearGanZhi = getYearGanZhi(year);
  const yearStemIdx = STEMS.indexOf(yearGanZhi.stem);
  const monthGanZhi = getMonthGanZhi(yearStemIdx, month);

  const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const dayInfo = dateToDayGanZhi(dateStr);

  const hourGanZhi = getHourGanZhi(STEMS.indexOf(dayInfo.stem), hourBranch);

  const makePillar = (stem, branch, hiddenList = []) => ({
    stem,
    branch,
    stem_element: STEM_ELEMENTS[stem],
    branch_element: BRANCH_ELEMENTS[branch],
    hidden: hiddenList
  });

  const yearHidden = BRANCH_HIDDEN[yearGanZhi.branch] || [];
  const monthHidden = BRANCH_HIDDEN[monthGanZhi.branch] || [];
  const dayHidden = BRANCH_HIDDEN[dayInfo.branch] || [];
  const hourHidden = BRANCH_HIDDEN[hourGanZhi.branch] || [];

  const allEls = [
    STEM_ELEMENTS[yearGanZhi.stem], BRANCH_ELEMENTS[yearGanZhi.branch],
    STEM_ELEMENTS[monthGanZhi.stem], BRANCH_ELEMENTS[monthGanZhi.branch],
    STEM_ELEMENTS[dayInfo.stem], BRANCH_ELEMENTS[dayInfo.branch],
    STEM_ELEMENTS[hourGanZhi.stem], BRANCH_ELEMENTS[hourGanZhi.branch],
    ...yearHidden, ...monthHidden, ...dayHidden, ...hourHidden,
  ].map(s => STEM_ELEMENTS[s]).filter(Boolean);

  const wuXing = {木:0,火:0,土:0,金:0,水:0};
  allEls.forEach(e => { if (wuXing[e] !== undefined) wuXing[e]++; });

  const dayEl = STEM_ELEMENTS[dayInfo.stem];
  const dayStr = wuXing[dayEl] >= 5 ? '偏旺' : wuXing[dayEl] <= 2 ? '偏弱' : '中和';
  const useful = dayStr === '偏旺' ? ['金','水','土'] : dayStr === '偏弱' ? ['木','火'] : ['木','火','金','水','土'];

  const daYun = calcDayun(dayInfo.stem, dayInfo.branch, year, gender);

  return {
    birth_info: {date: `${year}-${month}-${day}`, time: birthTime, gender},
    ba_zi: {
      year: makePillar(yearGanZhi.stem, yearGanZhi.branch, yearHidden),
      month: makePillar(monthGanZhi.stem, monthGanZhi.branch, monthHidden),
      day: makePillar(dayInfo.stem, dayInfo.branch, dayHidden),
      hour: makePillar(hourGanZhi.stem, hourGanZhi.branch, hourHidden),
    },
    wu_xing: wuXing,
    day_master: {stem: dayInfo.stem, element: dayEl, strength: dayStr},
    gods: {useful, avoid: []},
    da_yun: daYun,
    palace: {life:'迁移宫', body:'夫妻宫'}
  };
}

async function callLLM(messages) {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) return '☯ AI服务暂未配置，请稍后再试。';
  try {
    const res = await fetch('https://api.minimaxi.com/anthropic/v1/messages', {
      method: 'POST',
      headers: {'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({model: 'MiniMax-M2.7', max_tokens: 3000, messages})
    });
    if (res.status !== 200) return `☯ AI服务异常（${res.status}）`;
    const data = await res.json();
    for (const item of (data.content || [])) {
      if (item.type === 'text') return item.text;
    }
    return '☯ AI服务暂无返回。';
  } catch (e) {
    return '☯ AI服务暂不可用。';
  }
}

import { analyzeName } from './names.js';

/** 通用错误响应 */
function errorRes(res, status, message) {
  return res.status(status).json({success: false, detail: message});
}

// 全局异常兜底，确保所有错误返回JSON
async function apiHandler(req, res) {
  // P0: 安全Headers
  setSecurityHeaders(res);

  // P0: CORS限制
  const origin = req.headers.origin || '';
  setCors(res, origin);

  if (req.method === 'OPTIONS') return res.status(204).send('');

  const path = req.url?.split('?')[0] || '/api';

  // ── Health ──
  if (path === '/api/test') {
    return res.json({ok: true, ts: Date.now()});
  }
  if (path === '/api' || path === '/api/health') {
    return res.json({status:'ok', llm_configured: !!process.env.MINIMAX_API_KEY, api_version:'4.0.0'});
  }

  // ── /api/bazi ──
  if (path === '/api/bazi') {
    const body = req.body || {};
    const date = body.birth_date;
    const timeStr = body.birth_time;
    const gender = body.gender;

    // 归一化日期格式：YYYY-MM-DD，月份/日期可能不补零
    const parts = (date || '').split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      return errorRes(res, 400, '出生日期格式有误，请输入YYYY-MM-DD格式');
    }
    const [y, m, d] = parts;
    const normalized = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if (!isValidDateStr(normalized)) return errorRes(res, 400, '出生日期格式有误，请输入YYYY-MM-DD格式');
    try {
      const bazi = calculateBazi(y, m, d, timeStr, gender);
      const bz = bazi.ba_zi;
      res.setHeader('X-Content-Type', 'application/json');
      return res.json({
        success: true,
        data: {
          birth_info: bazi.birth_info,
          ba_zi: {year: bz.year, month: bz.month, day: bz.day, hour: bz.hour},
          wu_xing: bazi.wu_xing,
          day_master: bazi.day_master,
          gods: bazi.gods,
          da_yun: bazi.da_yun,
          palace: bazi.palace,
        }
      });
    } catch(e) {
      console.error('[bazi] error:', e.message);
      return errorRes(res, 500, '排盘计算失败，请稍后重试');
    }
  }

  // ── /api/chat ──
  if (path === '/api/chat') {
    const body = req.body || {};
    const message = sanitizeMessage(body.message);
    const bi = body.birth_info;
    const baziData = body.bazi_data;
    const lang = body.lang === 'en' ? 'en' : 'zh';

    // P0: 消息校验
    if (!message) return errorRes(res, 400, lang === 'en' ? 'Please enter your question' : '请输入您的问题');

    let userContent = message;
    if (baziData && bi) {
      const bz = baziData.ba_zi || {};
      const wx = baziData.wu_xing || {};
      const dm = baziData.day_master || {};
      const gods = baziData.gods || {};
      const dy = baziData.da_yun || [];

      const baziDesc = lang === 'en'
        ? `【Fate Chart】Birth: ${bi.date || ''} ${bi.time || ''} ${bi.gender || ''}命\n\nFour Pillars:\nYear: ${bz.year?.stem || ''}${bz.year?.branch || ''} | Hidden: ${(bz.year?.hidden || []).join('')}\nMonth: ${bz.month?.stem || ''}${bz.month?.branch || ''} | Hidden: ${(bz.month?.hidden || []).join('')}\nDay: ${bz.day?.stem || ''}${bz.day?.branch || ''} | Hidden: ${(bz.day?.hidden || []).join('')}\nHour: ${bz.hour?.stem || ''}${bz.hour?.branch || ''} | Hidden: ${(bz.hour?.hidden || []).join('')}\n\nFive Elements: Wood${wx.木||0} Fire${wx.火||0} Earth${wx.土||0} Metal${wx.金||0} Water${wx.水||0}\nDay Master: ${dm.stem || ''} (${dm.element || ''} energy, ${dm.strength || ''})\nUseful God: ${(gods.useful || []).join(', ')} | Avoid God: ${(gods.avoid || []).join(', ')}\n\nMajor Luck Cycles (first 5): ${dy.slice(0,5).map(d => `${d.age}yo ${d.stem}${d.branch} (${d.year})`).join(' | ') || 'N/A'}`
        : `【命盘数据】出生：${bi.date || ''} ${bi.time || ''} ${bi.gender || ''}命\n\n四柱排盘：\n年柱：${bz.year?.stem || ''}${bz.year?.branch || ''} | 藏干：${(bz.year?.hidden || []).join('')}\n月柱：${bz.month?.stem || ''}${bz.month?.branch || ''} | 藏干：${(bz.month?.hidden || []).join('')}\n日柱：${bz.day?.stem || ''}${bz.day?.branch || ''} | 藏干：${(bz.day?.hidden || []).join('')}\n时柱：${bz.hour?.stem || ''}${bz.hour?.branch || ''} | 藏干：${(bz.hour?.hidden || []).join('')}\n\n五行分数：木${wx.木||0} 火${wx.火||0} 土${wx.土||0} 金${wx.金||0} 水${wx.水||0}\n日主：${dm.stem || ''}（${dm.element || ''}气，${dm.strength || ''}）\n用神：${(gods.useful || []).join('、')} | 忌神：${(gods.avoid || []).join('、')}\n\n大运（前5步）：${dy.slice(0,5).map(d => `${d.age}岁${d.stem}${d.branch}(${d.year}年)`).join(' | ') || '暂无'}`;

      userContent = lang === 'en'
        ? baziDesc + '\n\nBased on the above fate chart data, answer the user\'s question: "' + message + '". Give direct analysis, do not ask for more info.'
        : baziDesc + '\n\n请根据以上命盘数据，回答用户问题："' + message + '"。直接给出分析，不要问用户补充信息。';
    }

    try {
      const SYSTEM_PROMPTS = {
        zh: '你是一位精通八字命理的AI命理师。用户会提供命盘数据，你需要根据数据直接给出专业分析，不要要求用户提供更多信息。如果数据中有"暂无"或明显占位符，可以指出但仍要尽力分析。语气专业但亲切，善用emoji。',
        en: 'You are an AI Feng Shui and BaZi master. Users provide fate chart data — analyze directly without asking for more info. If data shows "暂无" or placeholder, note it but still do your best analysis. Professional yet warm tone, use emoji.',
      };
      const reply = await callLLM([
        {role:'system', content: SYSTEM_PROMPTS[lang]},
        {role:'user', content: userContent}
      ]);
      res.setHeader('X-AI-Ready', 'true');
      return res.json({success:true, reply, intent: 'bazi'});
    } catch(e) {
      console.error('[chat] error:', e.message);
      return errorRes(res, 500, 'AI服务暂不可用，请稍后再试');
    }
  }

  // ── /api/names ──
  if (path === '/api/names') {
    const body = req.body || {};
    const name = (body.name || '').trim();
    const gender = body.gender;

    // P0: 姓名校验
    if (!isValidName(name)) return errorRes(res, 400, '姓名格式有误，请输入2-50个字符的中文或英文字符');
    if (!isValidGender(gender)) return errorRes(res, 400, '性别只支持"男"或"女"');

    try {
      const result = analyzeName(name, gender);
      return res.json({success: true, data: result});
    } catch(e) {
      console.error('[names] error:', e.message);
      return errorRes(res, 500, '姓名解析失败，请稍后重试');
    }
  }

  // ── /api/calendar ──
  if (path === '/api/calendar') {
    const body = req.body || {};
    const eventType = body.event_type || '';
    const targetDate = body.target_date || '';
    const zodiac = body.zodiac || '';
    const requirements = body.requirements || '';

    // P0: 事件类型校验
    const validEvents = ['marriage','move','business','travel','worship','other'];
    if (!validEvents.includes(eventType)) return errorRes(res, 400, '事项类型有误');
    if (targetDate) {
      if (!isValidDateStr(targetDate)) return errorRes(res, 400, '目标日期格式有误');
      // 禁止选择今天之前的日期
      const today = new Date(); today.setHours(0,0,0,0);
      const selected = new Date(targetDate + 'T00:00:00');
      if (selected < today) return errorRes(res, 400, '目标日期不能早于今天');
    }

    const eventLabels = {
      marriage:'结婚嫁娶',move:'搬家入宅',business:'开业开市',
      travel:'出行远行',worship:'祭祀祈福',other:'其他事项',
    };
    const eventDesc = eventLabels[eventType];
    const dateInfo = targetDate ? `目标日期：${targetDate}` : '请帮我推荐最近适合的吉日';
    const zodiacInfo = zodiac ? `\n家人属相：${sanitizeMessage(zodiac)}` : '';
    const reqInfo = requirements ? `\n用户要求：${sanitizeMessage(requirements)}` : '';

    const prompt = `你是一位资深择日师，精通黄历、彭祖百忌、协纪辨方书。

请为以下事项提供择日建议：
- 事项类型：${eventDesc}
- ${dateInfo}${zodiacInfo}${reqInfo}

请直接给出分析，不要问用户补充信息。格式：
【吉日推荐】给出2-3个推荐日期及理由
【宜】当日适合做的事
【忌】当日需要避免的事
【时辰建议】最佳时辰与需要避开的时辰
【小贴士】注意事项

语气专业但亲切，善用emoji，控制在400字以内。`;

    try {
      const reply = await callLLM([
        {role:'system', content:'你是一位资深择日师，精通黄历、彭祖百忌、协纪辨方书。请根据传统择日理论给出专业分析，语气亲切，善用emoji。'},
        {role:'user', content: prompt}
      ]);
      return res.json({success:true, reply, event_type: eventType, target_date: targetDate});
    } catch(e) {
      console.error('[calendar] error:', e.message);
      return errorRes(res, 500, '择日服务暂不可用，请稍后再试');
    }
  }

  // ── /api/agent ── 多意图统一入口
  if (path === '/api/agent') {
    const body = req.body || {};
    const message = (body.message || '').trim();
    if (!message) return errorRes(res, 400, lang === 'en' ? 'Please enter your question' : '请输入您的问题');
    try {
      const lowerMsg = message.toLowerCase();
      let intent = 'chat';
      if (/姓名|名字|五格/i.test(lowerMsg)) intent = 'names';
      else if (/八字|排盘|命盘|日主|五行|用神|大运/i.test(lowerMsg)) intent = 'bazi';
      else if (/风水|客厅|卧室|朝向|门|床/i.test(lowerMsg)) intent = 'fengshui';
      else if (/择日|吉日|结婚|搬家|开业/i.test(lowerMsg)) intent = 'calendar';
      else if (/签|观音/i.test(lowerMsg)) intent = 'guanyin';
      
      let reply = '';
      switch(intent) {
        case 'bazi': reply = '请先使用八字排盘功能生成命盘，再进行命盘分析。'; break;
        case 'names': 
          const nm = message.match(/[一-龥]+/);
          if (nm) {
            const nd = analyzeName(nm[0], '男');
            const g = nd.grid || {};
            reply = `${nm[0]}的五格：天${g.tian||0}地${g.di||0}人${g.ren||0}外${g.wai||0}总${g.zong||0}。三才：${nd.talent||'未知'}。`;
          } else reply = '请提供要分析的姓名。';
          break;
        case 'fengshui': reply = '请在风水页面选择房间类型和朝向。'; break;
        case 'calendar': reply = '请在择日页面选择事项类型。'; break;
        case 'guanyin': reply = '请在观音灵签页面抽签。'; break;
        default: reply = '您好！我是FortuneAI命理助手，请问有什么可以帮您？';
      }
      return res.json({success:true, intent, agent:intent+'Agent', reply});
    } catch(e) { console.error('[agent]', e.message); return errorRes(res,500,'服务暂不可用'); }
  }


  return res.json({success: false, detail: 'Not found'});
}

export default async function handler(req, res) {
  try {
    await apiHandler(req, res);
  } catch(e) {
    console.error('[API] unhandled error:', e.message, e.stack);
    res.status(500).json({success: false, detail: '服务器内部错误，请稍后重试'});
  }
}