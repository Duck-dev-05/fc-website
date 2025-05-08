'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update Google Translate
    if (typeof window !== 'undefined') {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = language;
        select.dispatchEvent(new Event('change'));
      }
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translations object
const translations = {
  en: {
    // Navigation
    'nav.about': 'About Us',
    'nav.matches': 'Matches',
    'nav.tickets': 'Tickets',
    'nav.news': 'News',
    'nav.team': 'Team',
    'nav.gallery': 'Gallery',
    'nav.login': 'Login',
    'nav.profile': 'Profile',
    'nav.myOrders': 'My Orders',
    'nav.settings': 'Settings',
    'nav.support': 'Support',
    'nav.signOut': 'Sign Out',
    
    // Common
    'common.search': 'Search...',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save Changes',
    'profile.cancel': 'Cancel',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.security': 'Security',
    
    // Footer
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.copyright': 'All rights reserved',
  },
  vi: {
    // Navigation
    'nav.about': 'Về Chúng Tôi',
    'nav.matches': 'Trận Đấu',
    'nav.tickets': 'Vé',
    'nav.news': 'Tin Tức',
    'nav.team': 'Đội Bóng',
    'nav.gallery': 'Thư Viện',
    'nav.login': 'Đăng Nhập',
    'nav.profile': 'Hồ Sơ',
    'nav.myOrders': 'Đơn Hàng',
    'nav.settings': 'Cài Đặt',
    'nav.support': 'Hỗ Trợ',
    'nav.signOut': 'Đăng Xuất',
    
    // Common
    'common.search': 'Tìm kiếm...',
    'common.loading': 'Đang tải...',
    'common.error': 'Đã xảy ra lỗi',
    'common.success': 'Thành công',
    
    // Auth
    'auth.signIn': 'Đăng Nhập',
    'auth.signUp': 'Đăng Ký',
    'auth.email': 'Email',
    'auth.password': 'Mật khẩu',
    'auth.forgotPassword': 'Quên mật khẩu?',
    'auth.rememberMe': 'Ghi nhớ đăng nhập',
    
    // Profile
    'profile.title': 'Hồ Sơ Của Tôi',
    'profile.edit': 'Chỉnh Sửa Hồ Sơ',
    'profile.save': 'Lưu Thay Đổi',
    'profile.cancel': 'Hủy',
    
    // Settings
    'settings.title': 'Cài Đặt',
    'settings.language': 'Ngôn Ngữ',
    'settings.notifications': 'Thông Báo',
    'settings.privacy': 'Quyền Riêng Tư',
    'settings.security': 'Bảo Mật',
    
    // Footer
    'footer.about': 'Giới Thiệu',
    'footer.contact': 'Liên Hệ',
    'footer.privacy': 'Chính Sách Bảo Mật',
    'footer.terms': 'Điều Khoản Sử Dụng',
    'footer.copyright': 'Bảo lưu mọi quyền',
  }
}; 