import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { useEntries } from '@/context/EntriesContext';
import { MOODS } from '@/lib/moods';
import affirmationEnvelope from '@/assets/affirmation-envelope.png';

const moodById = Object.values(MOODS).reduce((acc, mood) => {
  acc[mood.id] = mood;
  acc[mood.label.toLowerCase()] = mood;
  return acc;
}, {});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const entryDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const getMoodMeta = (moodValue) => {
  if (!moodValue) return null;
  return moodById[String(moodValue).toLowerCase()] || moodById[String(moodValue)] || null;
};

const startOfDay = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const isSameDay = (left, right) => formatDateKey(left) === formatDateKey(right);

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const truncateText = (value, maxLength = 120) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
};

const getHeatmapTone = (score) => {
  if (score == null) return 'border-orange-100/80 bg-white/55 text-orange-300 dark:border-[#43302a] dark:bg-[#261b18] dark:text-[#95776b]';
  if (score >= 8.5) return 'border-orange-300 bg-orange-200 text-orange-950 dark:border-[#8c5d42] dark:bg-[#5b3a2a] dark:text-[#ffe0bf]';
  if (score >= 7) return 'border-amber-200 bg-amber-100 text-orange-900 dark:border-[#806143] dark:bg-[#4f3b2a] dark:text-[#f6dbb5]';
  if (score >= 5) return 'border-pink-200 bg-rose-100 text-rose-900 dark:border-[#6d4750] dark:bg-[#493038] dark:text-[#f0d0d8]';
  if (score >= 3.5) return 'border-orange-300 bg-orange-100 text-orange-900 dark:border-[#73493c] dark:bg-[#412924] dark:text-[#f0c4b0]';
  return 'border-red-200 bg-red-100 text-red-900 dark:border-[#6c3c39] dark:bg-[#3c2222] dark:text-[#efc0bc]';
};

const getCalendarDays = (monthDate) => {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const startWeekday = monthStart.getDay();
  const days = [];

  for (let index = 0; index < startWeekday; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= monthEnd.getDate(); day += 1) {
    days.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
};

const formatRangeLabel = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  return `${shortDateFormatter.format(startDate)} - ${shortDateFormatter.format(endDate)}`;
};

const moodBands = [
  { label: 'Reset', min: 0, max: 2.5, color: 'from-[#ff8a5b] to-[#ff5d73]' },
  { label: 'Tender', min: 2.5, max: 4.5, color: 'from-[#ff9d52] to-[#ff7f50]' },
  { label: 'Steady', min: 4.5, max: 6.5, color: 'from-[#ffd24d] to-[#ffb347]' },
  { label: 'Blooming', min: 6.5, max: 8.5, color: 'from-[#ffe76a] to-[#ffb938]' },
  { label: 'Radiant', min: 8.5, max: 10.1, color: 'from-[#ffb347] to-[#ff6fb5]' },
];

const getMoodBand = (score) => {
  if (score == null) return null;
  return moodBands.find((band) => score >= band.min && score < band.max) || moodBands[moodBands.length - 1];
};

const getScoreMoodState = (score) => {
  if (score == null) return null;
  if (score >= 8.5) return { label: 'Radiant', emoji: '☀️', tone: 'high-vibe' };
  if (score >= 6.5) return { label: 'Blooming', emoji: '🌼', tone: 'uplifted' };
  if (score >= 4.5) return { label: 'Steady', emoji: '🌤️', tone: 'balanced' };
  if (score >= 2.5) return { label: 'Tender', emoji: '🌥️', tone: 'gentle' };
  return { label: 'Reset', emoji: '🌙', tone: 'restorative' };
};

const getChartBarFill = (score) => {
  if (score == null || score <= 0) return 'rgba(255, 214, 186, 0.35)';
  if (score >= 8.5) return '#ff9a4d';
  if (score >= 6.5) return '#ffb84d';
  if (score >= 4.5) return '#ff8f70';
  if (score >= 2.5) return '#ffb19a';
  return '#ffd1bf';
};

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (centerX, centerY, radius, startAngle, endAngle) => {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};

