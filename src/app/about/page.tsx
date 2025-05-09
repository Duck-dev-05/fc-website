import React from 'react';
import { AcademicCapIcon, EyeIcon, HeartIcon, UsersIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-0 flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-700 to-blue-400 py-16 flex flex-col items-center mb-10 shadow-2xl rounded-b-3xl animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/30 via-transparent to-transparent pointer-events-none" />
        <img src="/Logo.jpg" alt="FC Escuela Logo" className="h-32 w-32 rounded-full shadow-xl border-4 border-white mb-4 object-cover z-10" />
        <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg tracking-wide z-10">About Us</h1>
        <p className="text-lg text-blue-100 max-w-2xl text-center font-medium mb-2 z-10">FC Escuela is more than just a football club—it's a community united by passion, teamwork, and the pursuit of excellence.</p>
      </div>

      {/* Divider */}
      <div className="w-full flex justify-center mb-10">
        <div className="h-1 w-32 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 rounded-full opacity-70" />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full px-4 mb-14">
        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up border border-blue-100">
          <AcademicCapIcon className="h-14 w-14 text-blue-600 mb-3" />
          <h2 className="text-2xl font-bold text-blue-700 mb-3">Our Mission</h2>
          <p className="text-gray-600 text-center text-base leading-relaxed">To foster a love for football, promote healthy living, and develop future leaders through sport, education, and community engagement.</p>
        </div>
        {/* Vision */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up delay-100 border border-blue-100">
          <EyeIcon className="h-14 w-14 text-blue-600 mb-3" />
          <h2 className="text-2xl font-bold text-blue-700 mb-3">Our Vision</h2>
          <p className="text-gray-600 text-center text-base leading-relaxed">To be recognized as a leading football club that nurtures talent, values diversity, and makes a positive impact in our community and beyond.</p>
        </div>
        {/* Values */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up delay-200 border border-blue-100">
          <HeartIcon className="h-14 w-14 text-blue-600 mb-3" />
          <h2 className="text-2xl font-bold text-blue-700 mb-3">Our Values</h2>
          <ul className="list-none text-gray-600 text-center space-y-2 text-base">
            <li className="flex items-center justify-center gap-2"><UsersIcon className="h-5 w-5 text-blue-400" />Respect</li>
            <li className="flex items-center justify-center gap-2"><UsersIcon className="h-5 w-5 text-blue-400" />Teamwork</li>
            <li className="flex items-center justify-center gap-2"><UsersIcon className="h-5 w-5 text-blue-400" />Integrity</li>
            <li className="flex items-center justify-center gap-2"><UsersIcon className="h-5 w-5 text-blue-400" />Passion</li>
            <li className="flex items-center justify-center gap-2"><UsersIcon className="h-5 w-5 text-blue-400" />Excellence</li>
            <li className="flex items-center justify-center gap-2"><UsersIcon className="h-5 w-5 text-blue-400" />Community</li>
          </ul>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-blue-50 rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center border border-blue-200 animate-fade-in-up delay-300 mb-16">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Contact Us</h2>
        <div className="flex flex-col gap-5 w-full items-center">
          <div className="flex items-center gap-3 text-blue-600 text-lg">
            <EnvelopeIcon className="h-7 w-7" />
            <a href="mailto:khunhatruongcoma7@gmail.com" className="underline hover:text-blue-800 transition">khunhatruongcoma7@gmail.com</a>
          </div>
          <div className="flex items-center gap-3 text-blue-600 text-lg">
            <PhoneIcon className="h-7 w-7" />
            <span>+84 086-581-7605</span>
          </div>
          <div className="flex items-center gap-3 text-blue-600 text-lg">
            <MapPinIcon className="h-7 w-7" />
            <span>UBND Xã Liên Ninh, Hanoi, Vietnam</span>
          </div>
        </div>
      </div>
    </div>
  );
} 