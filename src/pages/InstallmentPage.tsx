import { useState } from 'react'
import { ArrowLeft, Calendar, Wallet, Percent, Calculator } from 'lucide-react'
import { useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import { usePageMeta } from '../lib/usePageMeta'

interface LandConfig {
  name: string
  minPayment: number
  maxPayment: number
  months: number
  downPaymentPercent: number
}

const landConfigs: Record<string, LandConfig> = {
  tula: { name: 'Щекинские берега (Тула)', minPayment: 100000, maxPayment: 5000000, months: 12, downPaymentPercent: 30 },
  tver: { name: 'Светлая долина (Тверь)', minPayment: 100000, maxPayment: 5000000, months: 12, downPaymentPercent: 30 },
  crimea: { name: 'У-Дачный Крым', minPayment: 125000, maxPayment: 10000000, months: 12, downPaymentPercent: 30 },
  moscow: { name: 'Серебряные пруды (Московская область)', minPayment: 100000, maxPayment: 5000000, months: 12, downPaymentPercent: 30 },
}

export default function InstallmentPage() {
  const { land } = useParams()
  const [landType, setLandType] = useState<string>(land || 'tula')
  const [totalAmount, setTotalAmount] = useState<number | ''>('')

  const landConfig = landConfigs[landType] || landConfigs.tula
  usePageMeta(
    `Калькулятор рассрочки — ${landConfig.name} · ЗемФонд`,
    'Рассчитайте удобный график платежей под 0%: первоначальный взнос 30% и рассрочка на 12 месяцев.'
  )
  const requiredDownPayment = (totalAmount || 0) * (landConfig.downPaymentPercent / 100)
  const loanAmount = Math.max(0, (totalAmount || 0) - requiredDownPayment)
  const monthlyPayment = loanAmount > 0 ? loanAmount / landConfig.months : 0
  const totalMonths = landConfig.months

  const fmt = (n: number) => n.toLocaleString('ru-RU')

  return (
    <div className="min-h-screen bg-[#1e1c1a] text-[#f3eee6]">
      <a href="/" className="fixed top-5 left-5 z-50 glass rounded-full px-4 py-2 flex items-center gap-2 text-[#f3eee6] text-sm font-medium hover:bg-white/80 transition-colors shadow-[0_4px_16px_rgba(20,40,28,0.1)]">
        <ArrowLeft className="w-4 h-4" /> На главную
      </a>

      {/* Hero */}
      <section className="bg-[#1e1c1a] hectare-grid pt-28 pb-12 px-5 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#e4b654]/15 flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-8 h-8 text-[#f0c96a]" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Калькулятор рассрочки</h1>
          <p className="mt-4 text-[18px] text-[#8d857a]">Рассчитайте удобный график платежей под 0%</p>
          <p className="mt-2 text-[15px] font-semibold text-[#f0c96a]">Первоначальный взнос 30% + рассрочка на 12 месяцев</p>
        </div>
      </section>

      <section className="bg-[#1e1c1a] px-5 sm:px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Land selector */}
          <div className="bg-[#262320] rounded-[28px] p-6 mb-5">
            <label className="block text-[14px] font-semibold text-[#8d857a] mb-4">Выберите проект</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(landConfigs).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setLandType(key)}
                  className={`p-4 rounded-2xl text-left transition-all ${
                    landType === key ? 'bg-[#e4b654] text-[#1e1c1a] shadow-[0_8px_24px_rgba(228,182,84,0.2)]' : 'bg-[#262320] text-[#c8c0b4] hover:text-[#f3eee6]'
                  }`}
                >
                  <p className="font-semibold text-[13px] leading-snug">{config.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="bg-[#262320] rounded-[28px] p-6 mb-5">
            <label className="block text-[14px] font-semibold text-[#8d857a] mb-3">Стоимость участка, ₽</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value === '' ? '' : Number(e.target.value))}
              min={landConfig.minPayment}
              step={10000}
              placeholder="Введите сумму"
              className="w-full bg-[#262320] border border-[#332f2a] rounded-2xl px-5 py-4 text-[18px] font-semibold text-[#f3eee6] placeholder:text-[#f3eee6]/30 placeholder:font-normal outline-none focus:ring-2 focus:ring-[#e4b654]/40"
            />
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#262320] rounded-[28px] p-6">
              <Percent className="w-6 h-6 text-[#f0c96a] mb-4" />
              <p className="text-[13px] text-[#8d857a] mb-2">Первоначальный взнос · 30%</p>
              <p className="font-display text-2xl font-bold">{fmt(requiredDownPayment)} ₽</p>
            </div>
            <div className="bg-[#262320] rounded-[28px] p-6">
              <Wallet className="w-6 h-6 text-[#f0c96a] mb-4" />
              <p className="text-[13px] text-[#8d857a] mb-2">Сумма рассрочки</p>
              <p className="font-display text-2xl font-bold">{fmt(loanAmount)} ₽</p>
            </div>
            <div className="bg-[#141312] border border-[#332f2a] text-[#f3eee6] rounded-[28px] p-6">
              <Calculator className="w-6 h-6 text-[#f0c96a] mb-4" />
              <p className="text-[13px] text-white/55 mb-2">Ежемесячный платёж</p>
              <p className="font-display text-2xl font-bold text-[#f0c96a]">{fmt(Math.round(monthlyPayment))} ₽</p>
            </div>
            <div className="bg-[#262320] rounded-[28px] p-6">
              <Calendar className="w-6 h-6 text-[#f0c96a] mb-4" />
              <p className="text-[13px] text-[#8d857a] mb-2">Срок рассрочки</p>
              <p className="font-display text-2xl font-bold">{totalMonths} мес</p>
            </div>
          </div>

          {/* CTA */}
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="https://max.ru/u/f9LHodD0cOKGmwKtxVHtowELQauNtni0QxVzToNr9E1Khu1saPkEz-4g8DU" target="_blank" rel="noopener noreferrer" className="bg-[#e4b654] hover:bg-[#f0c96a] text-[#1e1c1a] py-4 rounded-full font-semibold text-center transition-colors">
              Получить консультацию
            </a>
            <a href="tel:+79951691230" className="bg-[#262320] border border-[#45403a] hover:bg-[#2e2a26] text-[#f3eee6] py-4 rounded-full font-semibold text-center transition-colors">
              Позвонить
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
