"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Dynamically generated gallery images from /images directory
const galleryImages = [
  "/images/Team.jpg",
  "/images/476090611_607359335376923_6698951151074247924_n.jpg",
  "/images/475848156_607359262043597_4715828726527841259_n.jpg",
  "/images/475969919_607359408710249_8516488549860876522_n.jpg",
  "/images/476234772_607359238710266_119489637807075507_n.jpg",
  "/images/476169254_607359535376903_7286281109057041354_n.jpg",
  "/images/475780202_607359382043585_3034294918827921029_n.jpg",
  "/images/475818898_607359325376924_456497694779876643_n.jpg",
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
  "/images/z6087575494598_87ab786058a0e1cbc9c915cbb42d1ca1.jpg",
  "/images/z6087575487897_c240c4136fbe9e856d64f7be0811014d.jpg",
  "/images/z6087575482857_d05b45fd9decd52881f7b8aefc060cf2.jpg",
  "/images/z6087575479566_5fe3c1be5ad19460415b4a9d67d3fb8a.jpg",
  "/images/z6087575479563_100ce1a07bb55ac7a2beacadaacaefac.jpg",
  "/images/z6087575463799_72ea31920c1341a3eec14b08a93c3c81.jpg",
  "/images/z6087575440824_ce9aa60662b8fbab6d628891c4e37629.jpg",
  "/images/z5973016052782_032_c66ba8063ea66fd168286af447017c70.jpg",
  "/images/z5973016052782_031_89cddab0d9d7b03b64452b4510032c44.jpg",
  "/images/z5973016052782_030_1be57f77c7f076dbeb27c4a9038a7eb4.jpg",
  "/images/z5973016052782_029_f4126be02ae675c5da8af7e74d1a4e6e.jpg",
  "/images/z5973016052782_028_de2e864413d98de0e7065526bcda0a9b.jpg",
  "/images/z5973016052782_027_c5c31f0421e11b526afe698afd4a40c6.jpg",
  "/images/z5973016052782_025_19c0c99e3fde6523cd8304873f4cd32b.jpg",
  "/images/z5973016052782_024_903cfe4ad96e0f3ec3183a1e195ea65d.jpg",
  "/images/z5973016052782_023_2f600f5f1e257b02427476751201de5b.jpg",
  "/images/z5973016052782_022_3faa2c9433a16cd2663f241b4a17efe7.jpg",
  "/images/z5973016052782_021_08352a116dcbc570b8e02e43c1be2aa5.jpg",
  "/images/z5973016052782_020_04a7f35c28e027ba3ed4f63adfad54fd.jpg",
  "/images/z5973016052782_019_faa191f96924fd80d011004581c35c62.jpg",
  "/images/z5973016052782_018_d84f316aa147fc673d990a0cbb76a26d.jpg",
  "/images/z5973016052782_017_d38214a28aa2e76748f4211340e3dc41.jpg",
  "/images/z5973016052782_016_adb8d5814856736c7e4acdede2bb606d.jpg",
  "/images/z5973016052782_015_1b8201f1cc99484d73796856439bcf67.jpg",
  "/images/z5973016052782_014_c27408425d9e17f84c64ea41ac2f375f.jpg",
  "/images/z5973016052782_013_5ea124340516ab9f428c2f369e3de63f.jpg",
  "/images/z5973016052782_012_347af6f41ce9410bb3ccdcd33a13bb75.jpg",
  "/images/z5973016052782_011_8c9e48650bcebc0ace8232f11e9bc7e8.jpg",
  "/images/z5973016052782_010_7ed90876f2e0c1394b4810a0ceb81307.jpg",
  "/images/z5973016052782_009_086b948f1e03d07304db4233e6fa3a48.jpg",
  "/images/z5973016052782_008_1f51f84119fa442f24763bcdca13d68e.jpg",
  "/images/z5973016052782_007_f9a2923635343ebbc23dfa1b20d2b06b.jpg",
  "/images/z5973016052782_006_4a3d9155df36aaa0a0f46ea87b287929.jpg",
  "/images/z5973016052782_005_4ca298975090cb17a3c98db94c3bfd5f.jpg",
  "/images/z5973016052782_004_5c4d60c05ca5bbad90105f448b75663f.jpg",
  "/images/z5973016052782_003_cc79159abbb5a68bf4d33000377f0dde.jpg",
  "/images/z5973016052782_002_273b5235652a3dfb76bf40d8a50b698c.jpg",
  "/images/z5973016052782_001_d51bdad3cd2ed2e981bc093e51fc3903.jpg",
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
  "/images/Events/480927583_623995920379931_2863727569859176086_n.jpg",
  "/images/Events/481262373_623998213713035_7248181858664384245_n.jpg",
  "/images/Events/475506305_607359298710260_2334271900033905389_n.jpg",
  "/images/Events/475545052_607359248710265_3911065597263512063_n.jpg",
  "/images/Events/475792307_607359232043600_2943844154310647044_n.jpg",
  "/images/Events/475951713_607359278710262_1054903980676307615_n.jpg",
  "/images/Events/476208910_607359245376932_3593847638994941124_n.jpg",
  "/images/Events/475839465_607359168710273_3036126754752063146_n.jpg",
  "/images/Events/475845490_607359155376941_3382075745430913768_n.jpg",
  "/images/Events/475698443_607359302043593_3511584171185863671_n.jpg",
  "/images/Events/475795770_607359112043612_7418395893194555409_n.jpg",
];

