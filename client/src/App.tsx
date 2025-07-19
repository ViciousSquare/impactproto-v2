import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/home";
import Leaderboard from "@/pages/leaderboard";
import SolutionFinder from "@/pages/solution-finder";
import OrganizationProfilePage from "@/pages/organization/[id]";
import MethodologyPage from "@/pages/methodology";
import AboutPage from "@/pages/about";
import AdminDashboard from "@/pages/admin";
import MemberDashboard from "@/pages/member";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/solution-finder" component={SolutionFinder} />
      <Route path="/methodology" component={MethodologyPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/organization/:id" component={OrganizationProfilePage} />
      
      {/* Admin Dashboard Routes */}
      <Route path="/admin" component={AdminDashboard} />
      
      {/* Member Dashboard Routes */}
      <Route path="/member" component={MemberDashboard} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminPage = location.startsWith('/admin');
  const isMemberPage = location.startsWith('/member');

  // Don't show header/footer on admin or member dashboard pages
  const showHeaderFooter = !isAdminPage && !isMemberPage;

  return (
    <div className="flex flex-col min-h-screen">
      {showHeaderFooter && <Header />}
      <main className={`flex-grow ${!showHeaderFooter ? 'bg-gray-50' : ''}`}>
        <Router />
      </main>
      {showHeaderFooter && <Footer />}
      <Toaster />
    </div>
  );
}

export default App;
