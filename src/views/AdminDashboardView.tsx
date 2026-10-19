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
  apiAdminChangePassword,
  apiAdminUploadImage
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
  ExternalLink,
  Camera,
  Star,
  Upload,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

// Client-side image compression for mobile/Android cameras (resizes high-res phone photos to fast web JPEG)
async function compressImageFile(file: File, maxWidth = 1920, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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
  const [inquiryActionMsg, setInquiryActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deletingInquiryId, setDeletingInquiryId] = useState<string | null>(null);
  const [confirmDeleteInquiryId, setConfirmDeleteInquiryId] = useState<string | null>(null);

  // Apartment Editing State
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [isAddingNewApartment, setIsAddingNewApartment] = useState(false);
  const [apartmentFormData, setApartmentFormData] = useState<Partial<Apartment>>({});

  // Apartment Photo Management State
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null);
  const [replacingPhotoIndex, setReplacingPhotoIndex] = useState<number | null>(null);
  const [manualPhotoUrl, setManualPhotoUrl] = useState('');
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);
  const [apartmentSaveSuccessMsg, setApartmentSaveSuccessMsg] = useState<string | null>(null);

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
      setApartmentSaveSuccessMsg(
        currentLang === 'ar'
          ? 'تم حفظ وتحديث بيانات وصور الشقة بنجاح!'
          : 'Apartment details and photos successfully saved!'
      );
      setTimeout(() => setApartmentSaveSuccessMsg(null), 4000);
      setEditingApartment(null);
      setIsAddingNewApartment(false);
    } catch (err: any) {
      alert(err.message || 'Error saving apartment');
    }
  };

  // Photo Handlers (Supports mobile Android camera, gallery, replace, cover, reorder)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !authToken) return;

    setUploadingPhotos(true);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgressText(
          currentLang === 'ar'
            ? `جارٍ ضغط ورفع الصورة ${i + 1} من ${files.length}...`
            : `Processing & uploading photo ${i + 1} of ${files.length}...`
        );
        const compressedBase64 = await compressImageFile(file);
        const res = await apiAdminUploadImage(compressedBase64, file.name, authToken);
        if (res.url) {
          newUrls.push(res.url);
        }
      }

      setApartmentFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls]
      }));
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo');
    } finally {
      setUploadingPhotos(false);
      setUploadProgressText(null);
      e.target.value = '';
    }
  };

  const handleReplacePhoto = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authToken) return;

    setReplacingPhotoIndex(index);
    try {
      const compressedBase64 = await compressImageFile(file);
      const res = await apiAdminUploadImage(compressedBase64, file.name, authToken);
      if (res.url) {
        setApartmentFormData(prev => {
          const current = [...(prev.images || [])];
          current[index] = res.url;
          return { ...prev, images: current };
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to replace photo');
    } finally {
      setReplacingPhotoIndex(null);
      e.target.value = '';
    }
  };

  const handleSetCoverPhoto = (index: number) => {
    if (index === 0) return;
    setApartmentFormData(prev => {
      const images = [...(prev.images || [])];
      const [chosenCover] = images.splice(index, 1);
      return {
        ...prev,
        images: [chosenCover, ...images]
      };
    });
  };

  const handleDeletePhoto = (index: number) => {
    setApartmentFormData(prev => {
      const images = [...(prev.images || [])];
      images.splice(index, 1);
      return { ...prev, images };
    });
  };

  const handleMovePhoto = (from: number, to: number) => {
    setApartmentFormData(prev => {
      const images = [...(prev.images || [])];
      if (to < 0 || to >= images.length) return prev;
      const [item] = images.splice(from, 1);
      images.splice(to, 0, item);
      return { ...prev, images };
    });
  };

  const handleAddManualUrl = () => {
    if (!manualPhotoUrl.trim()) return;
    setApartmentFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), manualPhotoUrl.trim()]
    }));
    setManualPhotoUrl('');
    setShowManualUrlInput(false);
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
    if (!authToken) {
      setInquiryActionMsg({
        type: 'error',
        text: currentLang === 'ar' ? 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً.' : 'Session expired. Please log in again.'
      });
      return;
    }

    setDeletingInquiryId(id);
    setInquiryActionMsg(null);

    try {
      await apiAdminDeleteInquiry(id, authToken);
      setInquiries(prev => prev.filter(i => i.id !== id));
      setConfirmDeleteInquiryId(null);
      setInquiryActionMsg({
        type: 'success',
        text: currentLang === 'ar' ? `تم حذف الحجز (${id}) نهائياً بنجاح.` : `Booking inquiry (${id}) deleted successfully.`
      });
      setTimeout(() => setInquiryActionMsg(null), 4000);
    } catch (err: any) {
      setInquiryActionMsg({
        type: 'error',
        text: err.message || (currentLang === 'ar' ? 'فشل حذف الحجز.' : 'Failed to delete inquiry.')
      });
    } finally {
      setDeletingInquiryId(null);
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

              {/* Apartment Photos & Cover Management */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-900">
                      {currentLang === 'ar' ? 'صور الشقة وإدارة صورة الغلاف' : 'Apartment Photos & Cover Gallery'}
                    </label>
                    <span className="text-[11px] text-slate-500 block">
                      {currentLang === 'ar'
                        ? 'الصورة الأولى (#1) هي الغلاف الرئيسي المعروض للزوار على الموقع. يمكنك التقاط صور من الكاميرا أو الألبوم.'
                        : 'The first photo (#1) is the main cover shown on the public site. You can snap with your camera or select from gallery.'}
                    </span>
                  </div>

                  {/* Android Phone & Desktop Upload Button */}
                  <label
                    className={`cursor-pointer px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 ${
                      uploadingPhotos ? 'opacity-70 pointer-events-none' : ''
                    }`}
                  >
                    {uploadingPhotos ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    <span>
                      {uploadingPhotos
                        ? (currentLang === 'ar' ? 'جارٍ المعالجة والرفع...' : 'Processing...')
                        : (currentLang === 'ar' ? 'رفع صور من الهاتف / الحاسوب' : 'Upload Photos (Camera / Gallery)')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingPhotos}
                    />
                  </label>
                </div>

                {uploadProgressText && (
                  <div className="p-2.5 bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-xl flex items-center gap-2 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0 text-sky-600" />
                    <span>{uploadProgressText}</span>
                  </div>
                )}

                {/* Visual Photos Grid */}
                {(apartmentFormData.images || []).length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
                    <ImageIcon className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-xs text-slate-600 font-medium">
                      {currentLang === 'ar' ? 'لا توجد صور لهذه الشقة حتى الآن.' : 'No photos added for this apartment yet.'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {currentLang === 'ar'
                        ? 'اضغط على زر الرفع أعلاه لاختيار صور من هاتفك الذكي.'
                        : 'Tap the upload button above to add photos directly from your phone.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(apartmentFormData.images || []).map((imgUrl, i) => {
                      const isCover = i === 0;
                      const isReplacing = replacingPhotoIndex === i;

                      return (
                        <div
                          key={i}
                          className={`group relative bg-white border-2 rounded-xl overflow-hidden shadow-xs transition-all flex flex-col ${
                            isCover ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Image Preview Thumbnail */}
                          <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                            <img
                              src={imgUrl}
                              alt={`Photo ${i + 1}`}
                              className="w-full h-full object-cover"
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  '/src/assets/images/apartment_sea_view_1792176294057.jpg';
                              }}
                            />

                            {/* Cover / Position Badges */}
                            <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                              <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono rounded font-bold">
                                #{i + 1}
                              </span>
                              {isCover && (
                                <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded flex items-center gap-1 shadow-xs">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>{currentLang === 'ar' ? 'الغلاف' : 'Cover'}</span>
                                </span>
                              )}
                            </div>

                            {/* Move Left / Right Arrows */}
                            <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {i > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMovePhoto(i, i - 1)}
                                  className="p-1 bg-white/95 hover:bg-white text-slate-700 rounded shadow-xs"
                                  title={currentLang === 'ar' ? 'تقديم الصورة' : 'Move previous'}
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}
                              {i < (apartmentFormData.images || []).length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMovePhoto(i, i + 1)}
                                  className="p-1 bg-white/95 hover:bg-white text-slate-700 rounded shadow-xs"
                                  title={currentLang === 'ar' ? 'تأخير الصورة' : 'Move next'}
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Photo Action Bar */}
                          <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                            {!isCover ? (
                              <button
                                type="button"
                                onClick={() => handleSetCoverPhoto(i)}
                                className="text-amber-800 hover:text-amber-900 font-bold hover:underline flex items-center gap-1"
                                title={currentLang === 'ar' ? 'تعيين كغلاف رئيسي' : 'Set as main cover'}
                              >
                                <Star className="w-3 h-3" />
                                <span>{currentLang === 'ar' ? 'تعيين كغلاف' : 'Set Cover'}</span>
                              </button>
                            ) : (
                              <span className="text-amber-800 font-bold flex items-center gap-1 text-[10px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>{currentLang === 'ar' ? 'الغلاف الرئيسي' : 'Main Cover'}</span>
                              </span>
                            )}

                            <div className="flex items-center gap-1.5">
                              {/* Replace Button with hidden file input */}
                              <label
                                className="cursor-pointer text-sky-700 hover:text-sky-900 p-1 hover:bg-sky-50 rounded"
                                title={currentLang === 'ar' ? 'استبدال هذه الصورة' : 'Replace photo'}
                              >
                                {isReplacing ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5" />
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => handleReplacePhoto(i, e)}
                                  className="hidden"
                                  disabled={isReplacing}
                                />
                              </label>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(i)}
                                className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                                title={currentLang === 'ar' ? 'حذف الصورة' : 'Delete photo'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Optional Manual URL Input */}
                <div className="pt-1">
                  {!showManualUrlInput ? (
                    <button
                      type="button"
                      onClick={() => setShowManualUrlInput(true)}
                      className="text-[11px] text-slate-500 hover:text-sky-800 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{currentLang === 'ar' ? 'أو إضافة رابط صورة خارجي (URL)' : 'Or add external image URL'}</span>
                    </button>
                  ) : (
                    <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={manualPhotoUrl}
                        onChange={e => setManualPhotoUrl(e.target.value)}
                        placeholder="https://example.com/apartment_view.jpg"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddManualUrl}
                        className="px-3 py-1.5 bg-sky-800 hover:bg-sky-900 text-white rounded-lg text-xs font-bold"
                      >
                        {currentLang === 'ar' ? 'إضافة' : 'Add'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowManualUrlInput(false);
                          setManualPhotoUrl('');
                        }}
                        className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs"
                      >
                        {currentLang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  )}
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

          {/* Apartment Save Success Notification */}
          {apartmentSaveSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium rounded-xl flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{apartmentSaveSuccessMsg}</span>
              </div>
              <button
                onClick={() => setApartmentSaveSuccessMsg(null)}
                className="text-slate-400 hover:text-slate-600 font-bold px-1 text-sm"
              >
                ✕
              </button>
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

          {/* Inquiry Action Feedback Message */}
          {inquiryActionMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between gap-3 border shadow-xs transition-all ${
                inquiryActionMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {inquiryActionMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{inquiryActionMsg.text}</span>
              </div>
              <button
                onClick={() => setInquiryActionMsg(null)}
                className="text-slate-400 hover:text-slate-600 font-bold px-1 text-sm"
              >
                ✕
              </button>
            </div>
          )}

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

                        {confirmDeleteInquiryId === inq.id ? (
                          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded-xl">
                            <span className="text-[11px] font-semibold text-red-800">
                              {currentLang === 'ar' ? 'تأكيد الحذف؟' : 'Confirm?'}
                            </span>
                            <button
                              disabled={deletingInquiryId === inq.id}
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold transition-colors disabled:opacity-50"
                            >
                              {deletingInquiryId === inq.id
                                ? (currentLang === 'ar' ? 'جارٍ الحذف...' : 'Deleting...')
                                : (currentLang === 'ar' ? 'نعم، احذف' : 'Yes, Delete')}
                            </button>
                            <button
                              disabled={deletingInquiryId === inq.id}
                              onClick={() => setConfirmDeleteInquiryId(null)}
                              className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[11px] transition-colors"
                            >
                              {currentLang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteInquiryId(inq.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={currentLang === 'ar' ? 'حذف هذا الحجز' : 'Delete this inquiry'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
