import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Apple, Globe, Shield, Zap, Clock } from 'lucide-react';

const LandingDashboard = () => {
  const navigate = useNavigate();

  const handleUseOnline = () => {
    navigate('/login');
  };

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
      <header className="relative w-full py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_retailsys-1/artifacts/9i1h1bxb_logo%20icon.png" 
              alt="DataPOS" 
              className="h-14 object-contain"
            />
            <span className="text-2xl font-bold text-white tracking-tight">DataPOS</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          {/* Title Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#00a79d]/10 border border-[#00a79d]/20 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-[#00a79d]" />
              <span className="text-sm text-[#00a79d] font-medium">Software profesional për biznesin tënd</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Si dëshironi të përdorni
              <span className="block text-[#00a79d]">DataPOS?</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Zgjidhni platformën që përshtatet më mirë me mënyrën tuaj të punës
            </p>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {/* Windows Button */}
            <div
              className="group relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col items-center text-center overflow-hidden opacity-60"
            >
              <div className="absolute top-4 right-4 bg-[#00a79d]/20 text-[#00a79d] text-xs font-semibold px-3 py-1 rounded-full">
                SË SHPEJTI
              </div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  <Monitor className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Windows
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Aplikacion desktop
                </p>
              </div>
            </div>

            {/* macOS Button */}
            <div
              className="group relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col items-center text-center overflow-hidden opacity-60"
            >
              <div className="absolute top-4 right-4 bg-[#00a79d]/20 text-[#00a79d] text-xs font-semibold px-3 py-1 rounded-full">
                SË SHPEJTI
              </div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  <Apple className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  macOS
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Aplikacion desktop
                </p>
              </div>
            </div>

            {/* Use Online Button */}
            <button
              onClick={handleUseOnline}
              className="group relative bg-gradient-to-b from-[#00a79d]/20 to-[#00a79d]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#00a79d]/30 hover:border-[#00a79d] transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#00a79d]/0 to-[#00a79d]/0 group-hover:from-[#00a79d]/10 group-hover:to-[#00a79d]/20 transition-all duration-500"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-[#00a79d]/20 group-hover:bg-[#00a79d]/30 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110">
                  <Globe className="w-10 h-10 text-[#00a79d] transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Përdor Online
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Hap në browser
                </p>
                <div className="inline-flex items-center gap-2 text-[#00a79d] text-sm font-medium">
                  <span>Fillo tani →</span>
                </div>
              </div>
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="relative py-8 text-center border-t border-white/5">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} DataPOS. Të gjitha të drejtat e rezervuara.
        </p>
      </footer>

      {/* Windows Download Modal */}
      <Dialog open={showWindowsModal} onOpenChange={setShowWindowsModal}>
        <DialogContent className="sm:max-w-md bg-[#0f1f35] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl text-white">
              <div className="w-10 h-10 bg-[#00a79d]/20 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 text-[#00a79d]" />
              </div>
              Shkarko për Windows
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-white">Windows 64-bit</p>
                    <p className="text-sm text-gray-400">Versioni 1.0.0</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-full">~85 MB</span>
              </div>
              
              <div className="text-sm text-gray-400 space-y-2 pl-2">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00a79d] rounded-full"></span>
                  Windows 10 ose më i ri
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00a79d] rounded-full"></span>
                  Kërkon lidhje interneti
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
              onClick={() => setShowWindowsModal(false)}
            >
              Anulo
            </Button>
            <Button
              className="flex-1 bg-[#00a79d] hover:bg-[#008f86] text-white border-0"
              onClick={() => {
                window.open('https://github.com/YOUR_REPO/releases/download/v1.0.0/DataPOS-Setup-1.0.0.exe', '_blank');
                setShowWindowsModal(false);
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Shkarko
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* macOS Download Modal */}
      <Dialog open={showMacModal} onOpenChange={setShowMacModal}>
        <DialogContent className="sm:max-w-md bg-[#0f1f35] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl text-white">
              <div className="w-10 h-10 bg-[#00a79d]/20 rounded-xl flex items-center justify-center">
                <Apple className="w-5 h-5 text-[#00a79d]" />
              </div>
              Shkarko për macOS
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-3">
              {/* Intel Mac */}
              <button 
                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#00a79d]/50 hover:bg-white/10 transition-all duration-300"
                onClick={() => {
                  window.open('https://github.com/YOUR_REPO/releases/download/v1.0.0/DataPOS-1.0.0.dmg', '_blank');
                  setShowMacModal(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <FileDown className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium text-white">macOS (Intel)</p>
                    <p className="text-sm text-gray-400">Për Mac me procesor Intel</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-full">~95 MB</span>
              </button>
              
              {/* Apple Silicon */}
              <button 
                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#00a79d]/50 hover:bg-white/10 transition-all duration-300"
                onClick={() => {
                  window.open('https://github.com/YOUR_REPO/releases/download/v1.0.0/DataPOS-1.0.0-arm64.dmg', '_blank');
                  setShowMacModal(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <FileDown className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium text-white">macOS (Apple Silicon)</p>
                    <p className="text-sm text-gray-400">Për Mac M1, M2, M3</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 bg-white/5 px-3 py-1 rounded-full">~92 MB</span>
              </button>
              
              <div className="text-sm text-gray-400 space-y-2 pl-2 mt-4">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00a79d] rounded-full"></span>
                  macOS 10.13 ose më i ri
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00a79d] rounded-full"></span>
                  Kërkon lidhje interneti
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
            onClick={() => setShowMacModal(false)}
          >
            Mbyll
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingDashboard;
