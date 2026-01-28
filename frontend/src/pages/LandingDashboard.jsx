import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Apple, Globe, Download, X, HardDrive, FileDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const LandingDashboard = () => {
  const navigate = useNavigate();
  const [showWindowsModal, setShowWindowsModal] = useState(false);
  const [showMacModal, setShowMacModal] = useState(false);

  const handleUseOnline = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <img 
            src="https://customer-assets.emergentagent.com/job_retailsys-1/artifacts/9i1h1bxb_logo%20icon.png" 
            alt="DataPOS" 
            className="h-12 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Zgjidh mënyrën si dëshiron të përdorësh POS-in
            </h1>
            <p className="text-lg text-gray-500">
              I shpejtë, i sigurt dhe i përshtatshëm për biznesin tënd
            </p>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Windows Button */}
            <button
              onClick={() => setShowWindowsModal(true)}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#00a79d] transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-gray-100 group-hover:bg-[#E0F7FA] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                <Monitor className="w-10 h-10 text-gray-600 group-hover:text-[#00a79d] transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Shkarko për Windows
              </h3>
              <p className="text-gray-500 text-sm">
                Aplikacioni desktop për Windows
              </p>
            </button>

            {/* macOS Button */}
            <button
              onClick={() => setShowMacModal(true)}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#00a79d] transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-gray-100 group-hover:bg-[#E0F7FA] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                <Apple className="w-10 h-10 text-gray-600 group-hover:text-[#00a79d] transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Shkarko për macOS
              </h3>
              <p className="text-gray-500 text-sm">
                Aplikacioni desktop për Mac
              </p>
            </button>

            {/* Use Online Button */}
            <button
              onClick={handleUseOnline}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:border-[#00a79d] transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-gray-100 group-hover:bg-[#E0F7FA] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                <Globe className="w-10 h-10 text-gray-600 group-hover:text-[#00a79d] transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Përdor Online
              </h3>
              <p className="text-gray-500 text-sm">
                Hap direkt në browser
              </p>
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm">
              Zgjidhni platformën që përshtatet më mirë me nevojat tuaja
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} DataPOS. Të gjitha të drejtat e rezervuara.
        </p>
      </footer>

      {/* Windows Download Modal */}
      <Dialog open={showWindowsModal} onOpenChange={setShowWindowsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Monitor className="w-6 h-6 text-[#00a79d]" />
              Shkarko për Windows
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Windows 64-bit</p>
                    <p className="text-sm text-gray-500">Versioni 1.0.0</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">~85 MB</span>
              </div>
              
              <div className="text-sm text-gray-500 space-y-1">
                <p>• Windows 10 ose më i ri</p>
                <p>• Kërkon lidhje interneti</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowWindowsModal(false)}
            >
              Anulo
            </Button>
            <Button
              className="flex-1 bg-[#00a79d] hover:bg-[#008f86] text-white"
              onClick={() => {
                // Replace with actual download link
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Apple className="w-6 h-6 text-[#00a79d]" />
              Shkarko për macOS
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-3">
              {/* Intel Mac */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  window.open('https://github.com/YOUR_REPO/releases/download/v1.0.0/DataPOS-1.0.0.dmg', '_blank');
                  setShowMacModal(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <FileDown className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">macOS (Intel)</p>
                    <p className="text-sm text-gray-500">Për Mac me procesor Intel</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">~95 MB</span>
              </div>
              
              {/* Apple Silicon */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  window.open('https://github.com/YOUR_REPO/releases/download/v1.0.0/DataPOS-1.0.0-arm64.dmg', '_blank');
                  setShowMacModal(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <FileDown className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">macOS (Apple Silicon)</p>
                    <p className="text-sm text-gray-500">Për Mac M1, M2, M3</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">~92 MB</span>
              </div>
              
              <div className="text-sm text-gray-500 space-y-1 mt-4">
                <p>• macOS 10.13 ose më i ri</p>
                <p>• Kërkon lidhje interneti</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
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
