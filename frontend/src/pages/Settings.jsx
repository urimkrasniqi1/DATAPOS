import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import {
  Settings as SettingsIcon,
  Store,
  Bell,
  Shield,
  Database,
  Palette
} from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6" data-testid="settings-page">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cilësimet</h1>
        <p className="text-gray-500">Konfiguro parametrat e sistemit</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#E53935]/10 flex items-center justify-center">
                <Store className="h-5 w-5 text-[#E53935]" />
              </div>
              <div>
                <CardTitle className="text-lg">Informacioni i Biznesit</CardTitle>
                <CardDescription>Të dhënat e kompanisë</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Emri i Biznesit</Label>
              <Input placeholder="t3next Market" data-testid="business-name-input" />
            </div>
            <div className="space-y-2">
              <Label>NIPT</Label>
              <Input placeholder="L12345678A" />
            </div>
            <div className="space-y-2">
              <Label>Adresa</Label>
              <Input placeholder="Rruga, Qyteti" />
            </div>
            <div className="space-y-2">
              <Label>Telefoni</Label>
              <Input placeholder="+383 44 123 456" />
            </div>
            <Button className="bg-[#E53935] hover:bg-[#D32F2F]">
              Ruaj Ndryshimet
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#00B9D7]/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-[#00B9D7]" />
              </div>
              <div>
                <CardTitle className="text-lg">Njoftimet</CardTitle>
                <CardDescription>Konfiguro njoftimet</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Stok i Ulët</p>
                <p className="text-sm text-gray-500">Njoftim kur stoku bie nën 10</p>
              </div>
              <Switch defaultChecked data-testid="low-stock-notification" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Shitje të Reja</p>
                <p className="text-sm text-gray-500">Njoftim për çdo shitje</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Raporte Ditore</p>
                <p className="text-sm text-gray-500">Email me raportin ditor</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Siguria</CardTitle>
                <CardDescription>Cilësimet e sigurisë</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autentifikim 2FA</p>
                <p className="text-sm text-gray-500">Verifikimi me dy faktorë</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sesion i Gjatë</p>
                <p className="text-sm text-gray-500">Qëndro i kyçur për 7 ditë</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Kohëzgjatja e Sesionit (orë)</Label>
              <Input type="number" defaultValue="24" />
            </div>
          </CardContent>
        </Card>

        {/* POS Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <SettingsIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Cilësimet POS</CardTitle>
                <CardDescription>Konfigurimi i arkës</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>TVSH Default (%)</Label>
              <Input type="number" defaultValue="20" data-testid="default-vat-input" />
            </div>
            <div className="space-y-2">
              <Label>Valuta</Label>
              <Input defaultValue="EUR (€)" disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Printo Automatikisht</p>
                <p className="text-sm text-gray-500">Printo faturën pas çdo shitje</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lejo Stok Negativ</p>
                <p className="text-sm text-gray-500">Lejo shitje pa stok</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Database className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Databaza</CardTitle>
                <CardDescription>Backup dhe restore</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Backup Automatik</p>
                <p className="text-sm text-gray-500">Çdo 24 orë</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Krijo Backup
              </Button>
              <Button variant="outline" className="flex-1">
                Restore
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Backup i fundit: {new Date().toLocaleDateString('sq-AL')}
            </p>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center">
                <Palette className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Pamja</CardTitle>
                <CardDescription>Personalizo pamjen</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-[#E53935] text-[#E53935]">
                  E Ndritshme
                </Button>
                <Button variant="outline" className="flex-1">
                  E Errët
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ngjyra Kryesore</Label>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-[#E53935] ring-2 ring-offset-2 ring-[#E53935]" />
                <button className="w-8 h-8 rounded-full bg-blue-500" />
                <button className="w-8 h-8 rounded-full bg-green-500" />
                <button className="w-8 h-8 rounded-full bg-purple-500" />
                <button className="w-8 h-8 rounded-full bg-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
