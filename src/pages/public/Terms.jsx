import { Link } from 'react-router-dom';
import { Scale, Shield, Mail } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          <Scale className="w-3.5 h-3.5" /> Cadre légal
        </span>
        <h1 className="text-3xl font-extrabold text-dark mb-2">Conditions générales d’utilisation</h1>
        <p className="text-text-muted text-xs">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <article className="space-y-8 text-sm text-text-light leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-dark mb-2">1. Objet</h2>
          <p>
            BusGabon est une plateforme en ligne mettant en relation des voyageurs et des agences de transport
            interurbain agréées au Gabon. Les présentes conditions encadrent l’utilisation du site et
            les transactions qui y sont réalisées.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-dark mb-2">2. Rôle de la plateforme</h2>
          <p>
            BusGabon agit comme intermédiaire technique. Le contrat de transport est conclu directement
            entre le voyageur et l’agence sélectionnée. La plateforme n’est pas responsable des conditions
            d’embarquement, des retards, ni de l’organisation interne des agences.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-dark mb-2">3. Réservation et paiement</h2>
          <p>
            La réservation est confirmée après validation du paiement. Un billet électronique avec QR code
            unique est généré immédiatement et reste accessible dans l’espace « Mes billets ». Des frais de
            service de 200 FCFA s’appliquent par commande.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-dark mb-2">4. Bagages</h2>
          <p>
            Chaque agence définit sa propre politique bagages (nombre inclus, poids maximum, frais
            supplémentaires). Le voyageur reconnaît avoir consulté cette politique avant achat ; elle est
            affichée sur la page de détail du départ.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-dark mb-2">5. Annulation et remboursement</h2>
          <p>
            Les conditions d’annulation et de remboursement relèvent de chaque agence. Pour toute demande,
            contactez directement l’agence dont les coordonnées figurent sur votre billet.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-dark mb-2">6. Données personnelles</h2>
          <p>
            Les informations recueillies sont utilisées uniquement pour la réservation, le paiement et la
            relation client. Elles ne sont jamais cédées à des tiers à des fins commerciales. Vous disposez
            d’un droit d’accès, de rectification et de suppression en écrivant à contact@busgabon.ga.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-dark mb-2">7. Vérification des agences</h2>
          <p>
            BusGabon contrôle l’identité et les autorisations des agences avant de leur attribuer un badge
            « Vérifiée ». Ce badge engage la plateforme dans le filtrage initial mais n’exonère pas l’agence
            de ses obligations légales propres.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-dark mb-2">8. Loi applicable</h2>
          <p>
            Les présentes conditions sont régies par la loi gabonaise. Tout litige sera porté devant les
            juridictions compétentes de Libreville après tentative de résolution amiable.
          </p>
        </section>
      </article>

      <div className="mt-12 glass rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <Shield className="w-8 h-8 text-primary flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-dark text-sm">Une question sur ces conditions ?</p>
          <p className="text-xs text-text-light">Notre équipe juridique répond dans les 48h.</p>
        </div>
        <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition">
          <Mail className="w-4 h-4" /> Contact
        </Link>
      </div>
    </div>
  );
}
