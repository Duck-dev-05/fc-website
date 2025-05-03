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
          <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/></svg>
          </a>
          <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a6.25 6.25 0 1 1 0 12.5a6.25 6.25 0 0 1 0-12.5zm0 1.5a4.75 4.75 0 1 0 0 9.5a4.75 4.75 0 0 0 0-9.5zm6.25 1.25a1 1 0 1 1-2 0a1 1 0 0 1 2 0z"/></svg>
          </a>
        </div>
        <div className="text-gray-500 text-xs md:text-sm mt-4 md:mt-0 w-full md:w-auto text-center md:text-right">
          © {new Date().getFullYear()} FC ESCUELA. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 