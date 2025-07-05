"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { 
  LockClosedIcon, 
  PhotoIcon, 
  TrashIcon, 
  UserIcon, 
  CloudArrowUpIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon,
  SparklesIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import GalleryStats from '@/components/GalleryStats';

// Curated gallery images - only the best quality ones
const curatedImages = [
  "/images/Team.jpg",
  "/images/476090611_607359335376923_6698951151074247924_n.jpg",
  "/images/475969919_607359408710249_8516488549860876522_n.jpg",
  "/images/476169254_607359535376903_7286281109057041354_n.jpg",
  "/images/475780202_607359382043585_3034294918827921029_n.jpg",
  "/images/475980485_607359355376921_1824534271337068094_n.jpg",
  "/images/475155703_601036529342537_8421055415684565978_n.jpg",
  "/images/475053085_601036852675838_2402443290344397682_n.jpg",
  "/images/475144344_601036842675839_4404505197731612851_n.jpg",
  "/images/474779314_601036762675847_3541346204575328241_n.jpg",
  "/images/474850664_601036476009209_4739041144709341589_n.jpg",
  "/images/474795441_601036752675848_3189221237306170939_n.jpg",
  "/images/474866685_601036869342503_8599911458419294757_n.jpg",
  "/images/474682136_601036496009207_8639658317074689251_n.jpg",
  "/images/475142254_601036782675845_6634806078986385702_n.jpg",
  "/images/474738817_601036732675850_1375881422591087309_n.jpg",
  "/images/475195562_601036736009183_6750024295008285303_n.jpg",
  "/images/475142209_601036779342512_1060912070919921037_n.jpg",
  "/images/474765961_601036846009172_4953905943138151340_n.jpg",
  "/images/474956406_601036816009175_6723609090066033292_n.jpg",
  "/images/474626647_601036489342541_1279715244984058606_n.jpg",
  "/images/474623786_601036502675873_417465206065548771_n.jpg",
  "/images/474074724_598396812939842_962371998718308862_n.jpg",
  "/images/474256181_598396836273173_5250701498619979485_n.jpg",
  "/images/474007589_598396856273171_2111071297923646773_n.jpg",
  "/images/474096011_598395709606619_2962262759380864078_n.jpg",
  "/images/474071584_598395686273288_3457685561741518136_n.jpg",
  "/images/485143849_641439991968857_8166740877775122323_n.jpg",
  "/images/481140462_626892440090279_6752106142656858356_n.jpg",
  "/images/485062990_641440001968856_1788598474458634496_n.jpg",
  "/images/485063030_641440021968854_1074023557985153228_n.jpg",
  "/images/488908023_653579827421540_5935849463958993947_n.jpg",
  "/images/490592059_658446380268218_23591485498949886_n.jpg",
  "/images/490848064_658446366934886_1742058043239402373_n.jpg",
  "/images/490177832_658446420268214_347614883182770774_n.jpg",
  "/images/490443846_658446426934880_5562347315263916673_n.jpg",
  "/images/490647100_658446473601542_4306727507599707816_n.jpg",
  "/images/494353075_672776775501845_4965141204955899499_n.jpg",
  "/images/494314495_672776768835179_1497338477261864599_n.jpg",
  "/images/495013016_672776815501841_6112291942365215539_n.jpg",
  "/images/494644807_672776822168507_3210103914200477472_n.jpg",
  "/images/DSC_0014.jpg",
  "/images/DSC_0013.jpg",
  "/images/DSC_0012.jpg",
  "/images/DSC_0011.jpg",
  "/images/DSC_0010.jpg",
  "/images/DSC_0009.jpg",
  "/images/DSC_0008.jpg",
  "/images/DSC_0007.jpg",
];

const afterMatchImages = [
  "/images/After Match/481302045_623994717046718_6367270203417339327_n.jpg",
  "/images/After Match/480980877_623996403713216_5920153029135494897_n.jpg",
  "/images/After Match/480988725_623995013713355_2013348546939563105_n.jpg",
];

const eventsImages = [
  "/images/Events/481276435_623998250379698_8736554557242586485_n.jpg",
  "/images/Events/481262373_623998213713035_7248181858664384245_n.jpg",
  "/images/Events/475506305_607359298710260_2334271900033905389_n.jpg",
  "/images/Events/476208910_607359245376932_3593847638994941124_n.jpg",
  "/images/Events/475792307_607359232043600_2943844154310647044_n.jpg",
  "/images/Events/475951713_607359278710262_1054903980676307615_n.jpg",
  "/images/Events/475839465_607359168710273_3036126754752063146_n.jpg",
  "/images/Events/475698443_607359302043593_3511584171185863671_n.jpg",
];

