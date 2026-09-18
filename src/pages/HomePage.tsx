import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, MotionConfig } from 'framer-motion'
import { MapPin, ArrowRight, Menu, X, ArrowUpRight, UserPlus, FileSearch, Handshake, Wallet, ShieldCheck, Scale, BadgeCheck, Quote, Percent, Timer, UserCheck, FileSignature, Rotate3d, MapPinned } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion'
import ContactForm from '../components/ContactForm'
import CountUp from '../components/CountUp'
import Footer from '../components/Footer'
import { usePageMeta } from '../lib/usePageMeta'

/* Данные проектов — синхронизированы с сайтом покупателей (gektar-land, seed.ts). */
const lands = [
  {
    id: 1,
    region: 'Тульская область',
    name: 'Щёкинские берега',
    description: 'Видовые участки 6,7–10,6 сотки на возвышенности над Щёкинским водохранилищем. Свет, вода, газ и интернет, до воды 450 метров.',
    location: '200 км от Москвы',
    type: 'ИЖС',
    price: 'от 310 000 ₽',
    count: '39 участков',
    image: '/images/tula-plan.png',
    link: '/tula',
  },
  {
    id: 2,
    region: 'Тульская область',
    name: 'Курорт «Краинка»',
    description: 'Девять участков ЛПХ от 10 до 100 соток у старейшего бальнеологического курорта Тульской области. Цена ниже кадастровой стоимости.',
    location: 'с. Рождествено',
    type: 'ЛПХ',
    price: 'от 300 000 ₽',
    count: '9 участков',
    image: '/images/krainka-photo.jpg',
    link: '/tula',
  },
  {
    id: 3,
    region: 'Тверская область',
    name: 'Светлая Долина',
    description: 'Гектары сельхозземли под фермерство, пасеку и агротуризм в 15 минутах от Ржева. Цена за гектар, а не за сотку.',
    location: '15 мин от Ржева',
    type: 'Сельхоз',
    price: 'от 149 000 ₽/га',
    count: '24 участка',
    image: '/images/tver-plan.png',
    link: '/tver',
  },
  {
    id: 4,
    region: 'Московская область',
    name: 'Серебряные пруды',
    description: 'Участки 8,5 сотки в городском округе Серебряные Пруды. Садоводство и дачное строительство, свет по участкам.',
    location: 'г. о. Серебряные Пруды',
    type: 'Садоводство',
    price: 'от 425 000 ₽',
    count: '32 участка',
    image: '/images/moscow-plan.png',
    link: '/moscow',
  },
  {
    id: 5,
    region: 'Республика Крым',
    name: 'У-Дачный Крым',
    description: 'Размежёванный массив 2 га на 58 участков в 1 км от моря, 20 км от Евпатории. Все участки на кадастре, продаётся единым лотом.',
    location: '1 км до моря',
    type: 'ЛПХ',
    price: '25 000 000 ₽',
    count: 'единый лот',
    image: '/images/crimea-plan.png',
    link: '/crimea',
  },
]

/* Четыре цифры вместо обещаний — с сайта покупателей (/partners). */
const terms = [
  { icon: Percent, value: 'до 20%', title: 'Комиссия', description: 'от стоимости каждой сделки — одна из самых высоких ставок на рынке земли.' },
  { icon: Timer, value: '3 дня', title: 'Выплата', description: 'деньги на ваш счёт в течение трёх рабочих дней после поступления оплаты на наш расчётный счёт.' },
  { icon: UserCheck, value: '1 клик', title: 'Закрепление', description: 'клиент фиксируется за вами — комиссию не перехватят.' },
  { icon: FileSignature, value: 'договор', title: 'Гарантия', description: 'вознаграждение закреплено партнёрским договором, не «на словах».' },
]

