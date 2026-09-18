import SocialLinks from './SocialLinks';

export default function Footer() {
  return (
    <footer className="bg-[#141312] border-t border-[#332f2a] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/images/zemfond-emblem.png" alt="ЗемФонд" className="h-10 w-10 object-contain" />
            <span className="leading-none">
              <span className="text-[19px] font-extrabold tracking-tight">
                <span className="text-[#25a03a]">Зем</span>
                <span className="text-[#f3eee6]">Фонд</span>
              </span>
              <span className="block text-[10px] tracking-[0.14em] uppercase text-[#8d857a] mt-1">территории развития</span>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-[15px] text-[#8d857a]">
            <a href="tel:+79951691230" className="hover:text-[#f3eee6] transition-colors">+7 (995) 169-12-30</a>
            <a href="mailto:Gektar.RF@yandex.com" className="hover:text-[#f3eee6] transition-colors">Gektar.RF@yandex.com</a>
          </div>
        </div>

        <SocialLinks size="md" className="mt-10" />

        {/* ⚠️ ЧЕРНОВИК реквизитов — ЗАМЕНИТЬ на реальные данные юрлица */}
        <div className="border-t border-[#332f2a] mt-10 pt-8 text-center text-[#8d857a] text-[13px] leading-relaxed max-w-2xl mx-auto">
          ЗемФонд · ИНН 0000000000 · ОГРН 0000000000000 · <span className="whitespace-nowrap">заменить на реальные реквизиты</span>
        </div>

        <p className="text-center text-[#8d857a] text-[12px] mt-6 max-w-2xl mx-auto leading-relaxed">
          * Meta Platforms Inc. признана экстремистской и запрещена на территории РФ
        </p>

        <div className="border-t border-[#332f2a] mt-8 pt-8 text-center text-[#8d857a] text-[13px]">
          © {new Date().getFullYear()} ЗемФонд. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
