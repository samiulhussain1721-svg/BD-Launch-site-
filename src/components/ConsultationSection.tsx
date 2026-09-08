import React, { useState, useRef } from 'react';
import { DIAMOND_SHAPES, CARAT_OPTIONS } from '../data/vault';
import { EnquiryBrief } from '../types';
import {
  MessageCircle,
  Instagram,
  Mail,
  Send,
  CheckCircle2,
  Lock,
  ArrowRight,
  RotateCcw,
  Paperclip,
  X,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const PIECE_TYPES = [
  { id: 'Engagement Ring', label: 'Engagement Ring', icon: '💍', desc: 'Solitaire, Halo, Trilogy & Bespoke Cuts' },
  { id: 'Bracelet', label: 'Bracelet', icon: '✨', desc: 'Diamond Tennis, Riviera & Gold Bangles' },
  { id: 'Necklace', label: 'Necklace', icon: '📿', desc: 'Tennis Riviera, Choker & Pendant Chains' },
  { id: 'Wedding Ring', label: 'Wedding Ring', icon: '🕊️', desc: 'Classic Court, Eternity & Curved Bands' },
  { id: 'Earrings', label: 'Earrings', icon: '💎', desc: 'Diamond Studs, Huggies & Cascade Drops' },
];

const BRACELET_LENGTHS = ['6.5"', '7.0"', '7.5"', '8.0"'];
const NECKLACE_LENGTHS = ['16"', '18"', '20"', '22"', '24"'];

const BRACELET_STYLES = [
  'Tennis Bracelet',
  'Gold Chain / Link',
  'Bangle',
  'Cuff',
  'Bespoke / Custom Style'
];

const NECKLACE_STYLES = [
  'Tennis / Riviera Necklace',
  'Pendant Chain',
  'Choker',
  'Lariat',
  'Bespoke / Custom Style'
];

const WEDDING_RING_STYLES = [
  'Classic Court Band (Heavy Platinum / 18k Gold)',
  'Full Eternity Diamond Band',
  'Half Eternity Diamond Band',
  'Curved / Contoured Band (Fitted to Engagement Ring)',
  'Micro-Pavé Diamond Band',
  'Bespoke Custom Band'
];

const EARRING_STYLES = [
  'Master-Cut Diamond Studs (Round / Oval / Emerald)',
  'Diamond Huggie Hoops',
  'Drop / Dangle Cascade Earrings',
  'Diamond Cluster Earrings',
  'Bespoke Earring Commission'
];

const METAL_OPTIONS = [
  '18k Yellow Gold',
  '18k White Gold',
  'Rose Gold',
  'Platinum'
];

interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
}

const generateBriefFormattedMessage = (brief: EnquiryBrief) => {
  const styleVal = brief.style || brief.designType || brief.shape || 'N/A';
  const dimensionVal = brief.length || brief.carat || 'N/A';
  const notesVal = brief.notes ? brief.notes.trim() : 'None';

  return `Hello Brindley Diamonds, \n\nI have submitted a new Bespoke Portfolio request:\n• Brief ID: #${brief.id}\n• Client Name: ${brief.clientName}\n• Contact Email: ${brief.email}\n• Contact Phone: ${brief.phone || 'N/A'}\n• Item Type: ${brief.pieceType || 'N/A'}\n• Metal Preference: ${brief.metalPreference || 'N/A'}\n• Layout/Style Layout: ${styleVal}\n• Dimension/Length: ${dimensionVal}\n• Custom Notes: ${notesVal}\n\n(Inspiration images attached below)`;
};

