"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Share2, X, MessageCircle, Send, Instagram, Search, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import { mockApi } from '../lib/mockApi';
import toast from 'react-hot-toast';

interface RegretMachineProps {
  lang: string;
  compact?: boolean;
}

export default function RegretMachine({ lang, compact = false }: RegretMachineProps) {
  const { t } = useTranslation();
  const [stockSymbol, setStockSymbol] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [regretAmount, setRegretAmount] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showShareTray, setShowShareTray] = useState(false);
  const [isRTL] = useState(lang === 'ar' || lang === 'he');

  // Autocomplete states
  const [suggestions, setSuggestions] = useState<Array<{ symbol: string, name: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedSymbol, setDebouncedSymbol] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle suggestion selection
  const handleSuggestionSelect = (symbol: string) => {
    setStockSymbol(symbol);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Fetch current price from mock data
  const fetchCurrentPrice = async (symbol: string) => {
    try {
      const quote = await mockApi.getStockQuote(symbol);
      return quote.price;
    } catch {
      return 100;
    }
  };

  // Debounce stock symbol input for search suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSymbol(stockSymbol);
    }, 300);
    return () => clearTimeout(timer);
  }, [stockSymbol]);

  // Fetch suggestions when debounced symbol changes
  useEffect(() => {
    // If compact, we might want to skip suggestions or keep them small.
    // For now we keep them but ensure the dropdown is positioned well.
    const fetchSuggestions = async () => {
      if (debouncedSymbol.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const data = await mockApi.searchTicker(debouncedSymbol);
        setSuggestions(data as any);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSymbol]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToAnalyzer = () => {
    const analyzerSection = document.getElementById('main-analyzer');
    if (analyzerSection) {
      analyzerSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Populate the analyzer input after a short delay
      setTimeout(() => {
        const tickerInput = document.getElementById('ticker-input') as HTMLInputElement;
        if (tickerInput) {
          tickerInput.value = stockSymbol;
          tickerInput.focus();
          // Trigger input event to update any reactive state
          tickerInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 800); // Wait for scroll to complete
    }
  };

  const calculateRegret = async () => {
    if (!stockSymbol || !purchasePrice || !purchaseDate) {
      toast.error(lang === 'ar' ? 'يرجى ملء جميع الحقول' :
        lang === 'es' ? 'Por favor complete todos los campos' :
          lang === 'he' ? 'אנא מלא את כל השדות' :
            lang === 'ru' ? 'Пожалуйста, заполните все поля' :
              lang === 'it' ? 'Si prega di compilare tutti i campi' :
                'Please fill in all fields');
      return;
    }

    setIsCalculating(true);
    try {
      const price = await fetchCurrentPrice(stockSymbol);
      setCurrentPrice(price);

      const purchasePriceNum = parseFloat(purchasePrice);
      const shares = 1000 / purchasePriceNum; // Assume $1000 investment
      const currentValue = shares * price;
      const regret = currentValue - 1000;

      setRegretAmount(regret);

      // Screen shake animation for large losses (only in full mode)
      if (!compact && regret < -500) {
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 500);
      }
    } catch (error) {
      toast.error(lang === 'ar' ? 'فشل في جلب سعر السهم' :
        lang === 'es' ? 'Error al obtener el precio de la acción' :
          lang === 'he' ? 'שגיאה בקבלת מחיר המניה' :
            lang === 'ru' ? 'Ошибка получения цены акции' :
              lang === 'it' ? 'Errore nel recupero del prezzo dell\'azione' :
                'Failed to fetch stock price');
    } finally {
      setIsCalculating(false);
    }
  };

  const shareOnSocial = (platform: string) => {
    if (!regretAmount || !stockSymbol) return;

    const amount = Math.abs(regretAmount).toFixed(2);
    const stock = stockSymbol.toUpperCase();

    // Get the appropriate share text based on language
    let text = '';
    switch (lang) {
      case 'ar': text = t.shareTextAr; break;
      case 'es': text = t.shareTextEs; break;
      case 'he': text = t.shareTextHe; break;
      case 'ru': text = t.shareTextRu; break;
      case 'it': text = t.shareTextIt; break;
      default: text = t.shareTextEn; break;
    }

    let url = '';
    const encodedText = encodeURIComponent(text.replace('${amount}', `$${amount}`).replace('{stock}', stock));

    switch (platform) {
      case 'x':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=https://tamtechaifinance.com`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20https://tamtechaifinance.com`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=https://tamtechaifinance.com&text=${encodedText}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing, so copy to clipboard
        navigator.clipboard.writeText(`${text.replace('${amount}', `$${amount}`).replace('{stock}', stock)} https://tamtechaifinance.com`);
        toast.success(lang === 'ar' ? 'تم نسخ النص إلى الحافظة' :
          lang === 'es' ? 'Texto copiado al portapapeles' :
            lang === 'he' ? 'הטקסט הועתק ללוח' :
              lang === 'ru' ? 'Текст скопирован в буфер обмена' :
                lang === 'it' ? 'Testo copiato negli appunti' :
                  'Text copied to clipboard');
        return;
    }

    if (url) window.open(url, '_blank');
  };

  const resetForm = () => {
    setStockSymbol('');
    setPurchasePrice('');
    setPurchaseDate('');
    setCurrentPrice(null);
    setRegretAmount(null);
    setShowShareTray(false);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // ---------------------------------------------------------------------------
  // RENDER: Compact Mode
  // ---------------------------------------------------------------------------
  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -6, scale: 1.02, boxShadow: "0 25px 60px -25px rgba(244,63,94,0.55)" }}
        className="relative overflow-hidden bg-gradient-to-br from-rose-900/40 via-slate-900 to-red-900/30 border border-rose-500/40 ring-1 ring-rose-500/20 rounded-2xl p-5 flex flex-col gap-3 shadow-2xl h-full"
      >
        <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-rose-500/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -left-10 -top-14 w-28 h-28 bg-red-500/10 blur-3xl" aria-hidden="true" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-1">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rose-200 font-bold">FOMO Calculator</p>
            <h3 className="text-xl font-black text-white mt-1">Regret Machine</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-600/40 to-red-600/20 border border-rose-400/50 flex items-center justify-center shadow-lg shadow-rose-900/30">
            <AlertTriangle className="text-rose-100" size={20} />
          </div>
        </div>

        {/* Content: Form or Result */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          {regretAmount !== null ? (
            // Result View (Compact)
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <div className="mb-2">
                <span className="text-slate-400 text-xs uppercase tracking-wider">
                  You missed out on
                </span>
                <div className={`text-3xl font-black mt-1 ${regretAmount >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
                  ${Math.abs(regretAmount).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
                {currentPrice && (
                  <p className="text-slate-400 text-[10px] mt-1">
                    Current Price: ${currentPrice.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold py-2 rounded-lg transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowShareTray(!showShareTray)}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2 px-3 rounded-lg transition flex items-center justify-center"
                >
                  <Share2 size={14} />
                </button>
              </div>

              {showShareTray && (
                <div className="flex gap-2 justify-center mt-3 bg-slate-800/50 rounded-lg p-2 animate-in slide-in-from-top-2">
                  <button onClick={() => shareOnSocial('x')} className="p-2 hover:bg-white/10 rounded-full" title="Share on X">
                    <X size={16} className="text-white" />
                  </button>
                  <button onClick={() => shareOnSocial('whatsapp')} className="p-2 hover:bg-white/10 rounded-full" title="Share on WhatsApp">
                    <MessageCircle size={16} className="text-green-400" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Form View (Compact)
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                  placeholder="Ticker (e.g. BTC)"
                  className="w-full bg-slate-900/50 border border-rose-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none uppercase"
                  aria-label="Stock Symbol"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="Price ($)"
                  className="w-full bg-slate-900/50 border border-rose-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                  aria-label="Purchase Price"
                />
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full bg-slate-900/50 border border-rose-500/30 rounded-lg px-3 py-2 text-[10px] text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
                  aria-label="Purchase Date"
                />
              </div>
              <button
                onClick={calculateRegret}
                disabled={isCalculating}
                className="w-full mt-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold py-2 rounded-lg text-sm shadow-lg shadow-rose-900/20 transition-all disabled:opacity-50"
              >
                {isCalculating ? 'Calculating...' : 'Calculate Regret'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Full Mode (Original)
  // ---------------------------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`mt-8 mb-8 max-w-4xl mx-auto px-4 ${isRTL ? 'rtl' : ''}`}
    >
      {/* Glassmorphism Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>

        <div className="relative p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h2
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
            >
              {t.regretMachineTitle}
            </motion.h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              {t.regretMachineSubtitle}
            </p>
          </div>

          {/* Input Form */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-slate-300">
                {t.enterStockSymbol}
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                  onFocus={() => stockSymbol.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="AAPL"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 pr-10"
                  aria-label="Stock Symbol"
                />
                <Search className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-[100] w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-48 overflow-y-auto"
                  style={{ top: '100%' }}
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionSelect(suggestion.symbol)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-700 focus:bg-slate-700 focus:outline-none transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-white text-sm">{suggestion.symbol}</div>
                          <div className="text-xs text-slate-400 truncate">{suggestion.name}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                {t.enterPurchasePrice}
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="150.00"
                step="0.01"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                aria-label="Purchase Price"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                {t.enterPurchaseDate}
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                aria-label="Purchase Date"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <div className="text-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={calculateRegret}
              disabled={isCalculating}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isCalculating ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {lang === 'ar' ? 'جاري الحساب...' :
                    lang === 'es' ? 'Calculando...' :
                      lang === 'he' ? 'מחשב...' :
                        lang === 'ru' ? 'Расчет...' :
                          lang === 'it' ? 'Calcolando...' :
                            'Calculating...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <DollarSign size={20} />
                  {t.calculateRegret}
                </div>
              )}
            </motion.button>
          </div>

          {/* Results Display */}
          {regretAmount !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center mb-8 relative"
            >
              {/* Close Button */}
              <button
                onClick={resetForm}
                className="absolute top-2 right-2 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-200 z-10"
                title={lang === 'ar' ? 'إغلاق' :
                  lang === 'es' ? 'Cerrar' :
                    lang === 'he' ? 'סגור' :
                      lang === 'ru' ? 'Закрыть' :
                        lang === 'it' ? 'Chiudi' :
                          'Close'}
              >
                <X size={16} />
              </button>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {regretAmount >= 0 ? (
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  ) : (
                    <TrendingUp className="w-8 h-8 text-red-400 rotate-180" />
                  )}
                  <span className="text-2xl font-bold text-slate-200">
                    {t.regretAmount}
                  </span>
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`text-4xl font-bold mb-4 ${regretAmount >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                >
                  ${Math.abs(regretAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.div>

                {currentPrice && (
                  <p className="text-slate-400 text-sm">
                    {lang === 'ar' ? `السعر الحالي: $${currentPrice.toFixed(2)}` :
                      lang === 'es' ? `Precio actual: $${currentPrice.toFixed(2)}` :
                        lang === 'he' ? `המחיר הנוכחי: $${currentPrice.toFixed(2)}` :
                          lang === 'ru' ? `Текущая цена: $${currentPrice.toFixed(2)}` :
                            lang === 'it' ? `Prezzo attuale: $${currentPrice.toFixed(2)}` :
                              `Current price: $${currentPrice.toFixed(2)}`}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToAnalyzer}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <TrendingUp size={18} />
                    {t.analyzeNow}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareTray(!showShareTray)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} />
                    {lang === 'ar' ? 'مشاركة' :
                      lang === 'es' ? 'Compartir' :
                        lang === 'he' ? 'שתף' :
                          lang === 'ru' ? 'Поделиться' :
                            lang === 'it' ? 'Condividi' :
                              'Share'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Share Tray */}
          {showShareTray && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/90 rounded-xl p-6 border border-slate-600 mb-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {lang === 'ar' ? 'مشاركة النتيجة' :
                    lang === 'es' ? 'Compartir resultado' :
                      lang === 'he' ? 'שתף תוצאה' :
                        lang === 'ru' ? 'Поделиться результатом' :
                          lang === 'it' ? 'Condividi risultato' :
                            'Share Your Result'}
                </h3>
                <button
                  onClick={() => setShowShareTray(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shareOnSocial('x')}
                  className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <X size={24} className="text-blue-400" />
                  <span className="text-sm text-slate-300">{t.shareOnX}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shareOnSocial('whatsapp')}
                  className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <MessageCircle size={24} className="text-green-400" />
                  <span className="text-sm text-slate-300">{t.shareOnWhatsApp}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shareOnSocial('telegram')}
                  className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Send size={24} className="text-blue-500" />
                  <span className="text-sm text-slate-300">{t.shareOnTelegram}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shareOnSocial('instagram')}
                  className="flex flex-col items-center gap-2 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Instagram size={24} className="text-pink-400" />
                  <span className="text-sm text-slate-300">{t.shareOnInstagram}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Custom CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </motion.div>
  );
}