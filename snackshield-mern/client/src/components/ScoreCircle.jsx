import React from 'react';

const ScoreCircle = ({ score = 0, size = 120, strokeWidth = 10, label = '' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - score / 100);

  const color =
    score > 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Foreground arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        {/* Center text — counter-rotate so it reads upright */}
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            transform: `rotate(90deg)`,
            transformOrigin: '50% 50%',
            fill: color,
            fontSize: size * 0.22,
            fontWeight: 700,
          }}
        >
          {score}
        </text>
        {label && (
          <text
            x="50%"
            y="66%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              transform: `rotate(90deg)`,
              transformOrigin: '50% 50%',
              fill: '#94a3b8',
              fontSize: size * 0.1,
              fontWeight: 500,
            }}
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
};

export default ScoreCircle;
