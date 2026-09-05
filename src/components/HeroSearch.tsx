import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Image as ImageIcon, 
  Link2, 
  ArrowRight,
  ShieldCheck,
  Factory,
  Calculator,
  Ship,
  Camera
} from 'lucide-react';

interface HeroSearchProps {
  onStartSourcing: (query: string, mediaFile?: File, productUrl?: string) => void;
  onOpenCreateRequest: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onStartSourcing,
  onOpenCreateRequest
}) => {
  const [query, setQuery] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query && !selectedFile && !productUrl) {
      onOpenCreateRequest();
      return;
    }
    onStartSourcing(query, selectedFile || undefined, productUrl || undefined);
  };

  const popularSearches = [
    'Solar Panels 650W',
    'NVMe SSD 2TB',
    '4G CCTV Camera',
    'Smart Phones',
    'Memory Foam Pillows',
    'Power Inverters'
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header Tabs like Alibaba */}
        <div className="flex items-center justify-center gap-6 mb-4 text-sm font-bold text-slate-700">
          <button className="flex items-center gap-1.5 text-[#FF6600] border-b-2 border-[#FF6600] pb-1 font-extrabold">
            <Sparkles className="w-4 h-4" />
            <span>AI Match Mode</span>
          </button>
          <button className="text-slate-500 hover:text-slate-900 pb-1">Products</button>
          <button className="text-slate-500 hover:text-slate-900 pb-1">Manufacturers</button>
          <button className="text-slate-500 hover:text-slate-900 pb-1">RFQ Quotes</button>
        </div>

        {/* Big Search Box matching Alibaba style */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center bg-white border-2 border-[#FF6600] rounded-full shadow-md overflow-hidden p-1 pl-4">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
              
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products or describe what you want to import from China..."
                className="w-full text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />

              <div className="flex items-center gap-1 shrink-0 px-2">
                <label className="p-2 hover:bg-slate-100 rounded-full text-slate-500 cursor-pointer transition-colors" title="Image Search">
                  <Camera className="w-5 h-5 text-[#FF6600]" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className={`p-2 hover:bg-slate-100 rounded-full transition-colors ${showUrlInput ? 'text-[#FF6600] bg-orange-50' : 'text-slate-500'}`}
                  title="Paste 1688 / Taobao Link"
                >
                  <Link2 className="w-5 h-5" />
                </button>
              </div>

              <button
                type="submit"
                className="bg-[#FF6600] hover:bg-orange-600 text-white font-bold text-sm px-6 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Search</span>
              </button>
            </div>

            {/* URL Input Bar */}
            {showUrlInput && (
              <div className="mt-2 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs">
                <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="Paste 1688.com, Taobao, or Alibaba product URL..."
                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            )}

            {/* File Selected Badge */}
            {selectedFile && (
              <div className="mt-2 inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-800 text-xs px-3 py-1 rounded-full font-medium">
                <ImageIcon className="w-3.5 h-3.5 text-[#FF6600]" />
                <span>{selectedFile.name}</span>
                <button type="button" onClick={() => setSelectedFile(null)} className="font-bold text-orange-600 hover:text-orange-900 ml-1">×</button>
              </div>
            )}
          </form>

          {/* Quick Tags */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Popular:</span>
            {popularSearches.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="hover:text-[#FF6600] hover:underline transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

