import React, { useState, useEffect } from 'react';
import { Apartment, BookingInquiry, Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import {
  apiAdminLogin,
  apiAdminVerifyToken,
  apiAdminFetchInquiries,
  apiAdminSaveApartment,
  apiAdminDeleteApartment,
  apiAdminUpdateInquiryStatus,
  apiAdminDeleteInquiry,
  apiAdminSaveSettings,
  apiAdminChangePassword
} from '../services/api';
import {
  Lock,
  LogOut,
  Building,
  CalendarCheck,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Shield,
  Key,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardViewProps {
  currentLang: Language;
  settings: SiteSettings;
  apartments: Apartment[];
  onRefreshData: () => Promise<void>;
  onNavigateHome: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentLang,
  settings,
  apartments,
  onRefreshData,
  onNavigateHome
}) => {
  const t = translations[currentLang];

  // Auth State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return sessionStorage.getItem('gc_admin_token');
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'apartments' | 'inquiries' | 'settings'>('apartments');

  // Inquiries State
  const [inquiries, setInquiries] = useState<BookingInquiry[]>([]);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'contacted' | 'confirmed' | 'cancelled'>('all');
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Apartment Editing State
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [isAddingNewApartment, setIsAddingNewApartment] = useState(false);
  const [apartmentFormData, setApartmentFormData] = useState<Partial<Apartment>>({});

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Password Change State
  const [pwdForm, setPwdForm] = useState({ current: '', next: '' });
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Verify auth on mount
  useEffect(() => {
    if (authToken) {
      apiAdminVerifyToken(authToken).then(isValid => {
        if (!isValid) {
          sessionStorage.removeItem('gc_admin_token');
          setAuthToken(null);
        }
      });
    }
  }, [authToken]);

  // Load inquiries when authenticated
  useEffect(() => {
    if (authToken) {
      loadInquiries();
    }
  }, [authToken]);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const loadInquiries = async () => {
    if (!authToken) return;
    setLoadingInquiries(true);
    try {
      const data = await apiAdminFetchInquiries(authToken);
      setInquiries(data);
    } catch (err) {
      console.error('Failed to load inquiries', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    try {
      const { token } = await apiAdminLogin(passwordInput);
      sessionStorage.setItem('gc_admin_token', token);
      setAuthToken(token);
      setPasswordInput('');
    } catch (err: any) {
      setAuthError(err.message || 'Incorrect password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gc_admin_token');
    setAuthToken(null);
  };

  // Apartment Handlers
  const handleStartAddApartment = () => {
    setApartmentFormData({
      id: `apt-${Date.now()}`,
      slug: `apt-${Date.now()}`,
      title: { en: 'New Coastal Apartment', fr: 'Nouvel Appartement Côtier', ar: 'شقة ساحلية جديدة' },
      shortDescription: { en: 'Furnished apartment near the beach in Briech.', fr: 'Appartement meublé proche de la plage à Briech.', ar: 'شقة مفروشة بالقرب من شاطئ بريش.' },
      description: { en: 'Spacious furnished apartment with equipped kitchen and sunset balcony.', fr: 'Appartement meublé avec cuisine équipée et balcon coucher de soleil.', ar: 'شقة فسيحة مفروشة مع مطبخ مجهز وشرفة مطلة على الغروب.' },
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      floor: 1,
      areaM2: 70,
      pricePerNight: 550,
      pricePerMonth: 7500,
      currency: 'MAD',
      furnished: true,
      seaView: true,
      balcony: true,
      amenities: ['seaView', 'balcony', 'wifi', 'equippedKitchen', 'freeParking'],
      features: {
        en: ['Sunset orientation', 'Equipped kitchen', 'Free parking'],
        fr: ['Vue coucher de soleil', 'Cuisine équipée', 'Parking gratuit'],
        ar: ['إطلالة على الغروب', 'مطبخ مجهز', 'موقف سيارات مجاني']
      },
      images: ['/src/assets/images/apartment_sea_view_1792176294057.jpg'],
      status: 'available',
      featured: false,
      isDemo: false
    });
    setIsAddingNewApartment(true);
    setEditingApartment(null);
  };

  const handleStartEditApartment = (apt: Apartment) => {
    setEditingApartment(apt);
    setApartmentFormData({ ...apt });
    setIsAddingNewApartment(false);
  };

  const handleSaveApartment = async () => {
    if (!authToken) return;
    try {
      await apiAdminSaveApartment(apartmentFormData, authToken, isAddingNewApartment);
      await onRefreshData();
      setEditingApartment(null);
      setIsAddingNewApartment(false);
    } catch (err: any) {
      alert(err.message || 'Error saving apartment');
    }
  };

  const handleDeleteApartment = async (id: string) => {
    if (!authToken) return;
    if (!confirm('Are you sure you want to delete this apartment listing?')) return;

    try {
      await apiAdminDeleteApartment(id, authToken);
      await onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Error deleting apartment');
    }
  };

  // Inquiry Status Handler
  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    if (!authToken) return;
    try {
      await apiAdminUpdateInquiryStatus(id, newStatus, authToken);
      setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status: newStatus as any } : inq)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!authToken) return;
    if (!confirm('Delete this inquiry record?')) return;
    try {
      await apiAdminDeleteInquiry(id, authToken);
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    setSettingsSaving(true);
    setSettingsSuccess(false);

    try {
      await apiAdminSaveSettings(settingsForm, authToken);
      setSettingsSuccess(true);
      await onRefreshData();
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    setPwdMsg(null);

    try {
      await apiAdminChangePassword(pwdForm.current, pwdForm.next, authToken);
      setPwdMsg({ type: 'success', text: 'Password successfully updated!' });
      setPwdForm({ current: '', next: '' });
    } catch (err: any) {
      setPwdMsg({ type: 'error', text: err.message || 'Error updating password' });
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter(i => {
    if (inquiryFilter === 'all') return true;
    return i.status === inquiryFilter;
  });

  // Render Login Screen if not authenticated
  if (!authToken) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-sky-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.adminLoginTitle}
            </h1>
            <p className="text-xs text-slate-500">
              Ghorob Chams Residence · Briech Property Management
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.adminPasswordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-sky-900 hover:bg-sky-950 text-white font-bold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? 'Logging in...' : t.adminLoginBtn}</span>
            </button>
          </form>

          {/* Secure Admin Portal Notice */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-1">
            <span className="text-[11px] text-slate-500 block font-medium">
              Protected Administrator Portal · إقامة غروب شمس
            </span>
            <span className="text-[11px] text-slate-400 block">
              Enter your master password to access apartment listings, guest inquiries, and rates.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-md">
              Admin Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">Briech, Morocco</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t.adminTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {t.navHome}
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.adminLogoutBtn}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('apartments')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'apartments'
              ? 'border-sky-800 text-sky-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{t.adminTabApartments} ({apartments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'inquiries'
              ? 'border-sky-800 text-sky-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>
            {t.adminTabInquiries}
            {inquiries.filter(i => i.status === 'new').length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] rounded-full font-bold">
                {inquiries.filter(i => i.status === 'new').length}
              </span>
            )}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-sky-800 text-sky-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t.adminTabSettings}</span>
        </button>
      </div>

      {/* TAB 1: APARTMENTS MANAGEMENT */}
      {activeTab === 'apartments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-slate-600">
              Manage your apartment inventory, prices, photos, and availability in real time.
            </p>
            <button
              onClick={handleStartAddApartment}
              className="px-4 py-2.5 bg-sky-800 hover:bg-sky-900 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewApartment}</span>
            </button>
          </div>

          {/* Apartment Editor Modal/Form */}
          {(isAddingNewApartment || editingApartment) && (
            <div className="bg-slate-50 rounded-2xl border border-slate-300 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  {isAddingNewApartment ? t.addNewApartment : `${t.editApartment}: ${apartmentFormData.title?.en}`}
                </h3>
                <button
                  onClick={() => {
                    setEditingApartment(null);
                    setIsAddingNewApartment(false);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Titles */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title (EN)</label>
                  <input
                    type="text"
                    value={apartmentFormData.title?.en || ''}
                    onChange={e =>
                      setApartmentFormData({
                        ...apartmentFormData,
                        title: { ...(apartmentFormData.title as any), en: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Titre (FR)</label>
                  <input
                    type="text"
                    value={apartmentFormData.title?.fr || ''}
                    onChange={e =>
                      setApartmentFormData({
                        ...apartmentFormData,
                        title: { ...(apartmentFormData.title as any), fr: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">العنوان (AR)</label>
                  <input
                    type="text"
                    value={apartmentFormData.title?.ar || ''}
                    onChange={e =>
                      setApartmentFormData({
                        ...apartmentFormData,
                        title: { ...(apartmentFormData.title as any), ar: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-arabic"
                  />
                </div>
              </div>

              {/* Pricing, Bedrooms, Bathrooms, Guests */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price/Night (MAD)</label>
                  <input
                    type="number"
                    value={apartmentFormData.pricePerNight || 0}
                    onChange={e =>
                      setApartmentFormData({ ...apartmentFormData, pricePerNight: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price/Month (MAD)</label>
                  <input
                    type="number"
                    value={apartmentFormData.pricePerMonth || 0}
                    onChange={e =>
                      setApartmentFormData({ ...apartmentFormData, pricePerMonth: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={apartmentFormData.bedrooms || 1}
                    onChange={e =>
                      setApartmentFormData({ ...apartmentFormData, bedrooms: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={apartmentFormData.bathrooms || 1}
                    onChange={e =>
                      setApartmentFormData({ ...apartmentFormData, bathrooms: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Guests</label>
                  <input
                    type="number"
                    value={apartmentFormData.maxGuests || 2}
                    onChange={e =>
                      setApartmentFormData({ ...apartmentFormData, maxGuests: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Status & Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Availability Status</label>
                  <select
                    value={apartmentFormData.status || 'available'}
                    onChange={e =>
                      setApartmentFormData({ ...apartmentFormData, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="available">Available (متاحة)</option>
                    <option value="reserved">Reserved (محجوزة)</option>
                    <option value="maintenance">Maintenance (صيانة)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="seaViewChk"
                    checked={apartmentFormData.seaView ?? true}
                    onChange={e =>
                      setApartmentFormData({ ...apartmentFormData, seaView: e.target.checked })
                    }
                    className="rounded text-sky-600"
                  />
                  <label htmlFor="seaViewChk" className="text-xs font-medium text-slate-700">Sea View</label>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="balconyChk"
                    checked={apartmentFormData.balcony ?? true}
                    onChange={e =>
                      setApartmentFormData({ ...apartmentFormData, balcony: e.target.checked })
                    }
                    className="rounded text-sky-600"
                  />
                  <label htmlFor="balconyChk" className="text-xs font-medium text-slate-700">Balcony</label>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="demoChk"
                    checked={apartmentFormData.isDemo ?? false}
                    onChange={e =>
                      setApartmentFormData({ ...apartmentFormData, isDemo: e.target.checked })
                    }
                    className="rounded text-sky-600"
                  />
                  <label htmlFor="demoChk" className="text-xs font-medium text-slate-700">Label as Demo</label>
                </div>
              </div>

              {/* Photos URLs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photos (URLs / Paths)
                </label>
                <div className="space-y-2">
                  {(apartmentFormData.images || []).map((imgUrl, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={e => {
                          const updated = [...(apartmentFormData.images || [])];
                          updated[i] = e.target.value;
                          setApartmentFormData({ ...apartmentFormData, images: updated });
                        }}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (apartmentFormData.images || []).filter((_, idx) => idx !== i);
                          setApartmentFormData({ ...apartmentFormData, images: updated });
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setApartmentFormData({
                        ...apartmentFormData,
                        images: [...(apartmentFormData.images || []), '/src/assets/images/apartment_sea_view_1792176294057.jpg']
                      });
                    }}
                    className="text-xs text-sky-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo URL</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleSaveApartment}
                  className="px-5 py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.saveChanges}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingApartment(null);
                    setIsAddingNewApartment(false);
                  }}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-xs sm:text-sm rounded-xl"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}

          {/* Apartments List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Apartment</th>
                    <th className="px-4 py-3.5">Bed/Bath/Guests</th>
                    <th className="px-4 py-3.5">Price/Night</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apartments.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={apt.images?.[0] || '/src/assets/images/apartment_sea_view_1792176294057.jpg'}
                            alt=""
                            className="w-12 h-9 object-cover rounded-md bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block line-clamp-1">
                              {apt.title.en}
                            </span>
                            <span className="text-[11px] text-slate-500 font-arabic">
                              {apt.title.ar}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {apt.bedrooms} bed · {apt.bathrooms} bath · {apt.maxGuests} guests
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 tabular-nums">
                        {apt.pricePerNight} {apt.currency}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${
                            apt.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'reserved'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEditApartment(apt)}
                            className="p-1.5 text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteApartment(apt.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKING INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setInquiryFilter('all')}
                className={`px-3 py-1.5 rounded-lg ${inquiryFilter === 'all' ? 'bg-white font-bold shadow-xs' : 'text-slate-600'}`}
              >
                All ({inquiries.length})
              </button>
              <button
                onClick={() => setInquiryFilter('new')}
                className={`px-3 py-1.5 rounded-lg ${inquiryFilter === 'new' ? 'bg-white font-bold shadow-xs text-amber-700' : 'text-slate-600'}`}
              >
                New ({inquiries.filter(i => i.status === 'new').length})
              </button>
              <button
                onClick={() => setInquiryFilter('contacted')}
                className={`px-3 py-1.5 rounded-lg ${inquiryFilter === 'contacted' ? 'bg-white font-bold shadow-xs' : 'text-slate-600'}`}
              >
                Contacted ({inquiries.filter(i => i.status === 'contacted').length})
              </button>
              <button
                onClick={() => setInquiryFilter('confirmed')}
                className={`px-3 py-1.5 rounded-lg ${inquiryFilter === 'confirmed' ? 'bg-white font-bold shadow-xs text-emerald-700' : 'text-slate-600'}`}
              >
                Confirmed ({inquiries.filter(i => i.status === 'confirmed').length})
              </button>
            </div>

            <button
              onClick={loadInquiries}
              className="text-xs text-sky-800 font-semibold hover:underline"
            >
              Refresh Inquiries
            </button>
          </div>

          {loadingInquiries ? (
            <p className="text-xs text-slate-500 py-8 text-center">Loading inquiries...</p>
          ) : filteredInquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
              {t.noInquiriesYet}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInquiries.map(inq => {
                const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
                const directReplyMsg = encodeURIComponent(
                  `Bonjour ${inq.guestName}, suite à votre demande de réservation (Réf: ${inq.id}) pour ${inq.apartmentTitle} du ${inq.checkIn} au ${inq.checkOut} à la Résidence Ghorob Chams Briech, je suis à votre disposition.`
                );

                return (
                  <div
                    key={inq.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md">
                          {inq.id}
                        </span>
                        <span className="font-bold text-slate-900 text-base">
                          {inq.guestName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Status:</span>
                        <select
                          value={inq.status}
                          onChange={e => handleUpdateInquiryStatus(inq.id, e.target.value)}
                          className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                        >
                          <option value="new">New (جديد)</option>
                          <option value="contacted">Contacted (تم التواصل)</option>
                          <option value="confirmed">Confirmed (مؤكد)</option>
                          <option value="cancelled">Cancelled (ملغى)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-700">
                      <div>
                        <span className="text-slate-500 text-xs block">Apartment:</span>
                        <span className="font-semibold text-slate-900">{inq.apartmentTitle}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs block">Dates & Duration:</span>
                        <span>
                          {inq.checkIn} → {inq.checkOut} ({inq.nightsCount} nights · {inq.guestsCount} guests)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-xs block">Estimated Total:</span>
                        <span className="font-bold text-sky-900 tabular-nums">
                          {inq.estimatedTotal} {inq.currency}
                        </span>
                      </div>
                    </div>

                    {inq.message && (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 italic">
                        "{inq.message}"
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-600 font-mono">
                        Phone: {inq.phone}
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${directReplyMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Guest</span>
                        </a>

                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SETTINGS MANAGEMENT */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact & WhatsApp Configuration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Settings className="w-4 h-4 text-sky-700" />
              <span>Website & WhatsApp Contact Settings</span>
            </h3>

            {settingsSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{t.settingsSavedSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.whatsappNumberConfigLabel}
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.whatsappNumber}
                  onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  placeholder="212661000000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Phone Format
                </label>
                <input
                  type="text"
                  value={settingsForm.contactPhone}
                  onChange={e => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                  placeholder="+212 661 00 00 00"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.contactEmailLabel}
                </label>
                <input
                  type="email"
                  value={settingsForm.contactEmail}
                  onChange={e => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Check-in Time</label>
                  <input
                    type="text"
                    value={settingsForm.checkInTime}
                    onChange={e => setSettingsForm({ ...settingsForm, checkInTime: e.target.value })}
                    placeholder="15:00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Check-out Time</label>
                  <input
                    type="text"
                    value={settingsForm.checkOutTime}
                    onChange={e => setSettingsForm({ ...settingsForm, checkOutTime: e.target.value })}
                    placeholder="11:00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={settingsSaving}
                className="w-full py-2.5 bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors"
              >
                {settingsSaving ? 'Saving...' : t.saveSettingsBtn}
              </button>
            </form>
          </div>

          {/* Change Administrator Password */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-600" />
              <span>Change Administrator Password</span>
            </h3>

            {pwdMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  pwdMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {pwdMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{pwdMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={pwdForm.current}
                  onChange={e => setPwdForm({ ...pwdForm, current: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={pwdForm.next}
                  onChange={e => setPwdForm({ ...pwdForm, next: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
