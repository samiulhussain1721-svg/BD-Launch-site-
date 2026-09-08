import React, { useState, useEffect, useRef } from 'react';
import { Ring, VaultPost, EnquiryBrief } from '../types';
import { DIAMOND_SHAPES, CARAT_OPTIONS } from '../data/vault';
import {
  X,
  Send,
  CheckCircle2,
  Lock,
  MessageCircle,
  Instagram,
  Mail,
  ArrowRight,
  RotateCcw,
  Paperclip,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const PIECE_TYPES = [
  { id: 'Engagement Ring', label: 'Engagement Ring', icon: '💍' },
  { id: 'Bracelet', label: 'Bracelet', icon: '✨' },
  { id: 'Necklace', label: 'Necklace', icon: '📿' },
  { id: 'Wedding Ring', label: 'Wedding Ring', icon: '🕊️' },
  { id: 'Earrings', label: 'Earrings', icon: '💎' },
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
  'Classic Court Band (Plain Metal)',
  'Full Eternity Diamond Band',
  'Half Eternity Diamond Band',
  'Curved / Fitted Band',
  'Micro-Pavé Diamond Band',
  'Bespoke Custom Band'
];

const EARRING_STYLES = [
  'Master-Cut Diamond Studs',
  'Diamond Huggie Hoops',
  'Drop / Cascade Earrings',
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

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRing?: Ring | null;
  selectedPost?: VaultPost | null;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  selectedRing,
  selectedPost
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedPiece, setSelectedPiece] = useState('Engagement Ring');
  const [modalShape, setModalShape] = useState('Oval');
  const [modalCarat, setModalCarat] = useState(CARAT_OPTIONS[2]);
  const [selectedLength, setSelectedLength] = useState('7.0"');
  const [selectedStyle, setSelectedStyle] = useState('Tennis Bracelet');
  const [selectedDesignType, setSelectedDesignType] = useState('Solitaire Pendant');
  const [customDesignInput, setCustomDesignInput] = useState('');
  const [selectedMetal, setSelectedMetal] = useState('18k Yellow Gold');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submittedBrief, setSubmittedBrief] = useState<EnquiryBrief | null>(null);

  useEffect(() => {
    if (selectedPost) {
      setSelectedPiece('Engagement Ring');
      setModalShape(selectedPost.cut || 'Oval');
      setNotes(`Enquiry regarding Vault Selection #${selectedPost.id} - ${selectedPost.caption}`);
    } else if (selectedRing) {
      setSelectedPiece('Engagement Ring');
      setNotes(`Enquiry regarding Ring Style: ${selectedRing.title} (${selectedRing.tag})`);
    } else {
      setNotes('');
    }
    setSubmittedBrief(null);
  }, [selectedPost, selectedRing, isOpen]);

  const handlePieceSelect = (pieceId: string) => {
    setSelectedPiece(pieceId);
    if (pieceId === 'Bracelet') {
      setSelectedLength('7.0"');
      setSelectedStyle('Tennis Bracelet');
    } else if (pieceId === 'Necklace') {
      setSelectedLength('18"');
      setSelectedStyle('Tennis / Riviera Necklace');
    } else if (pieceId === 'Wedding Ring') {
      setSelectedDesignType('Classic Court Band (Plain Metal)');
    } else if (pieceId === 'Earrings') {
      setSelectedDesignType('Master-Cut Diamond Studs');
    }
  };

  const handleFilesAdded = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    setUploadError(null);

    const newFiles: UploadedFileItem[] = [];
    Array.from(filesList).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds 10MB limit.`);
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
      shape: selectedPiece === 'Engagement Ring' ? modalShape : undefined,
      carat: selectedPiece === 'Engagement Ring' ? modalCarat : undefined,
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
      selectedPost,
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setSubmittedBrief(newBrief);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Modal Slide Panel */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
            animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#172227] text-[#E2E8F0] border-l border-white/10 h-full overflow-y-auto z-10 shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 bg-[#10191D] flex items-center justify-between sticky top-0 z-20">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#ECE5DA]/70 uppercase block">
                    Private Office
                  </span>
                  <h3 className="text-lg font-display text-[#FFFFFF] font-normal uppercase tracking-wider">
                    {selectedPost
                      ? 'Bespoke Style Enquiry'
                      : selectedRing
                      ? `Configure ${selectedRing.title}`
                      : 'Consultation Brief'}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-[#E2E8F0]/60 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Selected Vault Item Preview */}
                {selectedPost && (
                  <div className="bg-[#10191D] border border-white/10 rounded-xs p-3 flex gap-3 mb-6">
                    <img
                      src={selectedPost.img}
                      alt={selectedPost.caption}
                      className="w-16 h-16 object-cover rounded-xs border border-white/10"
                    />
                    <div className="flex-1 text-xs">
                      <span className="text-[10px] font-mono text-[#ECE5DA] uppercase font-semibold block">
                        Vault Selection #{selectedPost.id}
                      </span>
                      <p className="text-[#E2E8F0]/80 line-clamp-2 mt-0.5 italic font-light">
                        "{selectedPost.caption}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Selected Ring Preview */}
                {selectedRing && !selectedPost && (
                  <div className="bg-[#10191D] border border-white/10 rounded-xs p-3 flex gap-3 mb-6">
                    <img
                      src={selectedRing.img}
                      alt={selectedRing.title}
                      className="w-16 h-16 object-cover rounded-xs border border-white/10"
                    />
                    <div className="flex-1 text-xs">
                      <span className="text-[10px] font-mono text-[#ECE5DA] uppercase font-semibold block">
                        {selectedRing.tag}
                      </span>
                      <p className="text-[#FFFFFF] font-display font-medium text-base mt-0.5">
                        {selectedRing.title}
                      </p>
                    </div>
                  </div>
                )}

                {!submittedBrief ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. CHOOSE YOUR PIECE */}
                    <div>
                      <h4 className="text-[11px] font-mono tracking-[0.2em] text-[#ECE5DA] uppercase font-semibold border-b border-white/10 pb-1.5 mb-3">
                        1. Choose Your Piece
                      </h4>
                      <div className="grid grid-cols-3 gap-1.5 mb-4">
                        {PIECE_TYPES.map((piece) => (
                          <button
                            type="button"
                            key={piece.id}
                            onClick={() => handlePieceSelect(piece.id)}
                            className={`py-2 px-1 text-[10px] font-mono uppercase text-center rounded-xs border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                              selectedPiece === piece.id
                                ? 'bg-[#ECE5DA] text-[#172227] border-[#ECE5DA] font-semibold'
                                : 'bg-[#10191D] text-[#E2E8F0]/70 border-white/10 hover:border-[#ECE5DA]/50'
                            }`}
                          >
                            <span className="text-base">{piece.icon}</span>
                            <span className="leading-tight">{piece.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. CONDITIONAL SPECS */}
                    {selectedPiece === 'Engagement Ring' && (
                      <div>
                        <h4 className="text-[11px] font-mono tracking-[0.2em] text-[#ECE5DA] uppercase font-semibold border-b border-white/10 pb-1.5 mb-3">
                          2. Ring Specifications
                        </h4>
                        <label className="text-xs font-mono text-[#E2E8F0]/70 uppercase block mb-2">
                          Diamond Cut Shape
                        </label>
                        <div className="grid grid-cols-4 gap-1.5 mb-4">
                          {DIAMOND_SHAPES.map((shape) => (
                            <button
                              type="button"
                              key={shape}
                              onClick={() => setModalShape(shape)}
                              className={`py-2 px-1 text-[10px] font-mono uppercase text-center rounded-xs border transition-all cursor-pointer ${
                                modalShape === shape
                                  ? 'bg-[#ECE5DA] text-[#172227] border-[#ECE5DA] font-semibold'
                                  : 'bg-[#10191D] text-[#E2E8F0]/70 border-white/10 hover:border-[#ECE5DA]/50'
                              }`}
                            >
                              {shape}
                            </button>
                          ))}
                        </div>

                        <label className="text-xs font-mono text-[#E2E8F0]/70 uppercase block mb-1">
                          Target Carat Weight
                        </label>
                        <select
                          value={modalCarat}
                          onChange={(e) => setModalCarat(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/10 rounded-xs px-3 py-2.5 text-xs font-mono text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA]"
                        >
                          {CARAT_OPTIONS.map((carat) => (
                            <option key={carat} value={carat} className="bg-[#172227] text-white">
                              {carat}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {(selectedPiece === 'Bracelet' || selectedPiece === 'Necklace') && (
                      <div>
                        <h4 className="text-[11px] font-mono tracking-[0.2em] text-[#ECE5DA] uppercase font-semibold border-b border-white/10 pb-1.5 mb-3">
                          2. Length &amp; Style
                        </h4>
                        <label className="text-xs font-mono text-[#E2E8F0]/70 uppercase block mb-2">
                          Preferred Length
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {(selectedPiece === 'Bracelet' ? BRACELET_LENGTHS : NECKLACE_LENGTHS).map((length) => (
                            <button
                              type="button"
                              key={length}
                              onClick={() => setSelectedLength(length)}
                              className={`py-2 px-3 text-[10px] font-mono uppercase text-center rounded-xs border transition-all cursor-pointer ${
                                selectedLength === length
                                  ? 'bg-[#ECE5DA] text-[#172227] border-[#ECE5DA] font-semibold'
                                  : 'bg-[#10191D] text-[#E2E8F0]/70 border-white/10 hover:border-[#ECE5DA]/50'
                              }`}
                            >
                              {length}
                            </button>
                          ))}
                        </div>

                        <label className="text-xs font-mono text-[#E2E8F0]/70 uppercase block mb-1">
                          Style Category
                        </label>
                        <select
                          value={selectedStyle}
                          onChange={(e) => setSelectedStyle(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/10 rounded-xs px-3 py-2.5 text-xs font-mono text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA]"
                        >
                          {(selectedPiece === 'Bracelet' ? BRACELET_STYLES : NECKLACE_STYLES).map((style) => (
                            <option key={style} value={style} className="bg-[#172227] text-white">
                              {style}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {(selectedPiece === 'Wedding Ring' || selectedPiece === 'Earrings') && (
                      <div>
                        <h4 className="text-[11px] font-mono tracking-[0.2em] text-[#ECE5DA] uppercase font-semibold border-b border-white/10 pb-1.5 mb-3">
                          2. Preferred Style
                        </h4>
                        <select
                          value={selectedDesignType}
                          onChange={(e) => setSelectedDesignType(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/10 rounded-xs px-3 py-2.5 text-xs font-mono text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA] mb-2"
                        >
                          {(selectedPiece === 'Wedding Ring' ? WEDDING_RING_STYLES : EARRING_STYLES).map((st) => (
                            <option key={st} value={st} className="bg-[#172227] text-white">
                              {st}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder={
                            selectedPiece === 'Wedding Ring'
                              ? "Finger size or desired width..."
                              : "Carat total weight or setting notes..."
                          }
                          value={customDesignInput}
                          onChange={(e) => setCustomDesignInput(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/10 rounded-xs px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA]"
                        />
                      </div>
                    )}

                    {/* 3. METAL PREFERENCE */}
                    <div>
                      <h4 className="text-[11px] font-mono tracking-[0.2em] text-[#ECE5DA] uppercase font-semibold border-b border-white/10 pb-1.5 mb-3">
                        3. Metal Preference
                      </h4>
                      <div className="grid grid-cols-2 gap-1.5">
                        {METAL_OPTIONS.map((metal) => (
                          <button
                            type="button"
                            key={metal}
                            onClick={() => setSelectedMetal(metal)}
                            className={`py-2 px-2 text-[10px] font-mono uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                              selectedMetal === metal
                                ? 'bg-[#ECE5DA] text-[#172227] border-[#ECE5DA] font-semibold'
                                : 'bg-[#10191D] text-[#E2E8F0]/70 border-white/10 hover:border-[#ECE5DA]/50'
                            }`}
                          >
                            {metal}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. CONTACT DETAILS */}
                    <div>
                      <h4 className="text-[11px] font-mono tracking-[0.2em] text-[#ECE5DA] uppercase font-semibold border-b border-white/10 pb-1.5 mb-3">
                        4. Contact Details
                      </h4>

                      <input
                        type="text"
                        required
                        placeholder="Your Full Name *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#10191D] border border-white/10 rounded-xs px-3.5 py-2.5 text-xs text-[#E2E8F0] mb-3 focus:outline-hidden focus:border-[#ECE5DA]"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <input
                          type="email"
                          required
                          placeholder="Email Address *"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/10 rounded-xs px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA]"
                        />
                        <input
                          type="tel"
                          placeholder="Phone (+44 7721 391972)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#10191D] border border-white/10 rounded-xs px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA]"
                        />
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Specific requests, timeline, or target budget..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-[#10191D] border border-white/10 rounded-xs px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:outline-hidden focus:border-[#ECE5DA] mb-3"
                      />

                      {/* FILE UPLOAD ZONE */}
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          handleFilesAdded(e.dataTransfer.files);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border border-dashed rounded-xs p-4 text-center cursor-pointer transition-all ${
                          isDragging
                            ? 'border-[#ECE5DA] bg-[#ECE5DA]/10'
                            : 'border-white/20 hover:border-[#ECE5DA]/60 bg-[#10191D]/80'
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
                        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#E2E8F0]/80">
                          <Paperclip className="w-4 h-4 text-[#ECE5DA]" />
                          <span>Upload Inspiration Images (PNG, JPG, PDF up to 10MB)</span>
                        </div>
                      </div>

                      {uploadError && (
                        <p className="text-[10px] text-rose-400 font-mono mt-1.5">{uploadError}</p>
                      )}

                      {uploadedFiles.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {uploadedFiles.map((f) => (
                            <div
                              key={f.id}
                              className="flex items-center justify-between bg-[#10191D] border border-white/10 rounded-xs px-3 py-1.5 text-[11px] font-mono"
                            >
                              <div className="flex items-center gap-2 truncate max-w-[80%]">
                                <FileText className="w-3.5 h-3.5 text-[#ECE5DA] shrink-0" />
                                <span className="truncate text-[#E2E8F0]">{f.name}</span>
                                <span className="text-[9px] text-[#E2E8F0]/40 shrink-0">
                                  ({formatFileSize(f.size)})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(f.id)}
                                className="p-0.5 text-[#E2E8F0]/50 hover:text-rose-400 transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-solid py-3.5 text-xs font-mono uppercase tracking-[0.22em] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                      Submit Private Brief
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#E2E8F0]/50 uppercase tracking-wider text-center">
                      <Lock className="w-3.5 h-3.5 text-[#ECE5DA]" />
                      <span>100% Confidential • Handcrafted in Birmingham</span>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-4 space-y-6">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>

                    <span className="text-xs font-mono tracking-[0.25em] text-[#ECE5DA] uppercase block">
                      Brief Formulated
                    </span>
                    <h4 className="text-2xl font-display text-[#FFFFFF] uppercase font-normal">
                      Bespoke Portfolio Ready
                    </h4>
                    <p className="text-xs text-[#E2E8F0]/70 leading-relaxed font-light">
                      We operate a private showroom model. Connect below to review loose stone clips or CAD renders.
                    </p>

                    {/* Summary Box */}
                    <div className="bg-[#10191D] border border-white/10 rounded-xs p-5 text-left font-mono text-xs space-y-2">
                      <div className="flex justify-between border-b border-white/10 pb-2 text-[#ECE5DA] font-semibold">
                        <span>BRIEF #{submittedBrief.id}</span>
                        <span className="text-emerald-400">Ready</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#E2E8F0]/50">Client:</span>
                        <span className="text-[#E2E8F0] font-medium">{submittedBrief.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#E2E8F0]/50">Piece:</span>
                        <span className="text-[#ECE5DA] font-medium">{submittedBrief.pieceType}</span>
                      </div>
                      {submittedBrief.shape && (
                        <div className="flex justify-between">
                          <span className="text-[#E2E8F0]/50">Cut &amp; Carat:</span>
                          <span className="text-[#E2E8F0] font-medium">{submittedBrief.shape} • {submittedBrief.carat}</span>
                        </div>
                      )}
                      {submittedBrief.metalPreference && (
                        <div className="flex justify-between">
                          <span className="text-[#E2E8F0]/50">Metal:</span>
                          <span className="text-[#E2E8F0] font-medium">{submittedBrief.metalPreference}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Channels */}
                    <div className="space-y-2.5 text-left pt-2">
                      <a
                        href={`https://wa.me/447721391972?text=${encodeURIComponent(generateBriefFormattedMessage(submittedBrief))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#10191D] border border-white/10 hover:border-[#ECE5DA]/50 p-3 rounded-xs flex items-center justify-between transition-colors text-xs font-mono"
                      >
                        <span className="flex items-center gap-2 font-medium text-[#E2E8F0]">
                          <MessageCircle className="w-4 h-4 text-[#25D366]" />
                          Chat on WhatsApp
                        </span>
                        <span className="text-[10px] text-[#ECE5DA] uppercase tracking-wider flex items-center gap-1">
                          Start chat <ArrowRight className="w-3 h-3" />
                        </span>
                      </a>

                      {/* Inspiration Images Tooltip Notice */}
                      <div className="bg-[#10191D] border border-[#ECE5DA]/25 rounded-xs p-2.5 text-left text-[11px] font-mono text-[#ECE5DA] flex items-start gap-2 leading-relaxed">
                        <span className="shrink-0">📎</span>
                        <span>Don't forget to attach your inspiration images directly in the WhatsApp chat window after it opens!</span>
                      </div>

                      <a
                        href="https://instagram.com/brindleydiamonds"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#10191D] border border-white/10 hover:border-[#ECE5DA]/50 p-3 rounded-xs flex items-center justify-between transition-colors text-xs font-mono"
                      >
                        <span className="flex items-center gap-2 font-medium text-[#E2E8F0]">
                          <Instagram className="w-4 h-4 text-[#ECE5DA]" />
                          DM us on Instagram
                        </span>
                        <span className="text-[10px] text-[#ECE5DA] uppercase tracking-wider flex items-center gap-1">
                          DM us <ArrowRight className="w-3 h-3" />
                        </span>
                      </a>

                      <a
                        href={`mailto:concierge@brindleydiamonds.com?subject=${encodeURIComponent(`Bespoke Enquiry Brief #${submittedBrief.id} - ${submittedBrief.clientName}`)}&body=${encodeURIComponent(generateBriefFormattedMessage(submittedBrief))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#10191D] border border-white/10 hover:border-[#ECE5DA]/50 p-3 rounded-xs flex items-center justify-between transition-colors text-xs font-mono"
                      >
                        <span className="flex items-center gap-2 font-medium text-[#E2E8F0]">
                          <Mail className="w-4 h-4 text-[#ECE5DA]" />
                          Studio Concierge
                        </span>
                        <span className="text-[10px] text-[#ECE5DA] uppercase tracking-wider flex items-center gap-1">
                          Email studio <ArrowRight className="w-3 h-3" />
                        </span>
                      </a>
                    </div>

                    <button
                      onClick={() => setSubmittedBrief(null)}
                      className="text-xs font-mono text-[#E2E8F0]/50 hover:text-[#ECE5DA] underline uppercase pt-2 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Refine parameters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#10191D] border-t border-white/10 text-center text-[10px] font-mono text-[#E2E8F0]/40 uppercase tracking-widest">
              BRINDLEY DIAMONDS LTD • BIRMINGHAM JEWELLERY QUARTER
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
