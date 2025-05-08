// Add this at the very top of the file
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-blue-50 via-white to-white border-t mt-12 py-8 px-4 text-center shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.jpg" alt="FC ESCUELA Logo" width={40} height={40} className="rounded-full shadow" />
          <span className="text-blue-700 font-extrabold text-lg tracking-wide">FC ESCUELA</span>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">About</a>
          <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Contact</a>
          <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy</a>
        </div>
        <div className="flex gap-4">
          <a href="https://www.facebook.com/profile.php?id=100083085867194" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/></svg>
          </a>
          <a href="https://www.youtube.com/@NhaTruongKhu" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-red-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a2.994 2.994 0 0 0-2.108-2.117C19.379 3.5 12 3.5 12 3.5s-7.379 0-9.39.569A2.994 2.994 0 0 0 .502 6.186C0 8.2 0 12 0 12s0 3.8.502 5.814a2.994 2.994 0 0 0 2.108 2.117C4.621 20.5 12 20.5 12 20.5s7.379 0 9.39-.569a2.994 2.994 0 0 0 2.108-2.117C24 15.8 24 12 24 12s0-3.8-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>
        <div className="text-gray-500 text-xs md:text-sm mt-4 md:mt-0 w-full md:w-auto text-center md:text-right">
          © {new Date().getFullYear()} FC ESCUELA. All rights reserved.
        </div>
      </div>
      {/* Google Translate Widget */}
      <div id="google_translate_element" className="mt-6 flex justify-center"></div>
    </footer>
  )
}

