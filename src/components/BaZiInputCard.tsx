import { useState } from 'react';

interface BaZiInputCardProps {
  onSubmit: (data: { date: string; time: string; gender: '男' | '女' }) => void;
}

const timeOptions = [
  { label: '子时', time: '23:00-00:59' },
  { label: '丑时', time: '01:00-02:59' },
  { label: '寅时', time: '03:00-04:59' },
  { label: '卯时', time: '05:00-06:59' },
  { label: '辰时', time: '07:00-08:59' },
  { label: '巳时', time: '09:00-10:59' },
  { label: '午时', time: '11:00-12:59' },
  { label: '未时', time: '13:00-14:59' },
  { label: '申时', time: '15:00-16:59' },
  { label: '酉时', time: '17:00-18:59' },
  { label: '戌时', time: '19:00-20:59' },
  { label: '亥时', time: '21:00-22:59' },
];

export function BaZiInputCard({ onSubmit }: BaZiInputCardProps) {
  const [date, setDate] = useState('1990-01-01');
  const [time, setTime] = useState('子时');
  const [gender, setGender] = useState<'男' | '女'>('男');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ date, time, gender });
  };

  return (
    <div className="fate-portal">
      {/* Inner glow ring */}
      <div className="portal-glow-ring" />

      {/* Header: title */}
      <div className="portal-header">
        <div className="portal-yin-yang">☯</div>
        <h1 className="portal-title">八字精批</h1>
        <p className="portal-subtitle">输入出生信息，获取命运指引</p>
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
              出生日期
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
              出生时辰
            </label>
            <div className="portal-select-wrapper">
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="portal-input portal-select"
              >
                {timeOptions.map((t) => (
                  <option key={t.label} value={t.label} className="portal-option">{t.label} ({t.time})</option>
                ))}
              </select>
              <div className="portal-select-arrow">▼</div>
            </div>
            {/* 显示时间范围 */}
            <div className="portal-time-hint">
              {timeOptions.find(t => t.label === time)?.time}
            </div>
          </div>

          {/* Gender */}
          <div className="portal-field">
            <label className="portal-label">
              <span className="portal-label-icon">⚥</span>
              性别
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
            <span className="portal-submit-text">开始排盘</span>
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
