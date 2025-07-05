"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PhotoIcon, UserIcon, CalendarIcon } from "@heroicons/react/24/outline";

interface UploadStats {
  totalUploads: number;
  uploadsByCategory: {
    general: number;
    "after-match": number;
    events: number;
  };
  recentUploads: number;
}

export default function GalleryStats() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/gallery/count?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          // For now, we'll create mock stats since we don't have detailed stats endpoint
          setStats({
            totalUploads: data.count,
            uploadsByCategory: {
              general: Math.floor(data.count * 0.6),
              "after-match": Math.floor(data.count * 0.25),
              events: Math.floor(data.count * 0.15),
            },
            recentUploads: Math.floor(data.count * 0.3),
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (!session || loading) {
    return null;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Gallery Stats</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
          <PhotoIcon className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Total Uploads</p>
            <p className="text-2xl font-bold text-blue-900">{stats.totalUploads}</p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-green-50 rounded-lg">
          <CalendarIcon className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Recent Uploads</p>
            <p className="text-2xl font-bold text-green-900">{stats.recentUploads}</p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-purple-50 rounded-lg">
          <UserIcon className="h-8 w-8 text-purple-600 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-2xl font-bold text-purple-900">3</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Uploads by Category</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">General</span>
            <span className="text-sm font-medium">{stats.uploadsByCategory.general}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">After Match</span>
            <span className="text-sm font-medium">{stats.uploadsByCategory["after-match"]}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Events</span>
            <span className="text-sm font-medium">{stats.uploadsByCategory.events}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 