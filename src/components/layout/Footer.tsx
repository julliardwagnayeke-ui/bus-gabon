import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-16">
      {/* MAIN DARK FOOTER */}
      <div className="bg-[#051024] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-[13px] leading-relaxed">
          {/* Column 1 */}
          <div>
            <h4 className="font-extrabold text-white mb-5 text-sm uppercase tracking-wider">Service client</h4>
            <ul className="space-y-4 text-white/80">
              <li><Link href="/contact" className="hover:underline hover:text-white transition">Contactez-nous</Link></li>
              <li><Link href="/faq" className="hover:underline hover:text-white transition">Questions fréquentes</Link></li>
              <li><Link href="/remboursement" className="hover:underline hover:text-white transition">Remboursement</Link></li>
            </ul>
          </div>
          {/* Column 2 */}
          <div>
            <h4 className="font-extrabold text-white mb-5 text-sm uppercase tracking-wider">Achat en ligne</h4>
            <ul className="space-y-4 text-white/80">
              <li><Link href="/paiement" className="hover:underline hover:text-white transition">Modes de paiement</Link></li>
              <li><Link href="/frais" className="hover:underline hover:text-white transition">Frais de service</Link></li>
            </ul>
          </div>
          {/* Column 3 */}
          <div>
            <h4 className="font-extrabold text-white mb-5 text-sm uppercase tracking-wider">Légal</h4>
            <ul className="space-y-4 text-white/80">
              <li><Link href="/cgu" className="hover:underline hover:text-white transition">Conditions générales</Link></li>
              <li><Link href="/confidentialite" className="hover:underline hover:text-white transition">Confidentialité</Link></li>
            </ul>
          </div>
          {/* Column 4: App Store (Stub) */}
          <div className="lg:col-span-2">
            <h4 className="font-extrabold text-white mb-5 text-sm uppercase tracking-wider">Application BusGabon</h4>
            <p className="text-white/60 mb-4">Bientôt disponible sur iOS et Android pour une expérience encore plus fluide.</p>
            <div className="flex gap-4">
              <div className="h-10 w-32 bg-white/10 rounded-lg border border-white/20"></div>
              <div className="h-10 w-32 bg-white/10 rounded-lg border border-white/20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* WHITE SUB-FOOTER */}
      <div className="bg-white py-6 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-[12px] text-text-light">
          <p>© {new Date().getFullYear()} BusGabon. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/sitemap" className="hover:text-primary transition">Plan du site</Link>
            <Link href="/accessibilite" className="hover:text-primary transition">Accessibilité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
