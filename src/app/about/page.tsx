import React from 'react';
import { AcademicCapIcon, EyeIcon, HeartIcon, UsersIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-0 flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-700 to-blue-400 py-12 flex flex-col items-center mb-8 shadow-lg animate-fade-in">
        <img src="/Logo.jpg" alt="FC Escuela Logo" className="h-28 w-28 rounded-full shadow-lg border-4 border-white mb-4 object-cover" />
        <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg tracking-wide">About Us</h1>
        <p className="text-lg text-blue-100 max-w-2xl text-center font-medium mb-2">FC Escuela is more than just a football club—it's a community united by passion, teamwork, and the pursuit of excellence.</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4 mb-10">
        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">
          <AcademicCapIcon className="h-12 w-12 text-blue-600 mb-2" />
          <h2 className="text-xl font-bold text-blue-700 mb-2">Our Mission</h2>
          <p className="text-gray-600 text-center">To foster a love for football, promote healthy living, and develop future leaders through sport, education, and community engagement.</p>
        </div>
        {/* Vision */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 animate-fade-in-up delay-100">
          <EyeIcon className="h-12 w-12 text-blue-600 mb-2" />
          <h2 className="text-xl font-bold text-blue-700 mb-2">Our Vision</h2>
          <p className="text-gray-600 text-center">To be recognized as a leading football club that nurtures talent, values diversity, and makes a positive impact in our community and beyond.</p>
        </div>
        {/* Values */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 animate-fade-in-up delay-200">
          <HeartIcon className="h-12 w-12 text-blue-600 mb-2" />
          <h2 className="text-xl font-bold text-blue-700 mb-2">Our Values</h2>
          <ul className="list-none text-gray-600 text-center space-y-1">
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
      <div className="bg-blue-50 rounded-2xl shadow-lg p-8 max-w-xl w-full flex flex-col items-center border border-blue-200 animate-fade-in-up delay-300 mb-12">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Contact Us</h2>
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="flex items-center gap-2 text-blue-600 text-lg">
            <EnvelopeIcon className="h-6 w-6" />
            <a href="mailto:info@fcescuela.com" className="underline hover:text-blue-800 transition">info@fcescuela.com</a>
          </div>
          <div className="flex items-center gap-2 text-blue-600 text-lg">
            <PhoneIcon className="h-6 w-6" />
            <span>+1 555-123-4567</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 text-lg">
            <MapPinIcon className="h-6 w-6" />
            <span>123 Main St, City, Country</span>
          </div>
        </div>
      </div>
    </div>
  );
} 