export const ConsultationSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Piece Type state
  const [selectedPiece, setSelectedPiece] = useState('Engagement Ring');

  // Ring specs
  const [selectedShape, setSelectedShape] = useState('Oval');
  const [selectedCarat, setSelectedCarat] = useState(CARAT_OPTIONS[2]);

  // Bracelet / Necklace specs
  const [selectedLength, setSelectedLength] = useState('7.0"');
  const [selectedStyle, setSelectedStyle] = useState('Tennis Bracelet');

  // Pendant / Custom specs
  const [selectedDesignType, setSelectedDesignType] = useState('Solitaire Pendant');
  const [customDesignInput, setCustomDesignInput] = useState('');

  // Metal Preference
  const [selectedMetal, setSelectedMetal] = useState('18k Yellow Gold');

  // Contact details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Uploaded files state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submitted Brief state
  const [submittedBrief, setSubmittedBrief] = useState<EnquiryBrief | null>(null);

  // Handle Piece Change & Reset relevant defaults
  const handlePieceSelect = (pieceId: string) => {
    setSelectedPiece(pieceId);
    if (pieceId === 'Bracelet') {
      setSelectedLength('7.0"');
      setSelectedStyle('Tennis Bracelet');
    } else if (pieceId === 'Necklace') {
      setSelectedLength('18"');
      setSelectedStyle('Tennis / Riviera Necklace');
    } else if (pieceId === 'Wedding Ring') {
      setSelectedDesignType('Classic Court Band (Heavy Platinum / 18k Gold)');
    } else if (pieceId === 'Earrings') {
      setSelectedDesignType('Master-Cut Diamond Studs (Round / Oval / Emerald)');
    }
  };

  // File Upload Handlers
  const handleFilesAdded = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    setUploadError(null);

    const newFiles: UploadedFileItem[] = [];
    Array.from(filesList).forEach((file) => {
      // 10MB limit check
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds the 10MB size limit.`);
        return;
      }
      newFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type
      });
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const briefNumber = Math.floor(1000 + Math.random() * 9000);
    const newBrief: EnquiryBrief = {
      id: `BD-${briefNumber}`,
      clientName: name,
      email,
      phone,
      pieceType: selectedPiece,
      shape: selectedPiece === 'Engagement Ring' ? selectedShape : undefined,
      carat: selectedPiece === 'Engagement Ring' ? selectedCarat : undefined,
      length: (selectedPiece === 'Bracelet' || selectedPiece === 'Necklace') ? selectedLength : undefined,
      style: (selectedPiece === 'Bracelet' || selectedPiece === 'Necklace') 
        ? selectedStyle 
        : (selectedPiece === 'Wedding Ring' || selectedPiece === 'Earrings')
        ? (customDesignInput ? `${selectedDesignType} - ${customDesignInput}` : selectedDesignType)
        : undefined,
      designType: (selectedPiece === 'Wedding Ring' || selectedPiece === 'Earrings')
        ? (customDesignInput ? `${selectedDesignType} - ${customDesignInput}` : selectedDesignType)
        : undefined,
      metalPreference: selectedMetal,
      notes,
      uploadedFiles: uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setSubmittedBrief(newBrief);
  };

  const handleReset = () => {
    setSubmittedBrief(null);
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setUploadedFiles([]);
    setCustomDesignInput('');
    setUploadError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const headerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="hub" className="py-20 md:py-28 bg-transparent text-[#E2E8F0] relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#ECE5DA]/4 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header in Floating Glass Panel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="text-center max-w-2xl mx-auto mb-16 p-8 sm:p-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <span className="text-xs font-mono tracking-[0.25em] text-[#ECE5DA]/70 uppercase block mb-2">
            Initiate Commission
          </span>
          <h2 className="text-3xl sm:text-5xl font-display text-[#FFFFFF] font-light uppercase tracking-[0.18em] mb-4">
            Book Consultation
          </h2>
          <div className="w-12 h-0.5 bg-[#ECE5DA]/40 mx-auto mb-6" />
          <p className="text-sm text-[#E2E8F0]/70 leading-relaxed font-light">
            Private commissions operate by scheduled consults only. Reserve your digital brief or start an instant message loop with our master craftsmen through our dedicated secure workspaces.
          </p>
        </motion.div>

        {/* 3 Channels Hub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* WhatsApp */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }
              }
            }}
            className="card-slate p-8 text-center flex flex-col justify-between bg-black/40 backdrop-blur-md border border-white/10 rounded-xl hover:border-[#ECE5DA]/40 shadow-xl"
          >
            <div>
              <div className="w-12 h-14 rounded-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl text-[#FFFFFF] font-normal tracking-wide mb-3">WhatsApp Direct</h3>
              <p className="text-xs text-[#E2E8F0]/60 leading-relaxed mb-6 font-light">
                Direct, instant messaging line with our design office. Best for sending reference layouts, asking sizing metrics, or booking immediate consultation hours.
              </p>
            </div>
            <a
              href="https://wa.me/447721391972"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost py-3 text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2"
            >
              <span>[ Chat on WhatsApp ]</span>
            </a>
          </motion.div>

          {/* Instagram Direct */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }
              }
            }}
            className="card-slate p-8 text-center flex flex-col justify-between bg-black/40 backdrop-blur-md border border-white/10 rounded-xl hover:border-[#ECE5DA]/40 shadow-xl"
          >
            <div>
              <div className="w-12 h-14 rounded-xs bg-[#10191D] text-[#ECE5DA] border border-white/10 flex items-center justify-center mx-auto mb-6">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl text-[#FFFFFF] font-normal tracking-wide mb-3">Instagram Direct</h3>
              <p className="text-xs text-[#E2E8F0]/60 leading-relaxed mb-6 font-light">
                Perfect for browsing historical commissions, matching visual concepts, and direct video clips of loose stones. Reply directly to any of our daily stories.
              </p>
            </div>
            <a
              href="https://instagram.com/brindleydiamonds"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost py-3 text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2"
            >
              <span>[ DM us on Instagram ]</span>
            </a>
          </motion.div>

          {/* Studio Concierge Email */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }
              }
            }}
            className="card-slate p-8 text-center flex flex-col justify-between bg-black/40 backdrop-blur-md border border-white/10 rounded-xl hover:border-[#ECE5DA]/40 shadow-xl"
          >
            <div>
              <div className="w-12 h-14 rounded-xs bg-[#10191D] text-[#ECE5DA] border border-white/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl text-[#FFFFFF] font-normal tracking-wide mb-3">Studio Concierge</h3>
              <p className="text-xs text-[#E2E8F0]/60 leading-relaxed mb-6 font-light">
                Our formal path for detailed design specifications, custom drawing requests, or sending formal carat criteria documents. Managed by our lead cutting team.
              </p>
            </div>
            <a
              href="mailto:concierge@brindleydiamonds.com"
              className="btn-ghost py-3 text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2"
            >
              <span>[ Email Studio ]</span>
            </a>
          </motion.div>
        </div>

        {/* Enquiry Form Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={headerVariants}
          className="max-w-3xl mx-auto card-slate p-8 sm:p-12 bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl relative"
        >
          {!submittedBrief ? (
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#ECE5DA]/70 uppercase block mb-1">
                Private Request File
              </span>
              <h3 className="text-xl sm:text-2xl font-display text-[#FFFFFF] font-normal uppercase tracking-wide border-b border-white/10 pb-4 mb-8">
                Bespoke Jewellery Enquiry
              </h3>

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. CHOOSE YOUR PIECE */}
                <div>
                  <label className="text-[11px] font-mono tracking-[0.2em] text-[#E2E8F0]/80 uppercase block mb-3 font-semibold">
                    1. Choose Your Piece
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {PIECE_TYPES.map((piece) => (
                      <button
                        type="button"
                        key={piece.id}
                        onClick={() => handlePieceSelect(piece.id)}
                        className={`p-3 text-left rounded-xs border transition-all duration-300 cursor-pointer flex flex-col justify-between h-24 ${
                          selectedPiece === piece.id
                            ? 'bg-[#ECE5DA] text-[#172227] border-[#ECE5DA] shadow-md'
                            : 'bg-[#10191D] text-[#E2E8F0]/70 border-white/10 hover:border-[#ECE5DA]/50 hover:text-[#ECE5DA]'
                        }`}
                      >
                        <div className="text-xl mb-1">{piece.icon}</div>
                        <div>
                          <div className={`text-[11px] font-mono uppercase font-semibold leading-tight ${
                            selectedPiece === piece.id ? 'text-[#172227]' : 'text-[#FFFFFF]'
                          }`}>
                            {piece.label}
                          </div>
                          <div className={`text-[9px] font-mono line-clamp-1 mt-0.5 ${
                            selectedPiece === piece.id ? 'text-[#172227]/70' : 'text-[#E2E8F0]/50'
                          }`}>
                            {piece.desc.split('&')[0]}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. CONDITIONAL LAYOUT LOGIC */}
                <AnimatePresence mode="wait">
                  {selectedPiece === 'Engagement Ring' && (
                    <motion.div
                      key="ring-specs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Preferred Diamond Shape */}
                      <div>
                        <label className="text-[11px] font-mono tracking-[0.2em] text-[#E2E8F0]/80 uppercase block mb-3 font-semibold">
                          2. Preferred Diamond Shape
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {DIAMOND_SHAPES.map((shape) => (
                            <button
                              type="button"
                              key={shape}
                              onClick={() => setSelectedShape(shape)}
                              className={`py-2.5 px-3 text-[10px] font-mono uppercase tracking-wider rounded-xs border transition-all duration-300 cursor-pointer ${
                                selectedShape === shape
                                  ? 'bg-[#ECE5DA] text-[#172227] border-[#ECE5DA] font-semibold'
                                  : 'bg-[#10191D] text-[#E2E8F0]/70 border-white/10 hover:border-[#ECE5DA]/50 hover:text-[#ECE5DA]'
                              }`}
                            >
                              {shape}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Target Carat Weight */}
                      <div>
                        <label className="text-[11px] font-mono tracking-[0.2em] text-[#E2E8F0]/80 uppercase block mb-2 font-semibold">
                          Target Carat Weight Range
                        </label>
                        <select
                          value={selectedCarat}
                          onChange={(e) => setSelectedCarat(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/10 rounded-xs px-4 py-3 text-xs font-mono text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA]"
                        >
                          {CARAT_OPTIONS.map((carat) => (
                            <option key={carat} value={carat} className="bg-[#172227] text-white">
                              {carat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {(selectedPiece === 'Bracelet' || selectedPiece === 'Necklace') && (
                    <motion.div
                      key="chain-specs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Length selector */}
                      <div>
                        <label className="text-[11px] font-mono tracking-[0.2em] text-[#E2E8F0]/80 uppercase block mb-3 font-semibold">
                          2. Preferred Length
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(selectedPiece === 'Bracelet' ? BRACELET_LENGTHS : NECKLACE_LENGTHS).map((length) => (
                            <button
                              type="button"
                              key={length}
                              onClick={() => setSelectedLength(length)}
                              className={`py-2.5 px-5 text-[11px] font-mono uppercase tracking-wider rounded-xs border transition-all duration-300 cursor-pointer ${
                                selectedLength === length
                                  ? 'bg-[#ECE5DA] text-[#172227] border-[#ECE5DA] font-semibold'
                                  : 'bg-[#10191D] text-[#E2E8F0]/70 border-white/10 hover:border-[#ECE5DA]/50 hover:text-[#ECE5DA]'
                              }`}
                            >
                              {length}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Style selector */}
                      <div>
                        <label className="text-[11px] font-mono tracking-[0.2em] text-[#E2E8F0]/80 uppercase block mb-2 font-semibold">
                          Style Category
                        </label>
                        <select
                          value={selectedStyle}
                          onChange={(e) => setSelectedStyle(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/10 rounded-xs px-4 py-3 text-xs font-mono text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA]"
                        >
                          {(selectedPiece === 'Bracelet' ? BRACELET_STYLES : NECKLACE_STYLES).map((style) => (
                            <option key={style} value={style} className="bg-[#172227] text-white">
                              {style}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {(selectedPiece === 'Wedding Ring' || selectedPiece === 'Earrings') && (
                    <motion.div
                      key="ring-earrings-specs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="text-[11px] font-mono tracking-[0.2em] text-[#E2E8F0]/80 uppercase block mb-2 font-semibold">
                          2. Preferred Style & Profile
                        </label>
                        <select
                          value={selectedDesignType}
                          onChange={(e) => setSelectedDesignType(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/10 rounded-xs px-4 py-3 text-xs font-mono text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA] mb-3"
                        >
                          {(selectedPiece === 'Wedding Ring' ? WEDDING_RING_STYLES : EARRING_STYLES).map((style) => (
                            <option key={style} value={style} className="bg-[#172227] text-white">
                              {style}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder={
                            selectedPiece === 'Wedding Ring'
                              ? "Finger size or desired band width (e.g. Size M, 2.5mm width)..."
                              : "Diamond carat weight or preferences (e.g. 1.50ct total weight, screw back)..."
                          }
                          value={customDesignInput}
                          onChange={(e) => setCustomDesignInput(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/10 rounded-xs px-4 py-3 text-xs text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA]"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3. UNIVERSAL METAL PREFERENCE */}
                <div>
                  <label className="text-[11px] font-mono tracking-[0.2em] text-[#E2E8F0]/80 uppercase block mb-3 font-semibold">
                    3. Metal Preference
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {METAL_OPTIONS.map((metal) => (
                      <button
                        type="button"
                        key={metal}
                        onClick={() => setSelectedMetal(metal)}
                        className={`py-2.5 px-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider rounded-xs border transition-all duration-300 cursor-pointer ${
                          selectedMetal === metal
                            ? 'bg-[#ECE5DA] text-[#172227] border-[#ECE5DA] font-semibold'
                            : 'bg-[#10191D] text-[#E2E8F0]/70 border-white/10 hover:border-[#ECE5DA]/50 hover:text-[#ECE5DA]'
                        }`}
                      >
                        {metal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. CONTACT DETAILS */}
                <div>
                  <label className="text-[11px] font-mono tracking-[0.2em] text-[#E2E8F0]/80 uppercase block mb-3 font-semibold">
                    4. Contact Details
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#10191D] border border-white/10 rounded-xs px-4 py-3 text-xs text-[#E2E8F0] mb-3 focus:outline-hidden focus:border-[#ECE5DA]"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#10191D] border border-white/10 rounded-xs px-4 py-3 text-xs text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA]"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (+44 7721 391972)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#10191D] border border-white/10 rounded-xs px-4 py-3 text-xs text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA]"
                    />
                  </div>
                </div>

                {/* 5. NOTES & PARAMETERS */}
                <div>
                  <label className="text-[11px] font-mono tracking-[0.2em] text-[#E2E8F0]/80 uppercase block mb-2 font-semibold">
                    5. Custom Specifications & Budget
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide any specific notes, target timeline, proposal date, or budget parameters..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#10191D] border border-white/10 rounded-xs px-4 py-3 text-xs text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA]"
                  />
                </div>

                {/* 6. MINIMALIST FILE UPLOAD ZONE */}
                <div>
                  <label className="text-[11px] font-mono tracking-[0.2em] text-[#E2E8F0]/80 uppercase block mb-2 font-semibold">
                    Upload Inspiration Images (PNG, JPG, PDF up to 10MB)
                  </label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border border-dashed rounded-xs p-6 text-center cursor-pointer transition-all duration-300 ${
                      isDragging
                        ? 'border-[#ECE5DA] bg-[#ECE5DA]/10'
                        : 'border-white/20 hover:border-[#ECE5DA]/60 bg-[#10191D]/80 hover:bg-[#10191D]'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/png,image/jpeg,image/webp,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFilesAdded(e.target.files)}
                    />

                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-[#ECE5DA] flex items-center justify-center mx-auto mb-3">
                      <Paperclip className="w-5 h-5 text-[#ECE5DA]" />
                    </div>

                    <p className="text-xs font-mono text-[#E2E8F0]/80 mb-1">
                      Drag & drop your screenshots, Pinterest boards, or PDF sketches here
                    </p>
                    <p className="text-[10px] font-mono text-[#E2E8F0]/50 uppercase tracking-wider">
                      or <span className="text-[#ECE5DA] underline">click to browse files</span>
                    </p>
                  </div>

                  {uploadError && (
                    <p className="text-xs text-rose-400 font-mono mt-2">{uploadError}</p>
                  )}

                  {/* Uploaded File List */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between bg-[#10191D] border border-white/10 rounded-xs px-3.5 py-2 text-xs font-mono"
                        >
                          <div className="flex items-center gap-2.5 truncate max-w-[80%]">
                            <FileText className="w-4 h-4 text-[#ECE5DA] shrink-0" />
                            <span className="truncate text-[#E2E8F0]">{f.name}</span>
                            <span className="text-[10px] text-[#E2E8F0]/40 shrink-0">
                              ({formatFileSize(f.size)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(f.id)}
                            className="p-1 text-[#E2E8F0]/50 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full btn-solid py-4 text-xs font-mono uppercase tracking-[0.22em] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Submit Private Brief
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#E2E8F0]/50 uppercase tracking-wider pt-2">
                  <Lock className="w-3.5 h-3.5 text-[#ECE5DA]" />
                  <span>Birmingham Quarter Atelier • 100% Confidential</span>
                </div>
              </form>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center py-4 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-xs font-mono tracking-[0.25em] text-[#ECE5DA] uppercase block">
                Brief Formulated
              </span>
              <h4 className="text-2xl sm:text-3xl font-display text-[#FFFFFF] uppercase font-normal">
                Bespoke Design File Prepared
              </h4>
              <p className="text-xs text-[#E2E8F0]/70 max-w-md mx-auto leading-relaxed font-light">
                Your enquiry parameter file has been created. Choose a workspace below to instantly connect with our Lead Diamond Specialist.
              </p>

              {/* Summary Block */}
              <div className="bg-[#10191D] border border-white/10 rounded-xs p-6 text-left font-mono text-xs max-w-md mx-auto space-y-2">
                <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3 text-[#ECE5DA] uppercase font-semibold">
                  <span>BRIEF #{submittedBrief.id}</span>
                  <span className="text-emerald-400">Status: Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E2E8F0]/50">Client Name:</span>
                  <span className="text-[#E2E8F0] font-medium">{submittedBrief.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E2E8F0]/50">Piece Type:</span>
                  <span className="text-[#ECE5DA] font-semibold">{submittedBrief.pieceType}</span>
                </div>
                {submittedBrief.shape && (
                  <div className="flex justify-between">
                    <span className="text-[#E2E8F0]/50">Diamond Cut:</span>
                    <span className="text-[#E2E8F0] font-medium">{submittedBrief.shape}</span>
                  </div>
                )}
                {submittedBrief.carat && (
                  <div className="flex justify-between">
                    <span className="text-[#E2E8F0]/50">Carat Target:</span>
                    <span className="text-[#E2E8F0] font-medium">{submittedBrief.carat}</span>
                  </div>
                )}
                {submittedBrief.length && (
                  <div className="flex justify-between">
                    <span className="text-[#E2E8F0]/50">Length:</span>
                    <span className="text-[#E2E8F0] font-medium">{submittedBrief.length}</span>
                  </div>
                )}
                {submittedBrief.style && (
                  <div className="flex justify-between">
                    <span className="text-[#E2E8F0]/50">Style:</span>
                    <span className="text-[#E2E8F0] font-medium">{submittedBrief.style}</span>
                  </div>
                )}
                {submittedBrief.designType && (
                  <div className="flex justify-between">
                    <span className="text-[#E2E8F0]/50">Design Type:</span>
                    <span className="text-[#E2E8F0] font-medium">{submittedBrief.designType}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#E2E8F0]/50">Metal Choice:</span>
                  <span className="text-[#E2E8F0] font-medium">{submittedBrief.metalPreference}</span>
                </div>
                {submittedBrief.uploadedFiles && submittedBrief.uploadedFiles.length > 0 && (
                  <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                    <span className="text-[#E2E8F0]/50">Inspiration Files:</span>
                    <span className="text-[#ECE5DA] font-medium">{submittedBrief.uploadedFiles.length} File(s) Attached</span>
                  </div>
                )}
              </div>

              {/* Quick Launch Buttons */}
              <div className="space-y-3 max-w-md mx-auto pt-2">
                <a
                  href={`https://wa.me/447721391972?text=${encodeURIComponent(generateBriefFormattedMessage(submittedBrief))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-solid py-3.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between px-6 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    Chat on WhatsApp
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                {/* Inspiration Images Tooltip Notice */}
                <div className="bg-[#10191D] border border-[#ECE5DA]/25 rounded-xs p-3 text-left text-xs font-mono text-[#ECE5DA] flex items-start gap-2.5 leading-relaxed">
                  <span className="shrink-0 text-sm">📎</span>
                  <span>Don't forget to attach your inspiration images directly in the WhatsApp chat window after it opens!</span>
                </div>

                <a
                  href={`mailto:concierge@brindleydiamonds.com?subject=${encodeURIComponent(`Bespoke Enquiry Brief #${submittedBrief.id} - ${submittedBrief.clientName}`)}&body=${encodeURIComponent(generateBriefFormattedMessage(submittedBrief))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-ghost py-3.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between px-6 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Studio Concierge
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <button
                onClick={handleReset}
                className="text-xs font-mono text-[#E2E8F0]/50 hover:text-[#ECE5DA] underline uppercase pt-4 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Refine specifications
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
