import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full mt-16">
      {/* SOCIAL MEDIA BAR */}
      <div className="bg-[#f8f9fa] border-t border-b border-border/50 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-4 items-center">
          {/* Facebook */}
          <a href="#" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          {/* X / Twitter */}
          <a href="#" className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          {/* LinkedIn */}
          <a href="#" className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 transition">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          {/* Instagram */}
          <a href="#" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#fd5949] to-[#d6249f] text-white flex items-center justify-center hover:opacity-90 transition">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          {/* Messenger */}
          <a href="#" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00c6ff] to-[#0072ff] text-white flex items-center justify-center hover:opacity-90 transition">
             <svg className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </a>
          {/* YouTube */}
          <a href="#" className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 transition">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          {/* WhatsApp */}
          <a href="#" className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          </a>
          {/* WeChat/Line generic icon */}
          <a href="#" className="w-8 h-8 rounded-full bg-[#00C300] text-white flex items-center justify-center hover:opacity-90 transition">
             <svg className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </a>
        </div>
      </div>

      {/* MAIN DARK FOOTER */}
      <div className="bg-[#051024] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-[13px] leading-relaxed">
          {/* Column 1 */}
          <div>
            <h4 className="font-extrabold text-white mb-5 text-sm">Service client</h4>
            <ul className="space-y-4 text-white/80">
              <li><Link to="/contact" className="hover:underline">Contactez-nous</Link></li>
              <li><Link to="/remboursement" className="hover:underline">Remboursement</Link></li>
              <li><Link to="/reclamations" className="hover:underline">Réclamations</Link></li>
              <li><Link to="/facture" className="hover:underline">Demander une facture</Link></li>
              <li><Link to="/assistance" className="hover:underline">Passagers handicapés</Link></li>
            </ul>
          </div>
          {/* Column 2 */}
          <div>
            <h4 className="font-extrabold text-white mb-5 text-sm">Achat en ligne</h4>
            <ul className="space-y-4 text-white/80">
              <li><Link to="/frais" className="hover:underline">Frais de réservation -<br/>Frais de service</Link></li>
              <li><Link to="/paiement" className="hover:underline">Modes de paiement</Link></li>
              <li><Link to="/shopping" className="hover:underline">Shopping BusGabon</Link></li>
              <li><Link to="/pourquoi" className="hover:underline">Pourquoi réserver sur le<br/>site officiel de BusGabon ?</Link></li>
            </ul>
          </div>
          {/* Column 3 */}
          <div>
            <h4 className="font-extrabold text-white mb-5 text-sm">Agences partenaires</h4>
            <ul className="space-y-4 text-white/80">
              <li><Link to="/agence/1" className="hover:underline">Transgabonaise</Link></li>
              <li><Link to="/agence/2" className="hover:underline">Major Transport</Link></li>
              <li><Link to="/agence/3" className="hover:underline">Mille Feuilles</Link></li>
              <li><Link to="/agences" className="hover:underline">Toutes les agences</Link></li>
            </ul>
          </div>
          {/* Column 4 */}
          <div>
            <h4 className="font-extrabold text-white mb-5 text-sm">À propos de BusGabon</h4>
            <ul className="space-y-4 text-white/80">
              <li><Link to="/corporate" className="hover:underline">BusGabon Corporate</Link></li>
              <li><Link to="/affiliation" className="hover:underline">Programme d'affiliation</Link></li>
              <li><Link to="/tourisme" className="hover:underline">destinations touristiques</Link></li>
              <li><Link to="/monde" className="hover:underline">Sites mondiaux</Link></li>
              <li><Link to="/app" className="hover:underline">L'application BusGabon</Link></li>
            </ul>
          </div>
          {/* Column 5: App Links */}
          <div>
            <h4 className="font-extrabold text-white mb-5 text-sm">application BusGabon</h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 border border-white/30 rounded-lg px-3 py-2 hover:bg-white/10 transition w-max">
                <svg className="w-6 h-6 fill-white flex-shrink-0" viewBox="0 0 24 24"><path d="M16.365 14.363c-.015-3.593 2.919-5.323 3.053-5.405-1.666-2.453-4.254-2.791-5.187-2.836-2.222-.224-4.341 1.31-5.467 1.31-1.144 0-2.868-1.288-4.708-1.25-2.408.037-4.636 1.41-5.867 3.555-2.493 4.345-.637 10.741 1.782 14.259 1.185 1.731 2.593 3.666 4.459 3.593 1.777-.074 2.459-1.157 4.614-1.157 2.133 0 2.784 1.157 4.643 1.119 1.911-.036 3.125-1.785 4.303-3.52 1.362-1.999 1.925-3.924 1.954-4.025-.044-.015-3.564-1.37-3.58-5.638zm-3.037-7.791c.963-1.171 1.607-2.793 1.43-4.414-1.393.059-3.081.933-4.081 2.089-.888 1.022-1.666 2.682-1.451 4.252 1.555.118 3.14-.755 4.102-1.927z"/></svg>
                <div className="text-left">
                  <div className="text-[9px] leading-tight text-white/80">Télécharger dans</div>
                  <div className="text-sm font-bold leading-tight tracking-tight">l'App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 border border-white/30 rounded-lg px-3 py-2 hover:bg-white/10 transition w-max">
                 <svg className="w-6 h-6 fill-white flex-shrink-0" viewBox="0 0 24 24"><path d="M17.523 15.341l-4.779-4.898 4.671-4.74c.264.137.564.304.887.498 1.761.989 3.141 1.83 3.518 2.37.166.237.234.423.234.569 0 .179-.089.4-.336.671-.397.436-1.942 1.341-3.666 2.38-1.572.846-3.336 1.879-4.195 3.15zM2.871 3.585c-.092.179-.158.4-.158.653v15.524c0 .324.089.601.21.826l8.804-9.011-8.856-7.992zM12.28 12.016l-8.082 8.24c.224.114.475.187.751.187.354 0 .802-.128 1.38-.415 2.128-1.077 4.175-2.186 5.867-3.13l.081-.044-8.856-7.993 8.859 3.155zM11.666 10.323l-7.795-2.776C5.074 6.969 6.06 6.35 6.974 5.766c.86-.549 1.639-1.05 2.228-1.42.502-.315.89-.524 1.15-.615.195-.068.375-.098.541-.098.199 0 .385.039.558.118l.115.056L11.666 10.323z"/></svg>
                 <div className="text-left">
                  <div className="text-[9px] leading-tight text-white/80">DISPONIBLE SUR</div>
                  <div className="text-sm font-bold leading-tight tracking-tight">Google Play</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 border border-white/30 rounded-lg px-3 py-2 hover:bg-white/10 transition w-max">
                 <div className="w-6 h-6 bg-[#cf0a2c] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H7.5v-1.5h9V16zm0-3.5H7.5v-1.5h9v1.5zm0-3.5H7.5V7.5h9v1.5z"/></svg>
                 </div>
                 <div className="text-left">
                  <div className="text-[9px] leading-tight text-white/80">DÉCOUVREZ SUR</div>
                  <div className="text-sm font-bold leading-tight tracking-tight">AppGallery</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* WHITE SUB-FOOTER */}
      <div className="bg-white py-6 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-y-3 text-[13px] text-text-light">
            <Link to="/sitemap" className="hover:text-primary transition pr-4 sm:pr-6 border-r border-border">Plan du site</Link>
            <Link to="/legales" className="hover:text-primary transition px-4 sm:px-6 border-r border-border">Informations légales</Link>
            <Link to="/confidentialite" className="hover:text-primary transition px-4 sm:px-6 border-r border-border">Politique de confidentialité</Link>
            <Link to="/accessibilite" className="hover:text-primary transition px-4 sm:px-6 border-r border-border">Déclaration d'accessibilité</Link>
            <button className="hover:text-primary transition pl-4 sm:pl-6 text-left">Paramètres des cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
