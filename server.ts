import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFallbackWisdom(topic?: string, question?: string): string {
  const q = (question || '').toLowerCase();
  if (q.includes('كسل') || q.includes('تأجيل') || q.includes('تسويف') || topic === 'procrastination') {
    return `💡 **مبدأ "افعل أي شيء" (مارك مانسون) + قاعدة الدقيقتين (جيمس كلير):**\n\n1. **لا تنتظر الشغف**: الإلهام لا يسبق الفعل؛ بل الفعل هو من يولد الإلهام والحافز.\n2. **قلّص العادة حتى تسخر منها**: إذا كنت تسوّف التمرين، ارتدِ الحذاء الرياضي فقط وقف. إذا كنت تسوّف القراءة، افتح صفحة واحدة واقرأ أول سطر.\n3. **تقبل الشعور بالمقاومة**: الشعور بعدم الرغبة أمر إنساني طبيعي، لا تجعل منه دراما داخلية؛ تحرك مع وجود المقاومة.`;
  }
  if (q.includes('ذنب') || q.includes('فوت') || q.includes('قطعت') || topic === 'guilt') {
    return `🛡️ **الهروب من "حلقة التغذية الراجعة من الجحيم" (فن اللامبالاة):**\n\n1. **توقف عن لوم نفسك لأنك أخطأت**: الشعور بالذنب فوق الانقطاع يضاعف المشكلة ويقودك للانتكاس التام.\n2. **قانون عدم الكسر مرتين**: أن تفوتك العادة يوماً واحداً حادث عارض، أما تفويتها يومين متتاليين فبداية لعادة سلبية جديدة.\n3. **استعد اليوم بهدوء**: لا تحاول تعويض الأمس بمجهود مضاعف، فقط قم بالحد الأدنى اليوم.`;
  }
  if (q.includes('هوية') || q.includes('شخصيتي') || topic === 'identity') {
    return `🎯 **العادات القائمة على الهوية (العادات الذرية):**\n\n1. **غيّر السؤال من "ماذا أريد أن أحقق؟" إلى "من أريد أن أكون؟"**: كل تمرين هو تصويت لهوية الرياضي، كل جلسة عمل عميق هي تصويت لهوية المحترف المركز.\n2. **التراكم الصغير الصامت**: تحسن بنسبة 1% يومياً يعني أنك ستكون أفضل بـ 37 ضعفاً بنهاية العام.\n3. **أسقط ما لا يخدم هويتك**: اختر بوعي التوافه التي لن تبالي بها بعد اليوم لتفسح مجالاً لطاقتك.`;
  }
  return `✨ **خلاصة الفلسفتين:**\n\n1. **بسّط إلى أقصى حد**: اجعل العادة واضحة وسهلة في بيئتك (حضّر أدواتها مسبقاً).\n2. **انتقِ معاركك**: لا يمكنك الاكتراث لكل شيء، احصر اهتمامك في 3 قيم كبرى فقط وأسقط الباقي.\n3. **صوّت لهويتك الآن**: خطوة صغيرة مدتها دقيقتان الآن تصنع فارقاً حقيقياً في رسم شخصيتك.`;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Habit & Mindset AI Coach endpoint
  app.post('/api/coach', async (req: Request, res: Response) => {
    try {
      const { userQuestion, habitsSummary, topic } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.json({
          advice: getFallbackWisdom(topic, userQuestion),
          source: 'local_philosophy',
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `سياق عادات المستخدم الحالية:
${JSON.stringify(habitsSummary || [])}

سؤال أو تحدي المستخدم:
"${userQuestion || 'كيف أحافظ على انضباطي دون أن أشعر بالاحتراق النفسي؟'}"`;

      const systemInstruction = `أنت مرشد فلسفي وعملي يجمع بين كتاب 'العادات الذرية' (جيمس كلير) وكتاب 'فن اللامبالاة' (مارك مانسون).
أسلوبك:
1. صريح، هادئ، عميق، يبتعد عن الإيجابية السامة والتحفيز السطحي.
2. يركز على عادات الهوية (Identity-based habits) وتصغير الفعل لقاعدة الدقيقتين وتسهيل البيئة.
3. يركز على تصفية ما لا يستحق الاكتراث، وتقبل الأيام السيئة بدون الوقوع في حلقة التغذية الراجعة من الجحيم.
4. باللغة العربية السلسة المباشرة، مع نقاط عملية محددة (أقل من 200 كلمة).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        advice: response.text || getFallbackWisdom(topic, userQuestion),
        source: 'gemini',
      });
    } catch (err) {
      console.warn('AI Coach fallback invoked:', err);
      return res.json({
        advice: getFallbackWisdom(req.body.topic, req.body.userQuestion),
        source: 'local_fallback',
      });
    }
  });

  // In development, hook Vite middleware; in production, serve built dist files
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