const buildAffirmationDeck = (energyState) => {
  const tone = energyState?.tone || 'aligned';
  const label = energyState?.label?.toLowerCase() || 'soft';

  if (tone === 'high-vibe') {
    return [
      { id: 'radiant-1', text: "You've done hard things, and it's just Thursday." },
      { id: 'radiant-2', text: 'Your bright energy is already opening doors you cannot see yet.' },
      { id: 'radiant-3', text: 'Keep choosing what lights you up. That is the path.' },
      { id: 'radiant-4', text: 'You are allowed to expect beautiful things from this day.' },
    ];
  }

  if (tone === 'uplifted') {
    return [
      { id: 'blooming-1', text: `Your ${label} energy is building something lovely and real.` },
      { id: 'blooming-2', text: 'Small steady steps are turning into visible momentum.' },
      { id: 'blooming-3', text: 'Trust the version of you that keeps showing up softly.' },
      { id: 'blooming-4', text: 'What feels gentle today can still lead to big change.' },
    ];
  }

  if (tone === 'balanced') {
    return [
      { id: 'steady-1', text: 'Calm counts. Centered energy is still powerful energy.' },
      { id: 'steady-2', text: 'You do not have to rush to prove you are moving forward.' },
      { id: 'steady-3', text: 'Let today be simple, grounded, and good.' },
      { id: 'steady-4', text: 'Balance is not boring. It is a beautiful kind of strength.' },
    ];
  }

  if (tone === 'gentle') {
    return [
      { id: 'tender-1', text: 'Go softly. The day can still meet you with kindness.' },
      { id: 'tender-2', text: 'You are allowed to protect your peace while you heal.' },
      { id: 'tender-3', text: 'A little care for yourself can change the tone of everything.' },
      { id: 'tender-4', text: 'You do not need loud energy to deserve a lovely day.' },
    ];
  }

  return [
    { id: 'reset-1', text: 'Begin again from where your breath feels safest.' },
    { id: 'reset-2', text: 'Rest can be the first step back to yourself.' },
    { id: 'reset-3', text: 'There is no pressure to bloom before you feel ready.' },
    { id: 'reset-4', text: 'Give today a slower rhythm and let that be enough.' },
  ];
};

const getDashboardGreeting = (name) => {
  const hour = new Date().getHours();
  const firstName = name?.trim();

  if (hour < 12) {
    return firstName ? `Good morning, ${firstName}` : 'Good morning';
  }

  if (hour < 17) {
    return firstName ? `Hi ${firstName}` : 'Hi there';
  }

  if (hour < 21) {
    return firstName ? `Good to see you back, ${firstName}` : 'Good to see you back';
  }

  return firstName ? `Good evening, ${firstName}` : 'Good evening';
};

const MoodBarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const day = payload[0].payload;

  return (
    <div className="rounded-[18px] border border-white/70 bg-white/95 px-3 py-2 text-center shadow-[0_14px_30px_rgba(255,162,102,0.2)] backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d07042]">
        {day.fullDateLabel}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#6e2f18]">
        {day.entryCount} entr{day.entryCount === 1 ? 'y' : 'ies'}
      </p>
      <p className="mt-1 text-xs text-[#a0532f]">
        {day.moodEmoji || '•'} {day.moodLabel || 'No mood'}
      </p>
      <p className="mt-1 text-xs font-medium text-[#c16034]">
        Score {day.moodScore == null ? '0.0' : day.moodScore.toFixed(1)}
      </p>
    </div>
  );
};

const affirmationStackTransforms = [
  'translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100',
  '-translate-x-2 translate-y-4 rotate-[-6deg] scale-[0.96] opacity-88',
  'translate-x-3 translate-y-8 rotate-[7deg] scale-[0.92] opacity-70',
];