const weDo = [
  { icon: Rotate3d, text: 'Видео с дрона, генпланы, живые статусы и 3D-туры по части посёлков — показывайте участок клиенту, не выезжая.' },
  { icon: FileSignature, text: 'Документы, выписки ЕГРН, договор и регистрация — юридическую часть ведём мы.' },
  { icon: MapPinned, text: 'Показы на месте и сопровождение клиента до сделки — менеджер посёлка подключается по вашему запросу.' },
]

const stats = [
  { value: 5, suffix: '', label: 'посёлков в продаже' },
  { value: 4, suffix: '', label: 'региона России' },
  { value: 105, suffix: '', label: 'участков в проектах' },
  { value: 12, suffix: '', label: 'лет на рынке' },
]

const steps = [
  { icon: UserPlus, title: 'Регистрация', description: 'Оставляете заявку и получаете личного менеджера. Презентации, генпланы и 3D-туры — сразу.' },
  { icon: FileSearch, title: 'Фиксация клиента', description: 'Закрепляете клиента за собой в один клик. Он ваш — комиссию не перехватят.' },
  { icon: Handshake, title: 'Показ и сделка', description: 'Мы готовим документы и ведём сделку юридически. Расчёт — через аккредитив или сервис безопасных расчётов банка.' },
  { icon: Wallet, title: 'Выплата за 3 дня', description: 'До 20% комиссии — в течение 3 рабочих дней после поступления оплаты на наш расчётный счёт.' },
]

const guarantees = [
  { icon: ShieldCheck, title: 'Официальный договор', description: 'Партнёрское вознаграждение закреплено договором — не «на словах».' },
  { icon: Scale, title: 'Юридическая чистота', description: 'Каждый участок — с кадастровым номером и проверенными документами.' },
  { icon: BadgeCheck, title: 'Безопасный расчёт', description: 'Сделки — через аккредитив: деньги продавцу после регистрации права.' },
]

// ⚠️ ЧЕРНОВЫЕ отзывы-заготовки — ЗАМЕНИТЬ на реальные (имя, город, фото по согласию).
const testimonials = [
  { quote: 'Привёл двух клиентов за первый месяц — обе сделки закрыли, выплату получил в срок. Документами занималась команда, я только показывал участки.', name: 'Партнёр из Москвы', role: 'риелтор · черновик — заменить', deal: '620 000 ₽ комиссии' },
  { quote: 'Работаю с землёй впервые. Дали презентации, 3D-туры и готовые договоры — клиенту показывать одно удовольствие. Менеджер на связи постоянно.', name: 'Партнёр из Тулы', role: 'агент · черновик — заменить', deal: '3 сделки за квартал' },
  { quote: 'Ценю, что клиент закрепляется за мной сразу. Никаких споров «чей клиент». Выплаты действительно приходят за 3 дня.', name: 'Партнёр из Твери', role: 'частный брокер · черновик — заменить', deal: '1 200 000 ₽ за полугодие' },
]

const faqs = [
  { q: 'Кто может стать партнёром?', a: 'Риелторы, брокеры, агентства и частные лица. Опыт в земле не обязателен — мы даём материалы, обучение и личного менеджера.' },
  { q: 'Как фиксируется клиент за мной?', a: 'Вы оставляете заявку на фиксацию клиента — он закрепляется за вами. Комиссию по этому клиенту получаете именно вы.' },
  { q: 'Когда и как я получу комиссию?', a: 'До 20% от суммы сделки — в течение 3 рабочих дней после поступления оплаты на наш расчётный счёт. При расчёте через аккредитив это происходит после регистрации сделки.' },
  { q: 'Нужно ли платить за участие?', a: 'Нет. Участие в партнёрской программе бесплатное. Вы зарабатываете с продаж, никаких взносов.' },
  { q: 'Кто оформляет документы и ведёт сделку?', a: 'Юридическое сопровождение полностью на нашей стороне — от проверки документов до регистрации. Вы приводите клиента, остальное берём на себя.' },
  { q: 'Не поднимется ли цена для моего клиента?', a: 'Нет. Цена участка одинакова — на сайте, у менеджера и у партнёра. Ваша комиссия — часть нашей маржи, а не надбавка к цене.' },
  { q: 'С какими проектами можно работать?', a: 'Пять посёлков в четырёх регионах: Щёкинские берега и курорт «Краинка» (Тульская область), Светлая Долина (Тверская), Серебряные пруды (Московская) и У-Дачный Крым.' },
]

