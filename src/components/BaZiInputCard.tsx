import { useState } from 'react';

interface BaZiInputCardProps {
  onSubmit: (data: { date: string; time: string; gender: '男' | '女' }) => void;
}

const timeOptions = [
  '子时 (23:00-00:59)', '丑时 (01:00-02:59)', '寅时 (03:00-04:59)',
  '卯时 (05:00-06:59)', '辰时 (07:00-08:59)', '巳时 (09:00-10:59)',
  '午时 (11:00-12:59)', '未时 (13:00-14:59)', '申时 (15:00-16:59)',
  '酉时 (17:00-18:59)', '戌时 (19:00-20:59)', '亥时 (21:00-22:59)',
];

export function BaZiInputCard({ onSubmit }: BaZiInputCardProps) {
  const [date, setDate] = useState('1990-01-01');
  const [time, setTime] = useState(timeOptions[0]);
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
                  <option key={t} value={t} className="portal-option">{t}</option>
                ))}
              </select>
              <div className="portal-select-arrow">▼</div>
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