const AffirmationSwipeStack = ({ deck, activeIndex, isAnimating, onAdvance }) => {
  const visibleCards = deck.length
    ? deck.map((_, index) => deck[(activeIndex + index) % deck.length])
    : [];

  if (!visibleCards.length) return null;

  return (
    <div className="mt-2 flex w-full flex-col items-start pl-2 sm:pl-3">
      <div className="relative h-[300px] w-full max-w-full sm:h-[360px] sm:w-[360px] md:h-[360px] md:w-[360px]">
        {visibleCards.slice(0, 3).reverse().map((card, reverseIndex, arr) => {
          const layerIndex = arr.length - 1 - reverseIndex;
          const isFront = layerIndex === 0;

          return (
            <button
              key={`${card.id}-${layerIndex}`}
              type="button"
              onClick={isFront ? onAdvance : undefined}
              className={`absolute left-1/2 top-0 flex h-[300px] w-[min(340px,90vw)] -translate-x-1/2 flex-col justify-between overflow-hidden rounded-[22px] border border-[#f2d1dc] bg-[linear-gradient(180deg,#fff5f8_0%,#ffe4ee_100%)] px-4 py-4 text-left shadow-[0_26px_44px_rgba(187,59,111,0.18)] transition duration-500 sm:h-[360px] sm:w-[360px] sm:px-6 sm:py-6 ${affirmationStackTransforms[layerIndex]} ${isFront && isAnimating ? 'affirmation-swipe-out' : ''} ${isFront ? 'cursor-pointer' : 'cursor-default'}`}
              style={{ zIndex: 10 - layerIndex }}
            >
              <div className="flex min-h-0 flex-1 flex-col">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b43d78]">
                  Love notes
                </p>
                <div className="flex flex-1 items-center">
                  <p className="mt-3 max-w-full whitespace-normal break-words pr-2 text-[18px] leading-[1.14] tracking-[-0.03em] text-[#ab3e73] sm:text-[26px] md:text-[31px]">
                    {card.text}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#dca8bc] pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b44b74]">
                <span>Love notes</span>
                <span>{String(activeIndex + layerIndex + 1).padStart(2, '0')}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 mt-5 flex w-full max-w-[360px] items-center justify-center gap-2">
        {deck.map((card, index) => (
          <button
            key={card.id}
            type="button"
            aria-label={`Show affirmation ${index + 1}`}
            onClick={() => {
              if (index !== activeIndex) onAdvance(index);
            }}
            className={`h-2.5 mt-5 rounded-full transition-all ${
              index === activeIndex ? 'w-8 bg-[#cb4679]' : 'w-2.5 bg-[#d8b2c0]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const RecentEntriesPanel = ({ recentEntriesByDate, navigate }) => (
  <Card className="rounded-[32px] border-orange-200/70 bg-gradient-to-br from-white via-orange-50/90 to-rose-50/85 shadow-[0_20px_55px_rgba(255,135,82,0.14)] dark:border-[#4a3128] dark:bg-[linear-gradient(145deg,rgba(43,29,24,0.96),rgba(32,22,19,0.92))] dark:shadow-[0_24px_56px_rgba(7,4,3,0.42)]">
    <CardContent className="px-6 py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500 dark:text-[#e1b18e]">Recent entries</p>
          <h3 className="mt-3 text-lg sm:text-2xl font-semibold text-orange-950 dark:text-[#f3e5d6]">Your latest reflections, in timeline form</h3>
        </div>
        <div className="rounded-[24px] bg-gradient-to-br from-orange-500 to-rose-500 p-4 text-white shadow-lg dark:from-[#b96643] dark:to-[#8d4b58]">
          <TrendingUp className="h-7 w-7" />
        </div>
      </div>

      {recentEntriesByDate.length ? (
        <div className="mt-6 space-y-6">
          {recentEntriesByDate.map((group) => (
            <div key={group.dateKey} className="grid gap-3 grid-cols-[72px_1fr] md:grid-cols-[88px_1fr] md:gap-5">
              <div className="rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,239,225,0.95))] px-4 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:bg-[linear-gradient(180deg,rgba(61,42,34,0.95),rgba(40,28,23,0.98))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <p className="text-2xl font-semibold leading-none text-[#5f240e] dark:text-[#f3dfc8]">{group.dayNumber}</p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c06a40] dark:text-[#d8a67f]">
                  {group.monthLabel}
                </p>
                <p className="mt-1 text-[11px] text-[#d18b63] dark:text-[#ab8974]">{group.yearLabel}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-base sm:text-xl font-semibold text-[#5f240e] dark:text-[#f3e2d0]">{group.weekdayLabel}</h4>
                  <p className="text-sm text-[#bf7349] dark:text-[#cb9c80]">{group.entries.length} entr{group.entries.length === 1 ? 'y' : 'ies'}</p>
                </div>

                {group.entries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => navigate(`/reflect/${entry.id}`, { state: { entry } })}
                    className="w-full rounded-[24px] border border-white/70 bg-white/88 px-3 py-3 sm:px-5 sm:py-4 text-left shadow-[0_14px_32px_rgba(192,201,214,0.22)] transition hover:-translate-y-0.5 dark:border-[#4b3329] dark:bg-[#2a1d19] dark:shadow-[0_16px_34px_rgba(8,4,3,0.32)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h5 className="truncate text-lg font-semibold text-[#5f240e] dark:text-[#f4e7d8]">{entry.title}</h5>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-[#c48761] dark:text-[#b9967d]">
                          {entry.createdDate.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {entry.moodMeta ? (
                        <div className="rounded-full bg-[#f8f1e7] px-3 py-1 text-xs font-medium text-[#7d5f4f] dark:bg-[#3a2a24] dark:text-[#ecd6c1]">
                          {entry.moodMeta.emoji} {entry.moodMeta.label}
                        </div>
                      ) : null}
                    </div>

                    {entry.preview ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#6d2e17]/80 dark:text-[#dcc8b8]/80">
                        {entry.preview}
                      </p>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[26px] bg-white/68 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:bg-[#271b17] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-base font-medium text-[#642711] dark:text-[#f0dfce]">No entries yet</p>
          <p className="mt-2 text-sm leading-7 text-[#8f4e2d] dark:text-[#c3a48d]">
            Start with one note and this section will fill with your latest journal titles.
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

const MiniCalendarPanel = ({
  monthDate,
  onMonthChange,
  draftStart,
  draftEnd,
  onSelectDate,
  onApply,
  onReset,
  onClose,
}) => {
  const days = useMemo(() => getCalendarDays(monthDate), [monthDate]);

  const isInRange = (day) => {
    if (!day || !draftStart || !draftEnd) return false;
    const current = startOfDay(day).getTime();
    return current >= startOfDay(draftStart).getTime() && current <= startOfDay(draftEnd).getTime();
  };

  const isSelected = (day) => day && ((draftStart && isSameDay(day, draftStart)) || (draftEnd && isSameDay(day, draftEnd)));

  return (
    <div className="absolute right-0 top-14 z-30 w-[min(320px,calc(100vw-2rem))] rounded-[28px] border border-orange-200 bg-white/96 p-4 shadow-2xl backdrop-blur-xl dark:border-[#4b3128] dark:bg-[#261b18]/98 dark:shadow-[0_26px_58px_rgba(6,3,2,0.5)]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(addDays(startOfMonth(monthDate), -1))}
          className="rounded-full border border-orange-100 p-2 text-orange-700 transition hover:bg-orange-50 dark:border-[#4a3127] dark:text-[#e4b58e] dark:hover:bg-[#34231c]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold text-orange-950 dark:text-[#f0e0cf]">{monthFormatter.format(monthDate)}</p>
        <button
          type="button"
          onClick={() => onMonthChange(addDays(endOfMonth(monthDate), 1))}
          className="rounded-full border border-orange-100 p-2 text-orange-700 transition hover:bg-orange-50 dark:border-[#4a3127] dark:text-[#e4b58e] dark:hover:bg-[#34231c]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-orange-500 dark:text-[#d8a57d]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day, index) =>
          day ? (
            <button
              key={formatDateKey(day)}
              type="button"
              onClick={() => onSelectDate(day)}
              className={`flex h-10 items-center justify-center rounded-2xl text-sm font-medium transition ${
                isSelected(day)
                  ? 'bg-orange-500 text-white dark:bg-[#c9764d] dark:text-[#1f130f]'
                  : isInRange(day)
                    ? 'bg-orange-100 text-orange-900 dark:bg-[#4d3125] dark:text-[#f0ddc8]'
                    : 'text-orange-800 hover:bg-orange-50 dark:text-[#d7b49d] dark:hover:bg-[#33221b]'
              }`}
            >
              {day.getDate()}
            </button>
          ) : (
            <div key={`empty-${index}`} className="h-10" />
          )
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-orange-50 p-3 text-sm text-orange-900 dark:bg-[#33231c] dark:text-[#f0dfcf]">
        <p className="font-medium">Selected range</p>
        <p className="mt-1 text-orange-700 dark:text-[#d4ae92]">
          {draftStart && draftEnd ? formatRangeLabel(draftStart, draftEnd) : 'Choose a start and end date'}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-50 dark:text-[#dcb08b] dark:hover:bg-[#34231c]"
        >
          Reset
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-50 dark:text-[#dcb08b] dark:hover:bg-[#34231c]"
          >
            Cancel
          </button>
          <Button
            variant="journal"
            className="rounded-full px-4"
            onClick={onApply}
            disabled={!draftStart || !draftEnd}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

const MoodAnalyticsGraph = ({ entryCount, chartData }) => {
  const strongestDay = chartData.reduce((max, day) => {
    if (day.moodScore == null) return max;
    return day.moodScore > max ? day.moodScore : max;
  }, 0);

  return (
    <Card className="overflow-hidden rounded-[34px] border-[#ffb28d]/80 bg-[linear-gradient(135deg,rgba(255,253,240,0.96),rgba(255,235,212,0.94)_40%,rgba(255,197,167,0.92)_72%,rgba(255,166,193,0.9))] shadow-[0_26px_80px_rgba(255,128,78,0.22)] dark:border-[#5a3b2f] dark:bg-[linear-gradient(145deg,rgba(53,37,29,0.96),rgba(46,31,26,0.94)_42%,rgba(61,40,32,0.94)_74%,rgba(69,41,49,0.9))] dark:shadow-[0_28px_72px_rgba(5,3,2,0.46)]">
      <CardContent className="px-4 py-4 sm:px-6 sm:py-6 md:px-7 md:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#ff7a45] shadow-sm dark:bg-[#3d2b25] dark:text-[#efb78f]">
              <TrendingUp className="h-4 w-4" />
              Mood analytics
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#5f240e] sm:text-3xl lg:text-4xl dark:text-[#f2e4d6]">
                Your emotional rhythm
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7b3a21]/80 sm:text-base dark:text-[#d7bba8]/85">
                A web-style daily mood graph highlighting how your journal energy moves across the selected range.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-1">
            <div className="rounded-[24px] bg-white/75 px-4 py-3 text-center shadow-sm ring-1 ring-white/60 backdrop-blur-sm dark:bg-[#3a2923] dark:ring-[#5a4033]">
              <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff7a45] dark:text-[#efb58a]">Entries</p>
              <p className="mt-2 text-3xl font-semibold text-[#5f240e] dark:text-[#f3e2cf]">{entryCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[30px] border border-white/55 bg-[#fff9f2]/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm sm:p-5 dark:border-[#5a4035] dark:bg-[#2b1e19]/76 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          {chartData.length ? (
            <>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c55d35] dark:text-[#e8b48b]">
                  Daily bars
                </p>
                <p className="text-sm text-[#8f4a2c] dark:text-[#cba98f]">
                  Strongest day {strongestDay ? strongestDay.toFixed(1) : '—'}
                </p>
              </div>

              <div className="h-[250px] sm:h-[265px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 12, right: 6, left: -18, bottom: 2 }}
                    barCategoryGap={chartData.length > 14 ? '22%' : '36%'}
                  >
                    <CartesianGrid vertical={false} stroke="#efb99c" strokeDasharray="4 4" />
                    <XAxis
                      dataKey="shortDateLabel"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      height={50}
                      tick={({ x, y, payload, index }) => {
                        const item = chartData[index];
                        return (
                          <g transform={`translate(${x},${y})`}>
                            <text x={0} y={8} textAnchor="middle" className="fill-[#73311b] text-[12px] font-semibold">
                              {payload.value}
                            </text>
                            <text x={0} y={24} textAnchor="middle" className="fill-[#c36d45] text-[11px]">
                              {item?.shortDayLabel}
                            </text>
                          </g>
                        );
                      }}
                    />
                    <YAxis
                      domain={[0, 10]}
                      ticks={[0, 2, 4, 6, 8, 10]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#d2774e', fontSize: 11 }}
                    />
                    <Tooltip cursor={{ fill: 'rgba(255, 211, 187, 0.16)' }} content={<MoodBarTooltip />} />
                    <Bar
                      dataKey="moodScore"
                      radius={[10, 10, 6, 6]}
                      maxBarSize={chartData.length > 14 ? 28 : 38}
                      minPointSize={0}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.dateKey} fill={getChartBarFill(entry.moodScore)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#f0ba97] bg-white/65 p-8 text-center dark:border-[#5e4334] dark:bg-[#281c18]">
              <p className="text-lg font-semibold text-[#6b2f18] dark:text-[#f1dfcd]">No mood bars yet</p>
              <p className="mt-2 text-sm text-[#935037] dark:text-[#c7a18a]">
                Add a few journal entries and this graph will light up with your daily rhythm.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SegmentedMoodMeter = ({ averageMood, todayEnergy }) => {
  const scoreMoodState = getScoreMoodState(averageMood);
  const energyState = todayEnergy || scoreMoodState;
  const fillPercent = averageMood == null ? 0 : Math.max(0, Math.min(100, (averageMood / 10) * 100));
  const radius = 94;
  const segmentCount = 9;
  const filledSegments = Math.round((fillPercent / 100) * segmentCount);
  const segmentColors = ['#ff8d5a', '#ff9e57', '#ffb453', '#ffc451', '#ffd357', '#ffc86c', '#ffb181', '#ff9498', '#ff77a9'];
  const meterSegments = Array.from({ length: segmentCount }, (_, index) => {
    const startAngle = -90 + (180 / segmentCount) * index + 3;
    const endAngle = -90 + (180 / segmentCount) * (index + 1) - 3;
    return {
      path: describeArc(120, 120, radius, startAngle, endAngle),
      color: segmentColors[index],
      active: index < filledSegments,
    };
  });

  return (
    <Card className="overflow-hidden rounded-[32px] border-[#ffbc97]/80 bg-[linear-gradient(160deg,#fffaf0_0%,#ffe7d5_42%,#ffd6b6_100%)] shadow-[0_20px_60px_rgba(255,138,76,0.2)] dark:border-[#5a3c2f] dark:bg-[linear-gradient(160deg,#36241d_0%,#2b1d18_42%,#422d24_100%)] dark:shadow-[0_24px_58px_rgba(6,3,2,0.45)]">
      <CardContent className="px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="rounded-[22px] bg-white/70 px-4 py-2 shadow-sm ring-1 ring-white/70 dark:bg-[#3a2822] dark:ring-[#5a4033]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#df6d3f] dark:text-[#e8b58d]">Today's energy</p>
          </div>
          <div className="rounded-[22px] bg-gradient-to-br from-[#ff8f54] to-[#ff6fa0] p-3 text-white shadow-lg dark:from-[#c96e47] dark:to-[#9a596b]">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-[#2d130d] px-4 py-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:bg-[#1d1412]">
          <div className="relative mx-auto flex max-w-[280px] flex-col items-center">
            <svg viewBox="0 0 240 150" className="h-[210px] w-full overflow-visible">
              {meterSegments.map((segment, index) => (
                <path
                  key={`meter-bg-${index}`}
                  d={segment.path}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="18"
                  fill="none"
                  strokeLinecap="round"
                />
              ))}
              {meterSegments.map((segment, index) =>
                segment.active ? (
                  <path
                    key={`meter-fill-${index}`}
                    d={segment.path}
                    stroke={segment.color}
                    strokeWidth="18"
                    fill="none"
                    strokeLinecap="round"
                  />
                ) : null
              )}
            </svg>

            <div className="-mt-[118px] flex flex-col items-center text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55 dark:text-[#d4b8a3]/55">Mood meter</p>
              <p className="mt-2 text-3xl font-semibold text-white sm:text-5xl">
                {averageMood == null ? '—' : `${Math.round(fillPercent)}%`}
              </p>
              <p className="mt-3 text-sm font-medium text-[#ffd98b] dark:text-[#f2c89d]">
                {energyState?.emoji || '•'} {energyState?.label || "Today's energy"}
              </p>
            </div>
          </div>

          <div className="-mt-2 flex items-center justify-between px-2 text-sm font-semibold text-white/58">
            <span>0</span>
            <span>100</span>
          </div>

          <div className="mt-5 rounded-[22px] bg-white/7 px-4 py-3 dark:bg-[#2c1f1b]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50 dark:text-[#ccb19f]/55">Today's energy</p>
            <p className="mt-2 text-lg font-semibold text-[#ffe39f] dark:text-[#f3d3ab]">
              {energyState?.emoji || '•'} {energyState?.label || 'Waiting'}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/68 dark:text-[#d7bca8]/78">
              {averageMood == null
                ? 'Add a mood-tagged entry and the gauge will light up with your current energy.'
                : `Your average mood score is translating to ${Math.round(fillPercent)}%, giving today's energy a ${energyState?.tone || 'steady'} feel.`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { entries, fetchEntries } = useEntries();
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeAffirmationIndex, setActiveAffirmationIndex] = useState(0);
  const [isAffirmationAnimating, setIsAffirmationAnimating] = useState(false);
  const [rangeSelection, setRangeSelection] = useState({ mode: 'preset', days: 7, startDate: null, endDate: null });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(new Date()));
  const [draftStartDate, setDraftStartDate] = useState(null);
  const [draftEndDate, setDraftEndDate] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const currentRange = useMemo(() => {
    const today = startOfDay(new Date());

    if (rangeSelection.mode === 'custom' && rangeSelection.startDate && rangeSelection.endDate) {
      return {
        startDate: startOfDay(rangeSelection.startDate),
        endDate: endOfDay(rangeSelection.endDate),
        label: formatRangeLabel(rangeSelection.startDate, rangeSelection.endDate),
        key: `${formatDateKey(rangeSelection.startDate)}-${formatDateKey(rangeSelection.endDate)}`,
      };
    }

    const days = rangeSelection.days || 7;
    const startDate = addDays(today, -(days - 1));
    return {
      startDate,
      endDate: endOfDay(today),
      label: days === 7 ? 'Last 7 days' : 'Last 30 days',
      key: `preset-${days}`,
    };
  }, [rangeSelection]);

  const dashboardData = useMemo(() => {
    const allEntries = [...entries]
      .map((entry) => ({
        ...entry,
        createdDate: new Date(entry.createdAt || entry.updatedAt),
      }))
      .filter((entry) => !Number.isNaN(entry.createdDate.getTime()))
      .sort((a, b) => b.createdDate - a.createdDate);

    const rangedEntries = allEntries.filter((entry) => {
      const current = entry.createdDate.getTime();
      return current >= currentRange.startDate.getTime() && current <= currentRange.endDate.getTime();
    });

    const rangeDays = [];
    const cursor = startOfDay(currentRange.startDate);
    const lastDay = startOfDay(currentRange.endDate);
    while (cursor.getTime() <= lastDay.getTime()) {
      rangeDays.push({
        date: new Date(cursor),
        key: formatDateKey(cursor),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    const perDay = rangeDays.map(({ date, key }) => {
      const dayEntries = rangedEntries.filter((entry) => formatDateKey(startOfDay(entry.createdDate)) === key);
      const scoredMoods = dayEntries
        .map((entry) => getMoodMeta(entry.mood))
        .filter(Boolean);

      const averageScore = scoredMoods.length
        ? scoredMoods.reduce((sum, mood) => sum + mood.score, 0) / scoredMoods.length
        : null;

      let dominantMood = null;
      if (scoredMoods.length) {
        const grouped = new Map();
        dayEntries.forEach((entry) => {
          const mood = getMoodMeta(entry.mood);
          if (!mood) return;
          const existing = grouped.get(mood.id) || { mood, count: 0, latest: 0 };
          existing.count += 1;
          existing.latest = Math.max(existing.latest, entry.createdDate.getTime());
          grouped.set(mood.id, existing);
        });
        dominantMood = [...grouped.values()].sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count;
          return b.latest - a.latest;
        })[0]?.mood || null;
      }

      return {
        key,
        date,
        entries: dayEntries,
        averageScore,
        dominantMood,
      };
    });

    const chartData = perDay.map((day) => {
      const scoreMoodState = getScoreMoodState(day.averageScore);

      return {
        dateKey: day.key,
        shortDayLabel: day.date.toLocaleDateString('en-US', { weekday: 'short' }),
        shortDateLabel: day.date.toLocaleDateString('en-US', { day: 'numeric' }),
        fullDateLabel: day.date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          weekday: 'long',
        }),
        moodScore: day.averageScore ?? 0,
        entryCount: day.entries.length,
        moodEmoji: scoreMoodState?.emoji || '',
        moodLabel: scoreMoodState?.label || 'No mood',
      };
    });

    const scoredRangeEntries = rangedEntries
      .map((entry) => ({ entry, mood: getMoodMeta(entry.mood) }))
      .filter(({ mood }) => Boolean(mood));

    const averageMood = scoredRangeEntries.length
      ? scoredRangeEntries.reduce((sum, item) => sum + item.mood.score, 0) / scoredRangeEntries.length
      : null;

    let dominantMood = null;
    if (scoredRangeEntries.length) {
      const grouped = new Map();
      scoredRangeEntries.forEach(({ entry, mood }) => {
        const existing = grouped.get(mood.id) || { mood, count: 0, latest: 0 };
        existing.count += 1;
        existing.latest = Math.max(existing.latest, entry.createdDate.getTime());
        grouped.set(mood.id, existing);
      });
      dominantMood = [...grouped.values()].sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return b.latest - a.latest;
      })[0]?.mood || null;
    }

    const recentEntries = allEntries.slice(0, 3).map((entry) => ({
      ...entry,
      preview: truncateText(stripHtml(entry.content || '')),
      moodMeta: getMoodMeta(entry.mood),
    }));
    const recentEntriesByDate = recentEntries.reduce((groups, entry) => {
      const dateKey = formatDateKey(startOfDay(entry.createdDate));
      const existing = groups.get(dateKey);

      if (existing) {
        existing.entries.push(entry);
        return groups;
      }

      groups.set(dateKey, {
        dateKey,
        dayNumber: entry.createdDate.getDate(),
        monthLabel: entry.createdDate.toLocaleDateString('en-US', { month: 'short' }),
        yearLabel: entry.createdDate.getFullYear(),
        weekdayLabel: entry.createdDate.toLocaleDateString('en-US', { weekday: 'long' }),
        entries: [entry],
      });
      return groups;
    }, new Map());

    const todayKey = formatDateKey(startOfDay(new Date()));
    const latestTodayScoredEntry = allEntries.find((entry) => (
      formatDateKey(startOfDay(entry.createdDate)) === todayKey && Boolean(getMoodMeta(entry.mood))
    ));
    const todayEnergy = latestTodayScoredEntry
      ? getMoodMeta(latestTodayScoredEntry.mood)
      : getScoreMoodState(averageMood);
    const affirmationDeck = buildAffirmationDeck(todayEnergy);

    return {
      affirmationDeck,
      totalEntries: rangedEntries.length,
      averageMood,
      chartData,
      dominantMood,
      heatmapDays: perDay,
      recentEntries,
      recentEntriesByDate: [...recentEntriesByDate.values()],
      todayEnergy,
    };
  }, [currentRange, entries]);

  useEffect(() => {
    if (!dashboardData.affirmationDeck.length) {
      setActiveAffirmationIndex(0);
    } else if (activeAffirmationIndex >= dashboardData.affirmationDeck.length) {
      setActiveAffirmationIndex(0);
    }
  }, [activeAffirmationIndex, dashboardData.affirmationDeck.length]);

  const openCalendar = () => {
    const start = rangeSelection.mode === 'custom' && rangeSelection.startDate
      ? startOfDay(rangeSelection.startDate)
      : startOfDay(currentRange.startDate);
    const end = rangeSelection.mode === 'custom' && rangeSelection.endDate
      ? startOfDay(rangeSelection.endDate)
      : startOfDay(currentRange.endDate);

    setDraftStartDate(start);
    setDraftEndDate(end);
    setCalendarMonth(startOfMonth(start));
    setIsCalendarOpen(true);
  };

  const handleSelectCalendarDate = (day) => {
    if (!draftStartDate || (draftStartDate && draftEndDate)) {
      setDraftStartDate(day);
      setDraftEndDate(null);
      return;
    }

    if (day.getTime() < draftStartDate.getTime()) {
      setDraftStartDate(day);
      setDraftEndDate(draftStartDate);
      return;
    }

    setDraftEndDate(day);
  };

  const handleApplyCustomRange = () => {
    if (!draftStartDate || !draftEndDate) return;
    setRangeSelection({
      mode: 'custom',
      days: null,
      startDate: startOfDay(draftStartDate),
      endDate: startOfDay(draftEndDate),
    });
    setIsCalendarOpen(false);
  };

  const setPresetRange = (days) => {
    setRangeSelection({ mode: 'preset', days, startDate: null, endDate: null });
    setIsCalendarOpen(false);
  };

  const resetDraftRange = () => {
    setDraftStartDate(null);
    setDraftEndDate(null);
    setCalendarMonth(startOfMonth(new Date()));
  };

  const handleAdvanceAffirmation = (nextIndex = null) => {
    if (!dashboardData.affirmationDeck.length) return;

    setIsAffirmationAnimating(true);

    window.setTimeout(() => {
      if (typeof nextIndex === 'number') {
        setActiveAffirmationIndex(nextIndex);
      } else {
        setActiveAffirmationIndex((current) => (current + 1) % dashboardData.affirmationDeck.length);
      }
      setIsAffirmationAnimating(false);
    }, 260);
  };

  const heatmapColumnsClass = dashboardData.heatmapDays.length > 14
    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'
    : 'sm:grid-cols-2 xl:grid-cols-7';
  const greetingName = user?.firstName || user?.fullName || '';
  const greeting = getDashboardGreeting(greetingName);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-[28px] border border-orange-200/70 bg-[linear-gradient(135deg,rgba(255,251,245,0.98),rgba(255,236,217,0.96)_55%,rgba(255,222,208,0.92))] px-4 py-4 sm:px-6 sm:py-5 shadow-[0_18px_45px_rgba(255,142,90,0.14)] dark:border-[#50352a] dark:bg-[linear-gradient(145deg,rgba(50,34,28,0.96),rgba(40,28,23,0.94)_55%,rgba(57,37,32,0.9))] dark:shadow-[0_22px_52px_rgba(7,4,3,0.42)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500 dark:text-[#e3b48d]">Welcome back</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#5f240e] sm:text-3xl lg:text-4xl dark:text-[#f3e5d7]">
          {greeting}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8c5235] sm:text-base dark:text-[#cfb29d]">
          Your journal space is ready. Take a look at your recent reflections and emotional rhythm.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.55fr] xl:items-start">
        <MoodAnalyticsGraph
          entryCount={dashboardData.totalEntries}
          chartData={dashboardData.chartData}
        />

        <div className="grid content-start gap-4">
          <SegmentedMoodMeter averageMood={dashboardData.averageMood} todayEnergy={dashboardData.todayEnergy} />
        </div>
      </div>

      <div className="mt-8 grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6">
          <RecentEntriesPanel recentEntriesByDate={dashboardData.recentEntriesByDate} navigate={navigate} />

          <Card className="relative overflow-visible rounded-[32px] border-orange-200/70 bg-gradient-to-br from-white via-orange-50/80 to-rose-50/90 shadow-[0_20px_60px_rgba(255,135,82,0.14)] dark:border-[#4d3429] dark:bg-[linear-gradient(145deg,rgba(42,29,24,0.96),rgba(33,23,20,0.94)_52%,rgba(47,30,28,0.92))] dark:shadow-[0_24px_56px_rgba(7,4,3,0.42)]">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl font-semibold tracking-tight text-orange-950 sm:text-2xl lg:text-3xl dark:text-[#f3e5d7]">
                    Emotional Weather
                  </CardTitle>
                  <CardDescription className="text-sm text-orange-900/70 dark:text-[#cfb29e]">
                    {currentRange.label}
                  </CardDescription>
                </div>

                <div className="relative flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPresetRange(7)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      rangeSelection.mode === 'preset' && rangeSelection.days === 7
                        ? 'bg-orange-500 text-white shadow-sm dark:bg-[#c97750] dark:text-[#1d120e]'
                        : 'bg-white/80 text-orange-700 ring-1 ring-orange-200 hover:bg-orange-50 dark:bg-[#2f211c] dark:text-[#efc19c] dark:ring-[#52372b] dark:hover:bg-[#3a2822]'
                    }`}
                  >
                    7 days
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetRange(30)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      rangeSelection.mode === 'preset' && rangeSelection.days === 30
                        ? 'bg-orange-500 text-white shadow-sm dark:bg-[#c97750] dark:text-[#1d120e]'
                        : 'bg-white/80 text-orange-700 ring-1 ring-orange-200 hover:bg-orange-50 dark:bg-[#2f211c] dark:text-[#efc19c] dark:ring-[#52372b] dark:hover:bg-[#3a2822]'
                    }`}
                  >
                    30 days
                  </button>
                  <button
                    type="button"
                    onClick={openCalendar}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                      rangeSelection.mode === 'custom'
                        ? 'bg-[#1f120f] text-white shadow-sm dark:bg-[#cba184] dark:text-[#211510]'
                        : 'bg-white/80 text-orange-700 ring-1 ring-orange-200 hover:bg-orange-50 dark:bg-[#2f211c] dark:text-[#efc19c] dark:ring-[#52372b] dark:hover:bg-[#3a2822]'
                    }`}
                  >
                    <CalendarDays className="h-4 w-4" />
                    Custom
                  </button>

                  {isCalendarOpen ? (
                    <MiniCalendarPanel
                      monthDate={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      draftStart={draftStartDate}
                      draftEnd={draftEndDate}
                      onSelectDate={handleSelectCalendarDate}
                      onApply={handleApplyCustomRange}
                      onReset={resetDraftRange}
                      onClose={() => setIsCalendarOpen(false)}
                    />
                  ) : null}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className={`grid gap-3 ${heatmapColumnsClass}`}>
                {dashboardData.heatmapDays.map((day) => (
                  <div
                    key={day.key}
                    title={`${day.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })} • ${day.entries.length} entr${day.entries.length === 1 ? 'y' : 'ies'} • Score ${
                      day.averageScore == null ? '—' : day.averageScore.toFixed(1)
                    }${getScoreMoodState(day.averageScore) ? ` • ${getScoreMoodState(day.averageScore).label}` : ''}`}
                    className={`rounded-[24px] border p-4 transition-transform hover:-translate-y-0.5 ${getHeatmapTone(day.averageScore)}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                          {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                          {day.date.toLocaleDateString('en-US', { day: 'numeric' })}
                        </p>
                      </div>
                      <span className="text-2xl">{getScoreMoodState(day.averageScore)?.emoji || '·'}</span>
                    </div>
                    <div className="mt-6">
                      <p className="text-xs font-medium opacity-80">
                        {day.entries.length} entr{day.entries.length === 1 ? 'y' : 'ies'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <div className="flex min-h-0 sm:min-h-[400px] flex-col items-start justify-center px-0 py-2">
            <img
              src={affirmationEnvelope}
              alt="Decorated affirmation envelope"
              className="sticker-float sticker-wobble h-auto w-full max-w-full drop-shadow-[0_32px_46px_rgba(163,87,45,0.3)] sm:max-w-[390px]"
            />
            <AffirmationSwipeStack
              deck={dashboardData.affirmationDeck}
              activeIndex={activeAffirmationIndex}
              isAnimating={isAffirmationAnimating}
              onAdvance={handleAdvanceAffirmation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