const navLinks = [
  { label: 'Условия', target: 'terms' },
  { label: 'Как это работает', target: 'how' },
  { label: 'Проекты', target: 'projects' },
  { label: 'Отзывы', target: 'testimonials' },
  { label: 'Калькулятор', target: 'calculator' },
]

const ease = [0.16, 1, 0.3, 1] as const
const fadeUp = {
  initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease },
}

const lineReveal = {
  hidden: { opacity: 0, y: 44, filter: 'blur(12px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease } },
}
const floatTransition = (delay: number) => ({ duration: 5, repeat: Infinity, ease: 'easeInOut' as const, delay })

/* Вордмарк ЗемФонд: «Зем» зелёным, «Фонд» кремовым (тёмная тема). */
function Wordmark({ withTagline = false }: { withTagline?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <img src="/images/zemfond-emblem.png" alt="ЗемФонд" className="h-8 w-8 object-contain" />
      <span className="leading-none">
        <span className="text-[18px] font-extrabold tracking-tight">
          <span className="text-[#25a03a]">Зем</span>
          <span className="text-[#f3eee6]">Фонд</span>
        </span>
        {withTagline && (
          <span className="block text-[10px] tracking-[0.14em] uppercase text-[#8d857a] mt-1">территории развития</span>
        )}
      </span>
    </span>
  )
}

export default function HomePage() {
  usePageMeta(
    'ЗемФонд — партнёрская программа по земельным участкам · комиссия до 20%',
    'Продавайте землю «ЗемФонд» и зарабатывайте до 20% комиссии с каждой сделки. 5 посёлков в 4 регионах России, выплата за 3 рабочих дня, юридическое сопровождение. До 5 млн ₽ с одной продажи.'
  )
  const reduce = useReducedMotion()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [dealAmount, setDealAmount] = useState(2000000)

  const commission = Math.round(dealAmount * 0.2)
  const sliderMin = 300000
  const sliderMax = 25000000
  const fillPct = ((dealAmount - sliderMin) / (sliderMax - sliderMin)) * 100

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  // Параллакс отключается для prefers-reduced-motion.
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '20%'])
  const heroScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.1, 1.25])
  const heroFade = useTransform(scrollYProgress, [0, 0.8], reduce ? [1, 1] : [1, 0])

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (window.location.hash === '/lands') {
      setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 120)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-[#1e1c1a] text-[#f3eee6]">
      {/* ===== Floating glass nav ===== */}
      <nav className="fixed top-3 inset-x-0 z-50 px-3 sm:px-5">
        <div className="max-w-6xl mx-auto glass rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <div className="px-4 sm:px-5 h-14 flex items-center justify-between">
            <a href="/" className="shrink-0">
              <Wordmark />
            </a>

            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((l) => (
                <button key={l.target} onClick={() => scrollTo(l.target)} className="text-[14px] font-medium text-[#c8c0b4] hover:text-[#f3eee6] transition-colors">
                  {l.label}
                </button>
              ))}
              <a href="/blog/" className="text-[14px] font-medium text-[#c8c0b4] hover:text-[#f3eee6] transition-colors">Блог</a>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <a href="tel:+79951691230" className="text-[14px] font-semibold text-[#f3eee6] hover:text-[#f0c96a] transition-colors">+7 (995) 169-12-30</a>
              <button onClick={() => setIsModalOpen(true)} className="bg-[#e4b654] hover:bg-[#f0c96a] text-[#1e1c1a] text-[14px] font-semibold pl-4 pr-2 py-2 rounded-full flex items-center gap-2 transition-colors">
                Фиксация
                <span className="w-6 h-6 rounded-full bg-[#1e1c1a]/15 flex items-center justify-center"><ArrowUpRight className="w-3.5 h-3.5" /></span>
              </button>
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden w-9 h-9 flex items-center justify-center" aria-label="Меню">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden overflow-hidden border-t border-[#f3eee6]/10">
                <div className="px-5 py-4 space-y-1">
                  {navLinks.map((l) => (
                    <button key={l.target} onClick={() => scrollTo(l.target)} className="block w-full text-left py-2.5 text-[16px] font-medium">{l.label}</button>
                  ))}
                  <a href="/blog/" className="block py-2.5 text-[16px] font-medium">Блог</a>
                  <a href="tel:+79951691230" className="block py-2.5 text-[16px] font-semibold text-[#f0c96a]">+7 (995) 169-12-30</a>
                  <button onClick={() => { setIsMobileMenuOpen(false); setIsModalOpen(true) }} className="mt-2 w-full bg-[#e4b654] text-[#1e1c1a] text-[15px] font-semibold py-3 rounded-full">Фиксация клиента</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-end overflow-hidden">
        <motion.img style={{ y: heroY, scale: heroScale }} src="/images/hero-river-view.png" alt="Земельные участки с высоты" className="absolute inset-0 w-full h-full object-cover will-change-transform" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141312]/95 via-[#141312]/55 to-[#141312]/15" />

        {/* фоновый вордмарк */}
        <div aria-hidden className="absolute bottom-6 sm:bottom-8 left-0 right-0 text-center pointer-events-none select-none overflow-hidden">
          <span className="font-display text-[#f3eee6]/[0.07] text-[15vw] leading-none whitespace-nowrap tracking-[-0.03em]">ЗЕМФОНД</span>
        </div>

        <motion.div style={{ opacity: heroFade }} className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 pb-14 lg:pb-20 pt-28">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-end">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="inline-flex items-center gap-2 glass-soft rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#25a03a]" />
                <span className="text-[13px] font-semibold text-[#f3eee6]">ЗемФонд · партнёрская программа</span>
              </motion.div>

              <motion.h1 initial="hidden" animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } } }}
                className="hero-shadow font-display text-[#f3eee6] text-[32px] sm:text-6xl lg:text-[72px]">
                <motion.span variants={lineReveal} className="block">Продавайте землю —</motion.span>
                <motion.span variants={lineReveal} className="block">мы платим <span className="text-[#f0c96a]">за результат</span></motion.span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.35 }}
                className="hero-shadow mt-6 text-[17px] sm:text-xl text-[#f3eee6]/90 max-w-xl leading-relaxed">
                Комиссия <span className="text-[#f0c96a] font-semibold">до 20%</span> с каждой сделки по земельным участкам — до 5 млн ₽ с одной продажи. Документы, показы и сделку берём на себя.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.5 }}
                className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={() => setIsModalOpen(true)}
                  className="bg-[#e4b654] hover:bg-[#f0c96a] text-[#1e1c1a] pl-6 pr-2 py-3.5 rounded-full text-[16px] font-semibold flex items-center justify-center gap-2 transition-colors">
                  Фиксация клиента
                  <span className="w-7 h-7 rounded-full bg-[#1e1c1a]/15 flex items-center justify-center"><ArrowRight className="w-4 h-4" /></span>
                </button>
                <button onClick={() => scrollTo('projects')}
                  className="glass text-[#f3eee6] px-6 py-3.5 rounded-full text-[16px] font-semibold hover:bg-[#f3eee6]/15 transition-colors">
                  Наши проекты
                </button>
              </motion.div>
            </div>

            {/* floating stat cards */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.6 }}
              className="hidden lg:flex flex-col gap-3">
              <motion.div animate={{ y: [0, -10, 0] }} transition={floatTransition(0)} className="glass rounded-3xl p-6">
                <div className="font-display text-5xl text-[#f0c96a]">до 20%</div>
                <div className="text-[14px] text-[#c8c0b4] mt-1">комиссия с каждой сделки</div>
              </motion.div>
              <div className="grid grid-cols-2 gap-3">
                <motion.div animate={{ y: [0, -8, 0] }} transition={floatTransition(0.8)} className="glass rounded-3xl p-5">
                  <div className="font-display text-3xl text-[#f3eee6]">3 дня</div>
                  <div className="text-[13px] text-[#c8c0b4] mt-1">на выплату</div>
                </motion.div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={floatTransition(1.6)} className="glass rounded-3xl p-5">
                  <div className="font-display text-3xl text-[#f3eee6]">5</div>
                  <div className="text-[13px] text-[#c8c0b4] mt-1">посёлков в продаже</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ===== Условия: четыре цифры вместо обещаний ===== */}
      <section id="terms" className="bg-[#1e1c1a] py-20 lg:py-28 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <p className="mono text-[13px] font-semibold tracking-[0.18em] uppercase text-[#f0c96a] mb-4">Условия</p>
            <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold">Четыре цифры вместо обещаний</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {terms.map((t, i) => {
              const Icon = t.icon
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease }}
                  className="bg-[#262320] border border-[#332f2a] rounded-3xl p-6 flex flex-col">
                  <Icon className="w-5 h-5 text-[#f0c96a]" />
                  <div className="font-display tabular text-3xl text-[#f3eee6] mt-5">{t.value}</div>
                  <div className="text-[15px] font-semibold text-[#f3eee6] mt-1">{t.title}</div>
                  <p className="text-[14px] text-[#c8c0b4] leading-relaxed mt-2">{t.description}</p>
                </motion.div>
              )
            })}
          </div>
          <motion.p {...fadeUp} className="mt-8 text-[14px] text-[#8d857a] max-w-2xl">
            Цена участка для клиента одинакова — на сайте, у менеджера и у партнёра. Ваша комиссия — часть нашей маржи, а не надбавка к цене.
          </motion.p>
        </div>
      </section>

      {/* ===== Материалы для показа ===== */}
      <section className="bg-[#262320] py-20 lg:py-28 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div {...fadeUp}>
            <p className="mono text-[13px] font-semibold tracking-[0.18em] uppercase text-[#f0c96a] mb-5">Вы приводите клиента</p>
            <h2 className="tight text-3xl sm:text-4xl lg:text-[44px] font-bold">
              Остальное делаем мы
            </h2>
            <div className="mt-8 space-y-4">
              {weDo.map((w, i) => {
                const Icon = w.icon
                return (
                  <div key={i} className="flex gap-4 items-start bg-[#1e1c1a] border border-[#332f2a] rounded-2xl px-5 py-5">
                    <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-xl bg-[#e4b654]/15 text-[#f0c96a]">
                      <Icon className="w-5 h-5" />
                    </span>
                    <p className="text-[15px] leading-relaxed text-[#c8c0b4]">{w.text}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="relative rounded-[28px] overflow-hidden border border-[#332f2a] h-[320px] sm:h-[400px] lg:h-[500px]">
            <img src="/images/hero-river-view.png" alt="Аэропанорама земельного участка" className="absolute inset-0 w-full h-full object-cover kenburns" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141312]/60 to-transparent" />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 glass-soft rounded-full px-3.5 py-2">
              <MapPin className="w-3.5 h-3.5 text-[#f0c96a]" />
              <span className="text-[#f3eee6] text-[13px] font-medium">Аэросъёмка участка</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="bg-[#1e1c1a] hectare-grid py-20 lg:py-28 px-5 sm:px-6">
        <motion.div {...fadeUp} className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#262320] border border-[#332f2a] rounded-3xl p-7 text-center">
              <div className="font-display tabular text-[26px] sm:text-4xl lg:text-5xl text-[#f0c96a]">
                <CountUp end={s.value} duration={2.2} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-[14px] text-[#8d857a]">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ===== About ===== */}
      <section id="about" className="bg-[#1e1c1a] py-16 lg:py-24 px-5 sm:px-6">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center">
          <p className="mono text-[13px] font-semibold tracking-[0.18em] uppercase text-[#f0c96a] mb-6">О компании</p>
          <p className="tight text-[28px] sm:text-4xl lg:text-[44px] font-bold text-[#f3eee6]">
            ЗемФонд — территории развития. С 2014 года создаём посёлки: участки под дом, гектары под дело, строительство и сервис.
          </p>
        </motion.div>
      </section>

      {/* ===== How it works ===== */}
      <section id="how" className="bg-[#141312] py-20 lg:py-32 px-5 sm:px-6 relative overflow-hidden" data-on-dark>
        <div className="hectare-grid absolute inset-0 opacity-[0.5]" aria-hidden />
        <div className="max-w-6xl mx-auto relative">
          <motion.div {...fadeUp} className="max-w-2xl mb-14 lg:mb-20">
            <p className="mono text-[13px] font-semibold tracking-[0.18em] uppercase text-[#f0c96a] mb-4">Как это работает</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl">От заявки до выплаты — 4 шага</h2>
            <p className="mt-5 text-[18px] text-[#c8c0b4]">Прозрачный путь партнёра. Вы приводите клиента — юридическую рутину и документы берём на себя.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease }}
                  className="glass-dark rounded-[28px] p-7 flex flex-col relative">
                  <span className="font-display text-[15px] text-[#f0c96a]/70 mb-5">{String(i + 1).padStart(2, '0')}</span>
                  <div className="w-12 h-12 rounded-2xl bg-[#e4b654]/15 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#f0c96a]" />
                  </div>
                  <h3 className="text-[18px] font-bold mb-2">{s.title}</h3>
                  <p className="text-[14px] text-[#c8c0b4] leading-relaxed">{s.description}</p>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-14 grid sm:grid-cols-3 gap-5">
            {guarantees.map((g, i) => {
              const Icon = g.icon
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                  className="flex gap-4 items-start rounded-3xl border border-[#f3eee6]/10 px-6 py-6">
                  <div className="w-10 h-10 rounded-xl bg-[#f3eee6]/[0.06] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#f0c96a]" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold mb-1">{g.title}</h4>
                    <p className="text-[13px] text-[#8d857a] leading-relaxed">{g.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div {...fadeUp} className="mt-12 flex justify-center">
            <button onClick={() => setIsModalOpen(true)}
              className="bg-[#e4b654] hover:bg-[#f0c96a] text-[#1e1c1a] pl-7 pr-2.5 py-4 rounded-full text-[16px] font-semibold flex items-center gap-2 transition-colors">
              Стать партнёром
              <span className="w-7 h-7 rounded-full bg-[#1e1c1a]/15 flex items-center justify-center"><ArrowRight className="w-4 h-4" /></span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== Projects ===== */}
      <section id="projects" className="bg-[#262320] hectare-grid py-20 lg:py-28 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 lg:mb-20">
            <div>
              <p className="mono text-[13px] font-semibold tracking-[0.18em] uppercase text-[#f0c96a] mb-3">Наши проекты</p>
              <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold">Земля, которую видно сверху</h2>
            </div>
            <p className="text-[16px] text-[#8d857a] max-w-xs">5 посёлков в 4 регионах России. Готовые материалы и кадастровые планы под каждого клиента.</p>
          </motion.div>

          <div className="space-y-14 lg:space-y-24">
            {lands.map((land, i) => {
              const reverse = i % 2 === 1
              return (
                <motion.div key={land.id}
                  initial={{ opacity: 0, y: 44, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, ease }}
                  className="grid lg:grid-cols-2 gap-7 lg:gap-14 items-center">
                  <a href={land.link}
                    className={`group relative block rounded-[36px] overflow-hidden h-[320px] sm:h-[440px] lg:h-[520px] border border-[#332f2a] shadow-[0_4px_24px_rgba(0,0,0,0.35)] ${reverse ? 'lg:order-2' : ''}`}>
                    <img src={land.image} alt={land.region} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out" />
                    <div className="absolute top-5 left-5 glass rounded-full px-4 py-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#f0c96a]" />
                      <span className="text-[14px] font-semibold text-[#f3eee6]">{land.region}</span>
                    </div>
                    <div className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-[#e4b654] text-[#1e1c1a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </a>

                  <div className={reverse ? 'lg:order-1' : ''}>
                    <p className="mono text-[12px] tracking-[0.18em] uppercase text-[#f0c96a] mb-4">
                      Проект {String(i + 1).padStart(2, '0')} — {land.region}
                    </p>
                    <h3 className="font-display text-[30px] sm:text-5xl lg:text-[52px] leading-[1.05]">{land.name}</h3>
                    <p className="mt-5 text-[15px] sm:text-[16px] text-[#c8c0b4] leading-relaxed max-w-lg">{land.description}</p>

                    <div className="mt-7 grid grid-cols-3 gap-3 max-w-lg">
                      <div className="bg-[#1e1c1a] border border-[#332f2a] rounded-2xl px-4 py-4">
                        <p className="text-[12px] text-[#8d857a] mb-1">Объём</p>
                        <p className="text-[15px] font-semibold">{land.count}</p>
                      </div>
                      <div className="bg-[#1e1c1a] border border-[#332f2a] rounded-2xl px-4 py-4">
                        <p className="text-[12px] text-[#8d857a] mb-1">Назначение</p>
                        <p className="text-[15px] font-semibold">{land.type}</p>
                      </div>
                      <div className="bg-[#1e1c1a] border border-[#332f2a] rounded-2xl px-4 py-4">
                        <p className="text-[12px] text-[#8d857a] mb-1">Цена</p>
                        <p className="text-[15px] font-semibold text-[#f0c96a]">{land.price}</p>
                      </div>
                    </div>

                    <a href={land.link}
                      className="mt-8 inline-flex items-center gap-2 bg-[#e4b654] hover:bg-[#f0c96a] text-[#1e1c1a] pl-6 pr-2 py-3.5 rounded-full text-[16px] font-semibold transition-colors">
                      Смотреть проект
                      <span className="w-7 h-7 rounded-full bg-[#1e1c1a]/15 flex items-center justify-center"><ArrowRight className="w-4 h-4" /></span>
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== Testimonials (ЧЕРНОВИК, заменить на реальные) ===== */}
      <section id="testimonials" className="bg-[#1e1c1a] py-20 lg:py-28 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <p className="mono text-[13px] font-semibold tracking-[0.18em] uppercase text-[#f0c96a] mb-3">Отзывы партнёров</p>
              <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold">Уже зарабатывают с нами</h2>
            </div>
            <p className="text-[16px] text-[#8d857a] max-w-xs">Реальные истории партнёров программы ЗемФонд.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="bg-[#262320] border border-[#332f2a] rounded-[28px] p-7 flex flex-col">
                <Quote className="w-8 h-8 text-[#e4b654]/40 mb-4" />
                <p className="text-[16px] text-[#f3eee6]/85 leading-relaxed flex-1">{t.quote}</p>
                <div className="mt-6 pt-5 border-t border-[#332f2a]">
                  <div className="inline-flex items-center gap-1.5 bg-[#e4b654]/12 text-[#f0c96a] text-[13px] font-semibold rounded-full px-3 py-1 mb-3">
                    <BadgeCheck className="w-3.5 h-3.5" /> {t.deal}
                  </div>
                  <p className="text-[15px] font-bold text-[#f3eee6]">{t.name}</p>
                  <p className="text-[13px] text-[#8d857a]">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Calculator ===== */}
      <section id="calculator" className="bg-[#262320] hectare-grid py-20 lg:py-28 px-5 sm:px-6">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="mono text-[13px] font-semibold tracking-[0.18em] uppercase text-[#f0c96a] mb-4">Калькулятор</p>
            <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold">Сколько вы заработаете</h2>
          </div>

          <div className="glass rounded-[36px] p-8 lg:p-14 shadow-[0_12px_50px_rgba(0,0,0,0.4)]">
            <p className="text-[15px] text-[#8d857a]">Сумма сделки</p>
            <p className="font-display tabular text-[28px] sm:text-4xl lg:text-5xl mt-1 mb-8">{dealAmount.toLocaleString('ru-RU')} ₽</p>

            <input type="range" min={sliderMin} max={sliderMax} step={100000} value={dealAmount}
              onChange={(e) => setDealAmount(Number(e.target.value))}
              className="gk-range w-full"
              aria-label="Сумма сделки"
              style={{ background: `linear-gradient(to right, #e4b654 ${fillPct}%, #45403a ${fillPct}%)` }} />
            <div className="flex justify-between text-[13px] text-[#8d857a] mt-3">
              <span>300 тыс ₽</span>
              <span>25 млн ₽</span>
            </div>

            <div className="mt-10 pt-10 border-t border-[#f3eee6]/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-[15px] text-[#8d857a]">Ваша комиссия · до 20%</p>
                <p className="font-display tabular text-4xl sm:text-5xl lg:text-6xl text-[#f0c96a] mt-2">до {commission.toLocaleString('ru-RU')} ₽</p>
              </div>
              <button onClick={() => setIsModalOpen(true)}
                className="bg-[#e4b654] hover:bg-[#f0c96a] text-[#1e1c1a] px-6 py-3.5 rounded-full text-[16px] font-semibold transition-colors">
                Получить эту сделку
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="bg-[#1e1c1a] py-20 lg:py-28 px-5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="mono text-[13px] font-semibold tracking-[0.18em] uppercase text-[#f0c96a] mb-4">Вопросы и ответы</p>
            <h2 className="tight text-3xl sm:text-4xl lg:text-5xl font-bold">Частые вопросы партнёров</h2>
          </motion.div>

          <motion.div {...fadeUp}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}
                  className="bg-[#262320] border border-[#332f2a] rounded-2xl px-6 overflow-hidden">
                  <AccordionTrigger className="text-left text-[16px] sm:text-[17px] font-semibold hover:no-underline py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[15px] text-[#c8c0b4] leading-relaxed pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#141312] py-24 lg:py-32 px-5 sm:px-6">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl">Обсудим детали?</h2>
          <p className="mt-5 text-[18px] sm:text-xl text-[#c8c0b4]">Присоединяйтесь к партнёрской программе ЗемФонд.</p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setIsModalOpen(true)}
              className="bg-[#e4b654] hover:bg-[#f0c96a] text-[#1e1c1a] px-8 py-4 rounded-full text-[17px] font-semibold transition-colors">
              Оставить заявку
            </button>
            <a href="https://max.ru/u/f9LHodD0cOKGmwKtxVHtowELQauNtni0QxVzToNr9E1Khu1saPkEz-4g8DU" target="_blank" rel="noopener noreferrer"
              className="bg-[#262320] border border-[#45403a] hover:bg-[#2e2a26] text-[#f3eee6] px-8 py-4 rounded-full text-[17px] font-semibold transition-colors">
              Написать в MAX
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />

      {/* ===== Modal ===== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
            <div className="absolute inset-0 bg-[#141312]/70 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease }} className="relative z-10 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsModalOpen(false)} className="absolute -top-11 right-0 text-[#f3eee6]/90 hover:text-[#f3eee6]" aria-label="Закрыть">
                <X className="w-6 h-6" />
              </button>
              <ContactForm />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </MotionConfig>
  )
}
