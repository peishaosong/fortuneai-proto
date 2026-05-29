import { useState } from 'react';
import { type Lang, tv } from '../i18n';

interface BaZiInputCardProps {
  onSubmit: (data: { date: string; time: string; gender: '男' | '女' }) => void;
  lang?: Lang;
}

const timeOptions = [
  { label: { zh: '子时', en: 'Zi Hour' }, time: '23:00-00:59' },
  { label: { zh: '丑时', en: 'Chou Hour' }, time: '01:00-02:59' },
  { label: { zh: '寅时', en: 'Yin Hour' }, time: '03:00-04:59' },
  { label: { zh: '卯时', en: 'Mao Hour' }, time: '05:00-06:59' },
  { label: { zh: '辰时', en: 'Chen Hour' }, time: '07:00-08:59' },
  { label: { zh: '巳时', en: 'Si Hour' }, time: '09:00-10:59' },
  { label: { zh: '午时', en: 'Wu Hour' }, time: '11:00-12:59' },
  { label: { zh: '未时', en: 'Wei Hour' }, time: '13:00-14:59' },
  { label: { zh: '申时', en: 'Shen Hour' }, time: '15:00-16:59' },
  { label: { zh: '酉时', en: 'You Hour' }, time: '17:00-18:59' },
  { label: { zh: '戌时', en: 'Xu Hour' }, time: '19:00-20:59' },
  { label: { zh: '亥时', en: 'Hai Hour' }, time: '21:00-22:59' },
];

export function BaZiInputCard({ onSubmit, lang = 'zh' }: BaZiInputCardProps) {
  const [date, setDate] = useState('1990-01-01');
  const [time, setTime] = useState('子时');
  const [gender, setGender] = useState<'男' | '女'>('男');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ date, time, gender });
  };

  const currentTimeOption = timeOptions.find(t => tv(t.label, lang) === time || t.label.zh === time);

  return (
    <div className="fate-portal">
      {/* Inner glow ring */}
      <div className="portal-glow-ring" />

      {/* Header: title */}
      <div className="portal-header">
        <div className="portal-yin-yang">☯</div>
        <h1 className="portal-title">{tv({ zh: '八字精批', en: 'BaZi Analysis' }, lang)}</h1>
        <p className="portal-subtitle">{tv({ zh: '输入出生信息，获取命运指引', en: 'Enter your birth details for destiny guidance' }, lang)}</p>
      </div>

      {/* Divider */}
      <div className="portal-divider">
        <div className="portal-divider-line" />
        <div className="portal-divider-dot" />
        <div className="portal-divider-line" />
      </div>

      {/* Form row: 3 columns */}
      <form onSubmit={handleSubmit}>
        <div className="portal-form-row">
          {/* Birth Date */}
          <div className="portal-field">
            <label className="portal-label">
              <span className="portal-label-icon">📅</span>
              {tv({ zh: '出生日期', en: 'Birth Date' }, lang)}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="portal-input portal-input-date"
            />
          </div>

          {/* Birth Hour */}
          <div className="portal-field">
            <label className="portal-label">
              <span className="portal-label-icon">⏰</span>
              {tv({ zh: '出生时辰', en: 'Birth Hour' }, lang)}
            </label>
            <div className="portal-select-wrapper">
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="portal-input portal-select"
              >
                {timeOptions.map((t) => (
                  <option key={t.label.zh} value={t.label.zh} className="portal-option">
                    {tv(t.label, lang)} ({t.time})
                  </option>
                ))}
              </select>
              <div className="portal-select-arrow">▼</div>
            </div>
            {/* 显示时间范围 */}
            <div className="portal-time-hint">
              {currentTimeOption?.time}
            </div>
          </div>

          {/* Gender */}
          <div className="portal-field">
            <label className="portal-label">
              <span className="portal-label-icon">⚥</span>
              {tv({ zh: '性别', en: 'Gender' }, lang)}
            </label>
            <div className="portal-gender-toggle">
              <button
                type="button"
                onClick={() => setGender('男')}
                className={`portal-gender-btn ${gender === '男' ? 'portal-gender-btn--active-male' : ''}`}
              >
                <span className="portal-gender-char">男</span>
                <span className="portal-gender-pinyin">Yang</span>
              </button>
              <button
                type="button"
                onClick={() => setGender('女')}
                className={`portal-gender-btn ${gender === '女' ? 'portal-gender-btn--active-female' : ''}`}
              >
                <span className="portal-gender-char">女</span>
                <span className="portal-gender-pinyin">Yin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="portal-submit-wrap">
          <button
            type="submit"
            className="portal-submit-btn"
          >
            <span className="portal-submit-text">{tv({ zh: '开始排盘', en: 'Generate Chart' }, lang)}</span>
            <span className="portal-submit-arrow">☯</span>
            <div className="portal-submit-shimmer" />
          </button>
        </div>
      </form>

      {/* Decorative corner accents */}
      <div className="portal-corner portal-corner--tl" />
      <div className="portal-corner portal-corner--tr" />
      <div className="portal-corner portal-corner--bl" />
      <div className="portal-corner portal-corner--br" />
    </div>
  );
}