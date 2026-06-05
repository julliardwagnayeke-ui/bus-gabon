import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Spinner from './components/ui/Spinner';

const Home             = lazy(() => import('./pages/public/Home'));
const SearchResults    = lazy(() => import('./pages/public/SearchResults'));
const DepartureDetail  = lazy(() => import('./pages/public/DepartureDetail'));
const VerifyTicket     = lazy(() => import('./pages/public/VerifyTicket'));
const FAQ              = lazy(() => import('./pages/public/FAQ'));
const Contact          = lazy(() => import('./pages/public/Contact'));
const Terms            = lazy(() => import('./pages/public/Terms'));
const NotFound         = lazy(() => import('./pages/public/NotFound'));

const Login            = lazy(() => import('./pages/auth/Login'));
const Register         = lazy(() => import('./pages/auth/Register'));
const ForgotPassword   = lazy(() => import('./pages/auth/ForgotPassword'));

const Checkout         = lazy(() => import('./pages/client/Checkout'));
const PaymentSuccess   = lazy(() => import('./pages/client/PaymentSuccess'));
const PaymentFailure   = lazy(() => import('./pages/client/PaymentFailure'));
const MyTickets        = lazy(() => import('./pages/client/MyTickets'));
const TicketDetail     = lazy(() => import('./pages/client/TicketDetail'));
const Profile          = lazy(() => import('./pages/client/Profile'));

const AgencyLayout       = lazy(() => import('./pages/agency/AgencyLayout'));
const AgencyDashboard    = lazy(() => import('./pages/agency/AgencyDashboard'));
const AgencyProfile      = lazy(() => import('./pages/agency/AgencyProfile'));
const AgencyBuses        = lazy(() => import('./pages/agency/AgencyBuses'));
const AgencyRoutes       = lazy(() => import('./pages/agency/AgencyRoutes'));
const AgencyDepartures   = lazy(() => import('./pages/agency/AgencyDepartures'));
const AgencyReservations = lazy(() => import('./pages/agency/AgencyReservations'));
const AgencyScanner      = lazy(() => import('./pages/agency/AgencyScanner'));
const AgencySales        = lazy(() => import('./pages/agency/AgencySales'));

const AdminLayout    = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAgencies  = lazy(() => import('./pages/admin/AdminAgencies'));
const AdminPayments  = lazy(() => import('./pages/admin/AdminPayments'));
const AdminRevenue   = lazy(() => import('./pages/admin/AdminRevenue'));
const AdminUsers     = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCities    = lazy(() => import('./pages/admin/AdminCities'));

function Loading() {
  return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>;
}

function ProtectedRoute({ children, roles = [] }) {
  const { user, userRole, authLoading } = useApp();
  if (authLoading) return <Loading />;
  if (!user) return <Navigate to="/connexion" replace />;
  if (roles.length > 0 && !roles.includes(userRole)) return <Navigate to="/" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { user, authLoading } = useApp();
  if (authLoading) return <Loading />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppInner() {
  const { authLoading } = useApp();
  if (authLoading) return <Loading />;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-semibold">
        Aller au contenu
      </a>
      <Navbar />
      <main id="main">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/recherche"       element={<SearchResults />} />
          <Route path="/depart/:id"      element={<DepartureDetail />} />
          <Route path="/verifier-billet" element={<VerifyTicket />} />
          <Route path="/faq"             element={<FAQ />} />
          <Route path="/contact"         element={<Contact />} />
          <Route path="/cgu"             element={<Terms />} />

          <Route path="/connexion"           element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/inscription"         element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/mot-de-passe-oublie" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

          <Route path="/checkout/:departureId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/paiement/succes"        element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/paiement/echec"         element={<ProtectedRoute><PaymentFailure /></ProtectedRoute>} />
          <Route path="/mes-billets"            element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
          <Route path="/mes-billets/:ticketId"  element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
          <Route path="/profil"                 element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="/agence" element={
            <ProtectedRoute roles={['agency_agent','agency_admin']}>
              <AgencyLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard"    element={<AgencyDashboard />} />
            <Route path="profil"       element={<AgencyProfile />} />
            <Route path="bus"          element={<AgencyBuses />} />
            <Route path="lignes"       element={<AgencyRoutes />} />
            <Route path="departs"      element={<AgencyDepartures />} />
            <Route path="reservations" element={<AgencyReservations />} />
            <Route path="scanner"      element={<AgencyScanner />} />
            <Route path="ventes"       element={<AgencySales />} />
          </Route>

          <Route path="/admin" element={
            <ProtectedRoute roles={['platform_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index              element={<AdminDashboard />} />
            <Route path="agences"     element={<AdminAgencies />} />
            <Route path="paiements"   element={<AdminPayments />} />
            <Route path="revenus"     element={<AdminRevenue />} />
            <Route path="utilisateurs"element={<AdminUsers />} />
            <Route path="villes"      element={<AdminCities />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AppProvider>
  );
}
