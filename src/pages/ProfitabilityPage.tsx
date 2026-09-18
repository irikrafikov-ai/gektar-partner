import { useEffect, useState } from 'react'
import { ArrowLeft, Calculator, TrendingUp, Percent, Calendar, Wallet } from 'lucide-react'

interface LandConfig {
  name: string
  pricePerSotka: number
  minArea: number
  maxArea: number
  profitPercent: number
  profitYears: number
  monthlyPayment: number
  annualYield?: number
}

const landConfigs: Record<string, LandConfig> = {
  tula: {
    name: 'Щекинские берега (Тула)',
    pricePerSotka: 0,
    minArea: 1,
    maxArea: 100,
    profitPercent: 200,
    profitYears: 3,
    monthlyPayment: 245000
  },
  tver: {
    name: 'Светлая долина (Тверь)',
    pricePerSotka: 0,
    minArea: 1,
    maxArea: 100,
    profitPercent: 200,
    profitYears: 3,
    monthlyPayment: 245000
  },
  crimea: {
    name: 'У-Дачный Крым',
    pricePerSotka: 125000,
    minArea: 1,
    maxArea: 100,
    profitPercent: 35,
    profitYears: 1,
    monthlyPayment: 0,
    annualYield: 35
  }
}

export default function ProfitabilityPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [landType, setLandType] = useState<string>('tula')
  const [area, setArea] = useState<number | ''>('')
  const [initialPayment, setInitialPayment] = useState<number | ''>('')
  
  const land = landConfigs[landType]
  
  // Расчеты
  const totalInvestment = landType === 'crimea' 
    ? (area || 0) * land.pricePerSotka 
    : (initialPayment || 0)
  
  const profitAmount = totalInvestment * (land.profitPercent / 100)
  
  const totalReturn = totalInvestment + profitAmount
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass-dark py-3' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="ЗемФонд" className="h-12 w-auto" />
          </a>
          <a
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">На главную</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Calculator className="w-16 h-16 text-[#a08050] mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Расчет доходности
          </h1>
          <p className="text-xl text-white/70">
            Рассчитайте потенциальную прибыль от инвестиций в земельные участки
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Land Selector */}
          <div className="bg-[#1a1a1a] border border-[#a08050]/30 rounded-3xl p-6 mb-8">
            <label className="block text-white/70 mb-4">Выберите проект</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(landConfigs).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setLandType(key)}
                  className={`p-4 rounded-xl border transition-all ${
                    landType === key
                      ? 'bg-[#a08050] border-[#a08050] text-white'
                      : 'bg-[#2a2a2a] border-[#a08050]/30 text-white/70 hover:border-[#a08050]'
                  }`}
                >
                  <p className="font-semibold">{config.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <div className="bg-[#1a1a1a] border border-[#a08050]/30 rounded-3xl p-6 mb-8">
            {landType === 'crimea' ? (
              <div className="mb-6">
                <label className="block text-white/70 mb-2">Площадь участка (соток)</label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  min={land.minArea}
                  max={land.maxArea}
                  className="w-full bg-[#2a2a2a] border border-[#a08050]/30 rounded-xl px-4 py-3 text-white"
                />
                <p className="text-white/50 text-sm mt-2">{land.pricePerSotka.toLocaleString()} ₽ / сотка</p>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-white/70 mb-2">Первоначальный взнос (₽)</label>
                <input
                  type="number"
                  value={initialPayment}
                  onChange={(e) => setInitialPayment(e.target.value === '' ? '' : Number(e.target.value))}
                  min={0}
                  step={10000}
                  placeholder="Введите сумму"
                  className="w-full bg-[#2a2a2a] border border-[#a08050]/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30"
                />
                <p className="text-white/50 text-sm mt-2">
                  Рассрочка 0% — {land.monthlyPayment.toLocaleString()} ₽/мес
                </p>
              </div>
            )}
          </div>

          {/* Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Investment Card */}
            <div className="bg-[#1a1a1a] border border-[#a08050]/30 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-6 h-6 text-[#a08050]" />
                <h3 className="text-white font-semibold">Ваши инвестиции</h3>
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {totalInvestment.toLocaleString()} ₽
              </p>
              {landType !== 'crimea' && (
                <p className="text-white/50 text-sm">
                  Рассрочка на 36 месяцев
                </p>
              )}
            </div>

            {/* Profit Card */}
            <div className="bg-[#1a1a1a] border border-[#2d5a3d] rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-[#2d5a3d]" />
                <h3 className="text-white font-semibold">Прибыль</h3>
              </div>
              <p className="text-3xl font-bold text-[#2d5a3d] mb-2">
                +{profitAmount.toLocaleString()} ₽
              </p>
              <p className="text-white/50 text-sm">
                {land.profitPercent}% за {land.profitYears} {land.profitYears === 1 ? 'год' : 'года'}
              </p>
            </div>

            {/* Return Card */}
            <div className="bg-[#1a1a1a] border border-[#a08050]/30 rounded-3xl p-6 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Percent className="w-6 h-6 text-[#a08050]" />
                <h3 className="text-white font-semibold">Общая сумма возврата</h3>
              </div>
              <p className="text-4xl font-bold text-[#a08050] mb-2">
                {totalReturn.toLocaleString()} ₽
              </p>
              <div className="flex items-center gap-2 text-white/50">
                <Calendar className="w-4 h-4" />
                <span>Срок окупаемости: {land.profitYears} {land.profitYears === 1 ? 'год' : 'года'}</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <a
              href="https://max.ru/u/f9LHodD0cOKGmwKtxVHtowELQauNtni0QxVzToNr9E1Khu1saPkEz-4g8DU"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#a08050] hover:bg-[#8a7045] text-white py-4 px-8 rounded-full font-medium transition-all duration-300"
            >
              Получить консультацию
            </a>
            <a
              href="tel:+79951691230"
              className="flex items-center justify-center gap-3 w-full bg-[#2d5a3d] hover:bg-[#1e3d29] text-white py-4 px-8 rounded-full font-medium transition-all duration-300"
            >
              Позвонить
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] text-white py-12 px-6 border-t border-[#a08050]/20">
        <div className="max-w-7xl mx-auto text-center">
          <img src="/images/logo.png" alt="ЗемФонд" className="h-16 w-auto mx-auto mb-6" />
          <p className="text-white/50 mb-4">
            Развитие территорий
          </p>
          <a href="/" className="text-[#a08050] hover:text-[#c0a070] transition-colors">
            Вернуться на главную
          </a>
          <p className="text-white/30 mt-8 text-sm">
            © 2026 ЗемФонд. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  )
}
