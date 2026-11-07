import React, { useState } from 'react';
import { Habit } from '../types';
import { PHILOSOPHY_QUOTES } from '../data/seedData';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Compass,
  Zap,
  Shield,
  Loader2,
} from 'lucide-react';

interface CoachViewProps {
  habits: Habit[];
}

export const CoachView: React.FC<CoachViewProps> = ({ habits }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const quickPrompts = [
    {
      label: 'أشعر بالكسل والتسويف اليوم، كيف أبدأ؟',
      topic: 'procrastination',
    },
    {
      label: 'فاتتني عاداتي وأشعر بالذنب والانتكاس',
      topic: 'guilt',
    },
    {
      label: 'كيف أغير هويتي وشخصيتي عبر أفعالي الصغيرة؟',
      topic: 'identity',
    },
    {
      label: 'كيف أطبق قاعدة الدقيقتين على عادة معقدة؟',
      topic: 'two_minute',
    },
  ];

  const handleAsk = async (customPrompt?: string, topic?: string) => {
    const query = customPrompt || question;
    if (!query.trim()) return;

    setLoading(true);
    setAdvice(null);

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: query,
          topic,
          habitsSummary: habits.map((h) => ({
            title: h.title,
            category: h.category,
            identity: h.identityAnchor,
          })),
        }),
      });

      const data = await res.json();
      setAdvice(data.advice);
    } catch {
      // Local fallback
      setAdvice(
        '💡 ركز على الخطوة الأصغر القادمة. لا تفكر في التمرين كاملاً أو المشروع كاملاً، بل نفذ قاعدة الدقيقتين فوراً. الفعل هو ما يولد الحافز، وليس العكس.'
      );
    } finally {
      setLoading(false);
    }
  };

  const currentQuote = PHILOSOPHY_QUOTES[currentQuoteIndex];

  const handleNextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % PHILOSOPHY_QUOTES.length);
  };

  return (
    <div className="space-y-6">
      {/* Wisdom Quote Card */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <BookOpen className="w-4 h-4" />
            <span>حكمة وتأمل اليوم</span>
          </div>
          <button
            onClick={handleNextQuote}
            className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
          >
            تأمل آخر
          </button>
        </div>

        <blockquote className="text-base sm:text-lg font-bold text-white font-heading leading-snug my-2">
          &quot;{currentQuote.quote}&quot;
        </blockquote>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
          <span className="text-amber-400/90 font-medium">{currentQuote.author}</span>
          <span className="text-slate-400">{currentQuote.insight}</span>
        </div>
      </div>

      {/* Interactive AI Coach Section */}
      <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
          <Bot className="w-4 h-4" />
          <span>مرشد العادات واللامبالاة الذكي</span>
        </div>
        <h3 className="text-base font-bold text-white font-heading">
          اسأل عن أي تحدٍ تواجهه في عاداتك أو نفسيتك
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">
          إجابات مركزة، خالية من التحفيز الزائف، مبنية على قوانين السلوك والواقعية النفسية.
        </p>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(p.label);
                handleAsk(p.label, p.topic);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-300 hover:text-amber-300 transition cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="اكتب سؤالك أو التحدي الذي يعيقك اليوم..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAsk();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 outline-none focus:border-amber-500 transition"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">طلب التوجيه</span>
          </button>
        </div>

        {/* Result advice box */}
        {advice && (
          <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs text-slate-200 leading-relaxed whitespace-pre-line animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>التوجيه العملي والفلسفي:</span>
            </div>
            {advice}
          </div>
        )}
      </div>

      {/* Core Rules Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-2">
            <Zap className="w-4 h-4" />
            <span>قوانين العادات الذرية الأربعة (James Clear)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li><strong>1. اجعلها واضحة:</strong> حدد الزمان والمكان والمحفز بوضوح مسبق.</li>
            <li><strong>2. اجعلها جذابة:</strong> اربطها بمكافأة فورية أو هوية فخور بها.</li>
            <li><strong>3. اجعلها سهلة:</strong> قلل المقاومة وطبق قاعدة الدقيقتين.</li>
            <li><strong>4. اجعلها مُرضية:</strong> تتبع تقدمك ولا تكسر السلسلة مرتين.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-2">
            <Compass className="w-4 h-4" />
            <span>ركائز فن اللامبالاة الثلاث (Mark Manson)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li><strong>1. قوة الاكتراث الانتقائي:</strong> لا تهدر طاقتك على التوافه والمقارنات.</li>
            <li><strong>2. المسؤولية الجذرية:</strong> أنت مسؤول تماماً عن ردة فعلك تجاه أي حدث.</li>
            <li><strong>3. مبدأ &quot;افعل أي شيء&quot;:</strong> الفعل يولد الإلهام والحافز، تحرك أولاً.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
