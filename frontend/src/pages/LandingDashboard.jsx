import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Apple, Globe, Shield, Zap, Clock, Check, Gift, Star, TrendingUp } from 'lucide-react';

const LandingDashboard = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const pricingPlans = [
    { duration: '1 Muaj', price: 20, perMonth: 20, popular: false },
    { duration: '3 Muaj', price: 60, perMonth: 20, popular: false },
    { duration: '6 Muaj', price: 120, perMonth: 20, popular: false },
    { duration: '12 Muaj', price: 150, originalPrice: 230, perMonth: 12.5, popular: true, savings: 80 },
  ];

  const features = [
    'Menaxhim i produkteve pa limit',
    'Raporte të detajuara të shitjeve',
    'Multi-përdorues (admin & arkëtar)',
    'Fatura profesionale',
    'Sinkronizim në kohë reale',
    'Mbështetje teknike 24/7',
    'Eksport të dhënash',
    'Backup automatik',
  ];

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00a79d]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00a79d]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#00a79d]/5 to-transparent rounded-full"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>

      {/* Header */}
      <header className="relative w-full py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_retailsys-1/artifacts/9i1h1bxb_logo%20icon.png" 
              alt="DataPOS" 
              className="h-12 object-contain"
            />
            <span className="text-xl font-bold text-white tracking-tight">DataPOS</span>
          </div>
          <button
            onClick={handleLogin}
            className="px-6 py-2 text-sm font-medium text-[#00a79d] hover:text-white border border-[#00a79d]/30 hover:border-[#00a79d] hover:bg-[#00a79d]/10 rounded-full transition-all"
          >
            Kyçu
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#00a79d]/10 border border-[#00a79d]/20 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-[#00a79d]" />
              <span className="text-sm text-[#00a79d] font-medium">Software profesional për biznesin tënd</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Menaxho shitjet me
              <span className="block text-[#00a79d]">DataPOS</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Sistemi më i avancuar POS për bizneset në Kosovë. Fillo me 30 ditë provë falas!
            </p>
          </div>

          {/* Special Offer Banner */}
          <div className="bg-gradient-to-r from-[#00a79d]/20 via-[#00a79d]/10 to-[#00a79d]/20 border border-[#00a79d]/30 rounded-2xl p-6 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#ff6b6b] text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
              OFERTË SPECIALE
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#00a79d]/20 rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-[#00a79d]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Kurseni 80€ në Vitin e Parë!</h3>
                  <p className="text-gray-400">Abonohuni për 12 muaj dhe paguani vetëm</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="text-gray-500 line-through text-lg">230€</span>
                  <span className="text-4xl font-bold text-[#00a79d] ml-3">150€</span>
                  <span className="text-gray-400 text-sm">/vit</span>
                </div>
                <button
                  onClick={handleRegister}
                  className="px-8 py-3 bg-[#00a79d] hover:bg-[#008f86] text-white font-semibold rounded-xl transition-all transform hover:scale-105"
                >
                  Fillo Tani →
                </button>
              </div>
            </div>
          </div>

          {/* Platform Options */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Zgjidhni Platformën</h2>
            <p className="text-gray-400">Përdorni DataPOS në çdo pajisje</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Windows Button */}
            <div className="group relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col items-center text-center overflow-hidden opacity-60">
              <div className="absolute top-4 right-4 bg-[#00a79d]/20 text-[#00a79d] text-xs font-semibold px-3 py-1 rounded-full">
                SË SHPEJTI
              </div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  <Monitor className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Windows</h3>
                <p className="text-gray-600 text-sm mb-4">Aplikacion desktop</p>
              </div>
            </div>

            {/* macOS Button */}
            <div className="group relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col items-center text-center overflow-hidden opacity-60">
              <div className="absolute top-4 right-4 bg-[#00a79d]/20 text-[#00a79d] text-xs font-semibold px-3 py-1 rounded-full">
                SË SHPEJTI
              </div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  <Apple className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">macOS</h3>
                <p className="text-gray-600 text-sm mb-4">Aplikacion desktop</p>
              </div>
            </div>

            {/* Use Online Button */}
            <button
              onClick={handleRegister}
              className="group relative bg-gradient-to-b from-[#00a79d]/20 to-[#00a79d]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#00a79d]/30 hover:border-[#00a79d] transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#00a79d]/0 to-[#00a79d]/0 group-hover:from-[#00a79d]/10 group-hover:to-[#00a79d]/20 transition-all duration-500"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-[#00a79d]/20 group-hover:bg-[#00a79d]/30 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110">
                  <Globe className="w-10 h-10 text-[#00a79d] transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Përdor Online</h3>
                <p className="text-gray-400 text-sm mb-4">30 ditë provë falas</p>
                <div className="inline-flex items-center gap-2 text-[#00a79d] text-sm font-medium">
                  <span>Regjistrohu Tani →</span>
                </div>
              </div>
            </button>
          </div>

          {/* Pricing Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">Çmimet e Abonimit</h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Zgjidhni planin që përshtatet më mirë me nevojat e biznesit tuaj. Të gjitha planet përfshijnë 30 ditë provë falas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-gradient-to-b ${
                    plan.popular
                      ? 'from-[#00a79d]/20 to-[#00a79d]/5 border-[#00a79d]'
                      : 'from-white/[0.08] to-white/[0.02] border-white/10'
                  } backdrop-blur-sm rounded-2xl p-6 border flex flex-col`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00a79d] text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      MË I POPULLARIZUAR
                    </div>
                  )}
                  
                  <div className="text-center mb-6 pt-2">
                    <h3 className="text-lg font-semibold text-white mb-2">{plan.duration}</h3>
                    <div className="flex items-center justify-center gap-2">
                      {plan.originalPrice && (
                        <span className="text-gray-500 line-through text-lg">{plan.originalPrice}€</span>
                      )}
                      <span className="text-4xl font-bold text-white">{plan.price}€</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{plan.perMonth}€/muaj</p>
                    {plan.savings && (
                      <div className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded-full mt-2">
                        <TrendingUp className="w-3 h-3" />
                        Kurseni {plan.savings}€
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleRegister}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      plan.popular
                        ? 'bg-[#00a79d] hover:bg-[#008f86] text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    Fillo Provën Falas
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-b from-white/[0.05] to-transparent rounded-2xl p-8 border border-white/10 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Çfarë Përfshihet?</h2>
              <p className="text-gray-400">Të gjitha planet përfshijnë këto veçori</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-6 h-6 bg-[#00a79d]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#00a79d]" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-gray-500 text-sm mb-8">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00a79d]" />
              <span>100% i sigurt</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00a79d]" />
              <span>I shpejtë dhe efikas</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00a79d]" />
              <span>Mbështetje 24/7</span>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-[#00a79d]/10 via-[#00a79d]/20 to-[#00a79d]/10 rounded-2xl p-8 border border-[#00a79d]/20">
            <h2 className="text-2xl font-bold text-white mb-4">Gati për të Filluar?</h2>
            <p className="text-gray-400 mb-6">Regjistrohuni tani dhe merrni 30 ditë provë falas. Pa kartë krediti.</p>
            <button
              onClick={handleRegister}
              className="px-8 py-4 bg-[#00a79d] hover:bg-[#008f86] text-white font-semibold rounded-xl transition-all transform hover:scale-105 text-lg"
            >
              Regjistrohu Falas →
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative py-8 text-center border-t border-white/5">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} DataPOS. Të gjitha të drejtat e rezervuara.
        </p>
      </footer>
    </div>
  );
};

export default LandingDashboard;