const tabs = [
  { label: "All Images", images: galleryImages },
  { label: "After Match", images: afterMatchImages },
  { label: "Events", images: eventsImages },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [modalDesc, setModalDesc] = useState<string>("");
  const [modalIdx, setModalIdx] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const images = tabs[activeTab].images;

  const handleImageClick = (src: string, idx: number) => {
    setModalImg(src);
    setModalIdx(idx);
    if (activeTab === 0 && idx === 0 && src === "/images/Team.jpg") {
      setModalDesc("Our Team");
    } else {
      setModalDesc("Gallery Photo");
    }
    setModalOpen(true);
  };

  // Keyboard and focus trap
  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "ArrowLeft" && modalIdx > 0) showPrev();
      if (e.key === "ArrowRight" && modalIdx < images.length - 1) showNext();
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
      setModalImg(images[prevIdx]);
      setModalIdx(prevIdx);
      setModalDesc(activeTab === 0 && prevIdx === 0 && images[prevIdx] === "/images/Team.jpg" ? "Our Team" : "Gallery Photo");
    }
  };
  const showNext = () => {
    if (modalIdx < images.length - 1) {
      const nextIdx = modalIdx + 1;
      setModalImg(images[nextIdx]);
      setModalIdx(nextIdx);
      setModalDesc(activeTab === 0 && nextIdx === 0 && images[nextIdx] === "/images/Team.jpg" ? "Our Team" : "Gallery Photo");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-10 text-center drop-shadow">Gallery</h1>
      <div className="flex justify-center mb-8">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-2 mx-2 rounded-full font-semibold transition-all duration-200 shadow-sm border-2 ${
              activeTab === idx
                ? "bg-blue-600 text-white border-blue-600 scale-105"
                : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((src, idx) => (
          <div
            key={idx}
            className={`rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-all group cursor-pointer ${activeTab === 0 && idx === 0 && src === "/images/Team.jpg" ? "ring-4 ring-blue-500 ring-offset-2 shadow-2xl" : ""}`}
            onClick={() => handleImageClick(src, idx)}
          >
            <div className="relative w-full h-64">
              <Image
                src={src}
                alt={`Gallery image ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={idx < 4}
              />
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in-modal" onClick={() => setModalOpen(false)}>
          <div ref={modalRef} className="relative flex flex-col items-center animate-scale-in max-w-4xl w-full" onClick={e => e.stopPropagation()} tabIndex={-1}>
            {/* Close button floating outside */}
            <button className="absolute -top-8 right-0 text-5xl text-blue-700 hover:text-red-500 font-extrabold bg-white/90 rounded-full w-16 h-16 flex items-center justify-center shadow-2xl border-2 border-blue-200 transition-all focus:outline-none z-20" onClick={() => setModalOpen(false)} aria-label="Close">&times;</button>
            <div className="bg-white/80 rounded-3xl shadow-2xl border border-blue-200 p-8 max-w-4xl w-full flex flex-col items-center">
              {/* Left arrow */}
              <button
                className={`absolute left-0 top-1/2 -translate-y-1/2 text-5xl bg-white/90 rounded-full w-16 h-16 flex items-center justify-center shadow-xl border-2 border-blue-200 text-blue-700 hover:text-blue-900 transition-all focus:outline-none z-10 ${modalIdx === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                onClick={showPrev}
                tabIndex={0}
                aria-label="Previous image"
              >
                &#8592;
              </button>
              {/* Right arrow */}
              <button
                className={`absolute right-0 top-1/2 -translate-y-1/2 text-5xl bg-white/90 rounded-full w-16 h-16 flex items-center justify-center shadow-xl border-2 border-blue-200 text-blue-700 hover:text-blue-900 transition-all focus:outline-none z-10 ${modalIdx === images.length - 1 ? 'opacity-30 pointer-events-none' : ''}`}
                onClick={showNext}
                tabIndex={0}
                aria-label="Next image"
              >
                &#8594;
              </button>
              <div className="w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                <div className="relative w-full h-[65vh] max-h-[75vh] max-w-4xl mx-auto flex items-center justify-center transition-all duration-300">
                  <Image
                    src={modalImg!}
                    alt={modalDesc}
                    fill
                    className="object-contain rounded-2xl"
                    sizes="100vw"
                  />
                </div>
                <div className="mt-8 text-3xl text-center text-blue-900 font-extrabold tracking-wide drop-shadow-sm px-4">{modalDesc}</div>
              </div>
            </div>
            <style jsx global>{`
              @keyframes fade-in-modal {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fade-in-modal {
                animation: fade-in-modal 0.3s cubic-bezier(0.4,0,0.2,1) both;
              }
              @keyframes scale-in {
                from { opacity: 0; transform: scale(0.92); }
                to { opacity: 1; transform: scale(1); }
              }
              .animate-scale-in {
                animation: scale-in 0.25s cubic-bezier(0.4,0,0.2,1) both;
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
} 