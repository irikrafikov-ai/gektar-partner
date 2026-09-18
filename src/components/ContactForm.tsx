import { useState } from 'react'
import { Send, Building2, User, Phone, Users, FileText, Check } from 'lucide-react'

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8382117990:AAELl3jIwC9tAMqqh7Yn0ZZUYdyv8qlSAG4'
const TELEGRAM_CHAT_ID = '@gektar_request'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    agencyName: '',
    agentName: '',
    agentContact: '',
    clientName: '',
    clientContact: '',
    objectDetails: '',
    consent: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const sendToTelegram = async () => {
    const message = `🆕 Новая заявка с партнёрского сайта ЗемФонд

🏢 Агентство: ${formData.agencyName}
👤 Агент: ${formData.agentName}
📞 Контакты агента: ${formData.agentContact}

👥 Клиент: ${formData.clientName}
📱 Контакты клиента: ${formData.clientContact}

📋 Объект:
${formData.objectDetails || 'Не указано'}

🕐 Дата: ${new Date().toLocaleString('ru-RU')}`

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    
    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message
        })
      })
      const data = await response.json()
      console.log('Telegram response:', data)
    } catch (err) {
      console.error('Telegram send error:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.consent) {
      setError('Необходимо дать согласие на обработку персональных данных')
      return
    }
    setIsSubmitting(true)
    setError('')

    try {
      // Отправка в Telegram (async, не блокирует)
      sendToTelegram()

      // Google Apps Script Web App URL
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbzDmetdJzkJfDTjE5bRY6nW2DNXPSDtprqDBAzbhBU1st2TkdE9uBiMqg8qTXYn8BnFaA/exec'
      
      // Отправка в Google Sheets
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agencyName: formData.agencyName,
          agentName: formData.agentName,
          agentContact: formData.agentContact,
          clientName: formData.clientName,
          clientContact: formData.clientContact,
          objectDetails: formData.objectDetails,
          timestamp: new Date().toISOString()
        })
      })

      // Отправка письма через mailto
      const mailtoLink = `mailto:Gektar.RF@yandex.com?subject=Новая заявка с партнёрского сайта ЗемФонд&body=
Название агентства: ${encodeURIComponent(formData.agencyName)}%0A
ФИО Агента: ${encodeURIComponent(formData.agentName)}%0A
Контакты агента: ${encodeURIComponent(formData.agentContact)}%0A
Фамилия/Имя Клиента: ${encodeURIComponent(formData.clientName)}%0A
Контакты клиента: ${encodeURIComponent(formData.clientContact)}%0A
Подробные характеристики объекта: ${encodeURIComponent(formData.objectDetails)}%0A%0A
Дата: ${encodeURIComponent(new Date().toLocaleString('ru-RU'))}`
      window.open(mailtoLink, '_blank')

      setIsSubmitted(true)
      setFormData({
        agencyName: '',
        agentName: '',
        agentContact: '',
        clientName: '',
        clientContact: '',
        objectDetails: '',
        consent: false
      })
    } catch (err) {
      setError('Произошла ошибка. Пожалуйста, попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-[#b98a2e]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[#b98a2e]" />
        </div>
        <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3">Заявка отправлена</h3>
        <p className="text-[#6e6e73] mb-7">Мы свяжемся с вами в ближайшее время.</p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="bg-[#b98a2e] hover:bg-[#a67b26] text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    )
  }

  const inputClass =
    "w-full bg-[#f5f5f7] border border-transparent focus:border-[#b98a2e]/40 focus:bg-white rounded-2xl px-4 py-3 text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none transition-colors"
  const labelClass = "flex items-center gap-2 text-[13px] font-medium text-[#6e6e73] mb-2"

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto no-scrollbar">
      <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-1 text-center">Фиксация клиента</h3>
      <p className="text-[14px] text-[#6e6e73] text-center mb-6">Заполните форму — мы закрепим клиента за вами.</p>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>
            <Building2 className="w-4 h-4" />
            Название агентства
          </label>
          <input
            type="text"
            value={formData.agencyName}
            onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
            className={inputClass}
            placeholder="Введите название агентства"
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            <User className="w-4 h-4" />
            ФИО Агента
          </label>
          <input
            type="text"
            value={formData.agentName}
            onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
            className={inputClass}
            placeholder="Введите ФИО"
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            <Phone className="w-4 h-4" />
            Контакты агента
          </label>
          <input
            type="text"
            value={formData.agentContact}
            onChange={(e) => setFormData({ ...formData, agentContact: e.target.value })}
            className={inputClass}
            placeholder="Телефон или email"
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            <Users className="w-4 h-4" />
            Фамилия/Имя Клиента
          </label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            className={inputClass}
            placeholder="Введите ФИО клиента"
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            <Phone className="w-4 h-4" />
            Контакты клиента
          </label>
          <input
            type="text"
            value={formData.clientContact}
            onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
            className={inputClass}
            placeholder="Телефон или email клиента"
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            <FileText className="w-4 h-4" />
            Подробные характеристики объекта
          </label>
          <textarea
            value={formData.objectDetails}
            onChange={(e) => setFormData({ ...formData, objectDetails: e.target.value })}
            className={`${inputClass} h-24 resize-none`}
            placeholder="Опишите объект..."
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="consent"
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-0.5 w-5 h-5 accent-[#b98a2e]"
          />
          <label htmlFor="consent" className="text-[#6e6e73] text-[13px] leading-relaxed">
            Я даю согласие на обработку персональных данных
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#b98a2e] hover:bg-[#a67b26] disabled:opacity-50 text-white py-4 rounded-full font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
        </button>
      </div>
    </form>
  )
}