interface UserUpload {
  id: string;
  filename: string;
  path: string;
  category: string;
  uploadedAt: string;
  uploadedBy: {
    name: string | null;
    email: string | null;
  };
  isCurated?: boolean;
}

export default function GalleryPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState(0);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [modalDesc, setModalDesc] = useState<string>("");
  const [modalIdx, setModalIdx] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [userUploads, setUserUploads] = useState<UserUpload[]>([]);
  const [allUploads, setAllUploads] = useState<UserUpload[]>([]);
  const [allImages, setAllImages] = useState<UserUpload[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { 
      label: "All Images", 
      images: [], 
      isAllImages: true,
      icon: EyeIcon,
      description: "Browse all gallery images"
    },
    { 
      label: "After Match", 
      images: afterMatchImages,
      icon: CalendarIcon,
      description: "Post-match celebrations"
    },
    { 
      label: "Events", 
      images: eventsImages,
      icon: SparklesIcon,
      description: "Special events and gatherings"
    },
    { 
      label: "My Uploads", 
      images: [], 
      isUserUploads: true,
      icon: UserIcon,
      description: "Your uploaded images"
    },
    ...(isAdmin ? [{ 
      label: "All Uploads", 
      images: [], 
      isAllUploads: true,
      icon: UsersIcon,
      description: "Manage all user uploads"
    }] : []),
  ];

  const currentTab = tabs[activeTab];
  const images = currentTab.images || [];

  // Handle hash fragment to switch to My Uploads tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#my-uploads') {
        // Find the index of the My Uploads tab
        const myUploadsTabIndex = tabs.findIndex(tab => tab.isUserUploads);
        if (myUploadsTabIndex !== -1) {
          setActiveTab(myUploadsTabIndex);
        }
      }
    }
  }, []);

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/auth/check-admin")
        .then(res => res.json())
        .then(data => {
          setIsAdmin(data.isAdmin);
        })
        .catch(console.error);
    }
  }, [session]);

  // Fetch upload count when user is authenticated
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/gallery/count?userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => setUploadCount(data.count))
        .catch(console.error);
    }
  }, [session]);

  // Fetch all images when on all images tab
  useEffect(() => {
    if (currentTab.isAllImages) {
      setLoadingUploads(true);
      fetch(`/api/gallery/all-uploads?category=${selectedCategory}`)
        .then(res => res.json())
        .then(data => {
          if (data.images) {
            setAllImages(data.images);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingUploads(false));
    }
  }, [currentTab.isAllImages, selectedCategory]);

  // Fetch user uploads when on user uploads tab
  useEffect(() => {
    if (currentTab.isUserUploads && session?.user?.id) {
      setLoadingUploads(true);
      fetch(`/api/gallery/user-uploads?category=${selectedCategory}`)
        .then(res => res.json())
        .then(data => {
          if (data.images) {
            setUserUploads(data.images);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingUploads(false));
    }
  }, [currentTab.isUserUploads, session, selectedCategory]);

  // Fetch all uploads when on admin tab
  useEffect(() => {
    if (currentTab.isAllUploads && isAdmin) {
      setLoadingUploads(true);
      fetch(`/api/gallery/all-uploads?category=${selectedCategory}`)
        .then(res => res.json())
        .then(data => {
          if (data.images) {
            setAllUploads(data.images);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingUploads(false));
    }
  }, [currentTab.isAllUploads, isAdmin, selectedCategory]);

  const handleImageClick = (src: string, idx: number, desc?: string) => {
    setModalImg(src);
    setModalIdx(idx);
    setModalDesc(desc || "Gallery Photo");
    setModalOpen(true);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch("/api/gallery/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      // Refresh the uploads
      if (currentTab.isUserUploads) {
        const res = await fetch(`/api/gallery/user-uploads?category=${selectedCategory}`);
        const data = await res.json();
        if (data.images) {
          setUserUploads(data.images);
        }
      } else if (currentTab.isAllUploads) {
        const res = await fetch(`/api/gallery/all-uploads?category=${selectedCategory}`);
        const data = await res.json();
        if (data.images) {
          setAllUploads(data.images);
        }
      } else if (currentTab.isAllImages) {
        const res = await fetch(`/api/gallery/all-uploads?category=${selectedCategory}`);
        const data = await res.json();
        if (data.images) {
          setAllImages(data.images);
        }
      }

      // Update upload count
      setUploadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  // Keyboard and focus trap
  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "ArrowLeft" && modalIdx > 0) showPrev();
      if (currentTab.isAllImages) {
        const allImagesCombined = [
          ...curatedImages.map((src, idx) => ({
            id: `curated-${idx}`,
            path: src,
            category: 'curated',
            uploadedAt: new Date().toISOString(),
            uploadedBy: { name: 'Official Gallery', email: null },
            isCurated: true
          })),
          ...afterMatchImages.map((src, idx) => ({
            id: `after-match-${idx}`,
            path: src,
            category: 'after-match',
            uploadedAt: new Date().toISOString(),
            uploadedBy: { name: 'Official Gallery', email: null },
            isCurated: true
          })),
          ...eventsImages.map((src, idx) => ({
            id: `events-${idx}`,
            path: src,
            category: 'events',
            uploadedAt: new Date().toISOString(),
            uploadedBy: { name: 'Official Gallery', email: null },
            isCurated: true
          })),
          ...allImages
        ];
        if (e.key === "ArrowRight" && modalIdx < allImagesCombined.length - 1) showNext();
      } else {
        if (e.key === "ArrowRight" && modalIdx < images.length - 1) showNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    // Focus trap
    const focusable = modalRef.current?.querySelectorAll<HTMLElement>("button, [tabindex]:not([tabindex='-1'])");
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !focusable) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first?.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", trap);
    first?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", trap);
    };
  }, [modalOpen, modalIdx, images.length]);

  const showPrev = () => {
    if (modalIdx > 0) {
      const prevIdx = modalIdx - 1;
      if (currentTab.isAllImages) {
        const allImagesCombined = [
          ...curatedImages.map((src, idx) => ({
            id: `curated-${idx}`,
            path: src,
            category: 'curated',
            uploadedAt: new Date().toISOString(),
            uploadedBy: { name: 'Official Gallery', email: null },
            isCurated: true
          })),
          ...afterMatchImages.map((src, idx) => ({
            id: `after-match-${idx}`,
            path: src,
            category: 'after-match',
            uploadedAt: new Date().toISOString(),
            uploadedBy: { name: 'Official Gallery', email: null },
            isCurated: true
          })),
          ...eventsImages.map((src, idx) => ({
            id: `events-${idx}`,
            path: src,
            category: 'events',
            uploadedAt: new Date().toISOString(),
            uploadedBy: { name: 'Official Gallery', email: null },
            isCurated: true
          })),
          ...allImages
        ];
        setModalImg(allImagesCombined[prevIdx].path);
        setModalIdx(prevIdx);
        setModalDesc(allImagesCombined[prevIdx].isCurated ? "Official Gallery Image" : `Uploaded by ${allImagesCombined[prevIdx].uploadedBy.name || 'Unknown'}`);
      } else {
        setModalImg(images[prevIdx]);
        setModalIdx(prevIdx);
        setModalDesc(activeTab === 0 && prevIdx === 0 && images[prevIdx] === "/images/Team.jpg" ? "Our Team" : "Gallery Photo");
      }
    }
  };

  const showNext = () => {
    if (currentTab.isAllImages) {
      const allImagesCombined = [
        ...curatedImages.map((src, idx) => ({
          id: `curated-${idx}`,
          path: src,
          category: 'curated',
          uploadedAt: new Date().toISOString(),
          uploadedBy: { name: 'Official Gallery', email: null },
          isCurated: true
          })),
        ...afterMatchImages.map((src, idx) => ({
          id: `after-match-${idx}`,
          path: src,
          category: 'after-match',
          uploadedAt: new Date().toISOString(),
          uploadedBy: { name: 'Official Gallery', email: null },
          isCurated: true
        })),
        ...eventsImages.map((src, idx) => ({
          id: `events-${idx}`,
          path: src,
          category: 'events',
          uploadedAt: new Date().toISOString(),
          uploadedBy: { name: 'Official Gallery', email: null },
          isCurated: true
        })),
        ...allImages
      ];
      if (modalIdx < allImagesCombined.length - 1) {
        const nextIdx = modalIdx + 1;
        setModalImg(allImagesCombined[nextIdx].path);
        setModalIdx(nextIdx);
        setModalDesc(allImagesCombined[nextIdx].isCurated ? "Official Gallery Image" : `Uploaded by ${allImagesCombined[nextIdx].uploadedBy.name || 'Unknown'}`);
      }
    } else if (modalIdx < images.length - 1) {
      const nextIdx = modalIdx + 1;
      setModalImg(images[nextIdx]);
      setModalIdx(nextIdx);
      setModalDesc(activeTab === 0 && nextIdx === 0 && images[nextIdx] === "/images/Team.jpg" ? "Our Team" : "Gallery Photo");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", selectedCategory);

      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload image");
      }

      // Update upload count
      setUploadCount(prev => prev + 1);
      
      // Refresh user uploads if on that tab
      if (currentTab.isUserUploads) {
        const res = await fetch(`/api/gallery/user-uploads?category=${selectedCategory}`);
        const data = await res.json();
        if (data.images) {
          setUserUploads(data.images);
        }
      } else if (currentTab.isAllUploads) {
        const res = await fetch(`/api/gallery/all-uploads?category=${selectedCategory}`);
        const data = await res.json();
        if (data.images) {
          setAllUploads(data.images);
        }
      } else if (currentTab.isAllImages) {
        const res = await fetch(`/api/gallery/all-uploads?category=${selectedCategory}`);
        const data = await res.json();
        if (data.images) {
          setAllImages(data.images);
        }
      }

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setShowUploadModal(false);
      alert("Image uploaded successfully!");
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const renderImageGrid = () => {
    if (currentTab.isAllImages) {
      if (loadingUploads) {
        return (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
      }

      // Combine all images: curated, after match, events, and user uploads
      const allImagesCombined = [
        // First show curated images
        ...curatedImages.map((src, idx) => ({
          id: `curated-${idx}`,
          path: src,
          category: 'curated',
          uploadedAt: new Date().toISOString(),
          uploadedBy: { name: 'Official Gallery', email: null },
          isCurated: true
        })),
        // Then show after match images
        ...afterMatchImages.map((src, idx) => ({
          id: `after-match-${idx}`,
          path: src,
          category: 'after-match',
          uploadedAt: new Date().toISOString(),
          uploadedBy: { name: 'Official Gallery', email: null },
          isCurated: true
        })),
        // Then show events images
        ...eventsImages.map((src, idx) => ({
          id: `events-${idx}`,
          path: src,
          category: 'events',
          uploadedAt: new Date().toISOString(),
          uploadedBy: { name: 'Official Gallery', email: null },
          isCurated: true
        })),
        // Finally show user uploads
        ...allImages
      ];

      if (allImagesCombined.length === 0) {
        return (
          <div className="col-span-full text-center py-12">
            <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No images found.</p>
          </div>
        );
      }

      return allImagesCombined.map((image, idx) => (
        <div
          key={image.id}
          className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${image.isCurated && idx === 0 ? "ring-4 ring-blue-500 ring-offset-2 shadow-2xl" : ""}`}
          onClick={() => handleImageClick(image.path, idx, image.isCurated ? "Official Gallery Image" : `Uploaded by ${image.uploadedBy.name || 'Unknown'}`)}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={image.path}
              alt={`Gallery image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={idx < 4}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Category badge */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
              {image.category}
            </div>
            
            {/* Official badge */}
            {image.isCurated && (
              <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <SparklesIcon className="h-3 w-3" />
                Official
              </div>
            )}
            
            {/* Delete button for admins */}
            {!image.isCurated && isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(image.id);
                }}
                className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
            
            {/* View overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                <EyeIcon className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </div>
          
          {/* Image info */}
          <div className="p-4">
            <p className="text-sm font-medium text-gray-900 truncate">
              {image.isCurated ? 'Official Gallery' : `Uploaded by ${image.uploadedBy.name || image.uploadedBy.email}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(image.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ));
    }

    if (currentTab.isUserUploads) {
      if (loadingUploads) {
        return (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
      }

      if (userUploads.length === 0) {
        return (
          <div className="col-span-full text-center py-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-md mx-auto">
              <PhotoIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No images uploaded yet</h3>
              <p className="text-gray-500 mb-4">Start by uploading your first image to the gallery!</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                Upload First Image
              </button>
            </div>
          </div>
        );
      }

      return userUploads.map((upload, idx) => (
        <div
          key={upload.id}
          className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
          onClick={() => handleImageClick(upload.path, idx, `Uploaded by ${upload.uploadedBy.name || 'Unknown'}`)}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={upload.path}
              alt={`User upload ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Category badge */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
              {upload.category}
            </div>
            
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(upload.id);
              }}
              className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
            
            {/* View overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                <EyeIcon className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </div>
          
          {/* Image info */}
          <div className="p-4">
            <p className="text-sm font-medium text-gray-900 truncate">
              Uploaded by {upload.uploadedBy.name || upload.uploadedBy.email}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(upload.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ));
    }

    if (currentTab.isAllUploads) {
      if (loadingUploads) {
        return (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
      }

      if (allUploads.length === 0) {
        return (
          <div className="col-span-full text-center py-12">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 max-w-md mx-auto">
              <UsersIcon className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No user uploads found</h3>
              <p className="text-gray-500">Users haven't uploaded any images yet.</p>
            </div>
          </div>
        );
      }

      return allUploads.map((upload, idx) => (
        <div
          key={upload.id}
          className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
          onClick={() => handleImageClick(upload.path, idx, `Uploaded by ${upload.uploadedBy.name || 'Unknown'}`)}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={upload.path}
              alt={`User upload ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Category badge */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
              {upload.category}
            </div>
            
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(upload.id);
              }}
              className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
            
            {/* View overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                <EyeIcon className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </div>
          
          {/* Image info */}
          <div className="p-4">
            <p className="text-sm font-medium text-gray-900 truncate">
              Uploaded by {upload.uploadedBy.name || upload.uploadedBy.email}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(upload.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ));
    }

    // Regular curated images
    return images.map((src, idx) => (
      <div
        key={idx}
        className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${activeTab === 0 && idx === 0 && src === "/images/Team.jpg" ? "ring-4 ring-blue-500 ring-offset-2 shadow-2xl" : ""}`}
        onClick={() => handleImageClick(src, idx)}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={src}
            alt={`Gallery image ${idx + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={idx < 4}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* View overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <EyeIcon className="h-6 w-6 text-gray-700" />
            </div>
          </div>
        </div>
      </div>
    ));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gallery
              </h1>
              <p className="text-gray-600 mt-1">
                {currentTab.description}
              </p>
              {session && (
                <p className="text-sm text-gray-500 mt-1">
                  You have uploaded <span className="font-semibold text-blue-600">{uploadCount}</span> images
                </p>
              )}
            </div>
            
            {session && (
              <div className="flex items-center gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="general">General</option>
                  <option value="after-match">After Match</option>
                  <option value="events">Events</option>
                </select>
                
                <button
                  onClick={() => setShowUploadModal(true)}
                  disabled={uploading}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {uploadError}
          </div>
        )}

        {!session && (
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl flex items-center">
            <LockClosedIcon className="h-6 w-6 text-yellow-600 mr-3" />
            <span className="text-yellow-800">Sign in to upload images to the gallery</span>
          </div>
        )}

        {session && <GalleryStats />}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm border-2 ${
                    activeTab === idx
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg scale-105"
                      : "bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-white hover:shadow-md hover:scale-102"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderImageGrid()}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="after-match">After Match</option>
                  <option value="events">Events</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image File
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {uploading ? "Uploading..." : "Choose File"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div ref={modalRef} className="relative flex flex-col items-center max-w-6xl w-full mx-4" onClick={e => e.stopPropagation()} tabIndex={-1}>
            {/* Close button */}
            <button 
              className="absolute -top-12 right-0 text-4xl text-white hover:text-red-400 font-bold transition-colors z-20" 
              onClick={() => setModalOpen(false)} 
              aria-label="Close"
            >
              &times;
            </button>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 max-w-6xl w-full">
              {/* Navigation arrows */}
              <button
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-4xl bg-white/90 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center shadow-xl border border-white/20 text-gray-700 hover:text-blue-600 transition-all focus:outline-none z-10 ${modalIdx === 0 ? 'opacity-30 pointer-events-none' : 'hover:scale-110'}`}
                onClick={showPrev}
                tabIndex={0}
                aria-label="Previous image"
              >
                &#8592;
              </button>
              
              <button
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-4xl bg-white/90 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center shadow-xl border border-white/20 text-gray-700 hover:text-blue-600 transition-all focus:outline-none z-10 ${currentTab.isAllImages ? (modalIdx === (curatedImages.length + afterMatchImages.length + eventsImages.length + allImages.length - 1)) : (modalIdx === images.length - 1) ? 'opacity-30 pointer-events-none' : 'hover:scale-110'}`}
                onClick={showNext}
                tabIndex={0}
                aria-label="Next image"
              >
                &#8594;
              </button>
              
              <div className="w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <div className="relative w-full h-[70vh] max-h-[80vh] flex items-center justify-center transition-all duration-300">
                  <Image
                    src={modalImg!}
                    alt={modalDesc}
                    fill
                    className="object-contain rounded-2xl"
                    sizes="100vw"
                  />
                </div>
                <div className="mt-6 text-2xl text-center text-gray-900 font-semibold tracking-wide px-4">
                  {modalDesc}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 