import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, Smartphone, X, Check } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'banner' | 'compact' | 'header';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed PWA on home screen, do not show
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General instructions modal
      setShowIOSModal(true);
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/20 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 font-heading">
                  ثبّت تطبيق &quot;أثر&quot; على شاشة هاتفك
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  تصفح سريع بدون إنترنت، وصول فوري ومزامنة كاملة لعاداتك اليومية
                </p>
              </div>
            </div>
            <button
              onClick={handleInstallClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              {installSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  تم التثبيت بنجاح
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  تحميل التطبيق على الهاتف
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal for iOS or manual install steps */}
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-slate-100">
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 left-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading">تثبيت التطبيق على هاتفك</h3>
                  <p className="text-xs text-slate-400">اتبع الخطوات البسيطة التالية</p>
                </div>
              </div>

              {isIOS ? (
                <div className="space-y-3.5 my-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="text-xs text-slate-300">
                        اضغط على أيقونة <strong>المشاركة</strong> (
                        <Share2 className="inline w-3.5 h-3.5 mx-1 text-amber-400" />
                        ) في شريط متصفح سفاري (Safari) أسفل الشاشة.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="text-xs text-slate-300">
                        مرر للأسفل واختر <strong>&quot;إضافة إلى الصفحة الرئيسية&quot;</strong> (Add to Home Screen
                        <PlusSquare className="inline w-3.5 h-3.5 mx-1 text-amber-400" />
                        ).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="text-xs text-slate-300">
                        اضغط على <strong>إضافة (Add)</strong> في الزاوية العلوية، وستظهر أيقونة التطبيق على شاشة هاتفك كأي تطبيق رسمي!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 my-4 text-sm text-slate-300">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    على متصفح Chrome أو متصفحات الأندرويد:
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    اضغط على قائمة النقاط الثلاث <strong className="text-amber-400">⋮</strong> في زاوية المتصفح، ثم اختر <strong className="text-amber-400">&quot;تثبيت التطبيق&quot;</strong> أو <strong className="text-amber-400">&quot;الإضافة إلى الشاشة الرئيسية&quot;</strong>.
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full mt-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Header / Compact button
  return (
    <>
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 active:scale-95 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
        title="تثبيت التطبيق على الهاتف"
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-400" />
        <span>تحميل على الهاتف</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 left-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading">تثبيت التطبيق على هاتفك</h3>
                <p className="text-xs text-slate-400">تشغيل كتطبيق هاتف أصلي بدون متصفح</p>
              </div>
            </div>

            <div className="space-y-3.5 my-4 text-sm text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-xs text-slate-300">
                    افتح المتصفح (سفاري على آيفون، أو كروم على أندرويد).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-xs text-slate-300">
                    اضغط على زر المشاركة (
                    <Share2 className="inline w-3.5 h-3.5 mx-1 text-amber-400" />
                    ) أو قائمة الثلاث نقاط (⋮).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-xs text-slate-300">
                    اختر <strong>&quot;إضافة إلى الشاشة الرئيسية&quot; (Add to Home Screen)</strong> ليصبح تطبيقاً مستقلاً تماماً على هاتفك.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
};
