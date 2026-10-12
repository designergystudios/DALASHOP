import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  HardDrive,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import { databaseService, MediaMetadataRecord } from '../../services/supabaseClient';

interface StorageMediaUploaderProps {
  vendorId?: string;
  vendorName?: string;
  sectionType?: 'hero' | 'shop_banner' | 'product' | 'gallery';
  onUploadSuccess?: (uploadedUrl: string, record: MediaMetadataRecord) => void;
  compact?: boolean;
}

export const StorageMediaUploader: React.FC<StorageMediaUploaderProps> = ({
  vendorId = 'vnd-dala-01',
  vendorName = 'Dala Merchant',
  sectionType = 'product',
  onUploadSuccess,
  compact = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
    url?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB as defined in storage.buckets policy)
    const MAX_BYTES = 5242880; // 5MB
    if (file.size > MAX_BYTES) {
      setUploadStatus({
        success: false,
        message: `File exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose an optimized image under 5MB for mobile networks in Kenya.`,
      });
      return;
    }

    // Validate mime type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      setUploadStatus({
        success: false,
        message: 'Invalid file format. Allowed types: JPEG, PNG, WEBP, SVG.',
      });
      return;
    }

    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    setUploadStatus(null);

    // Generate local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const result = await databaseService.uploadMediaFile(selectedFile, {
        vendor_id: vendorId,
        title: title || selectedFile.name,
        description: description || `Uploaded by ${vendorName} for ${sectionType}`,
        section_type: sectionType,
      });

      if (result.success && result.url && result.record) {
        setUploadStatus({
          success: true,
          message: 'Saved to bucket "dala-media" and recorded in public.media_metadata!',
          url: result.url,
        });

        if (onUploadSuccess) {
          onUploadSuccess(result.url, result.record);
        }
      } else {
        setUploadStatus({
          success: false,
          message: result.error || 'Failed to upload media asset.',
        });
      }
    } catch (err) {
      setUploadStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown upload exception',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = () => {
    if (uploadStatus?.url) {
      navigator.clipboard.writeText(uploadStatus.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTitle('');
    setDescription('');
    setUploadStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`rounded-2xl border border-stone-200 bg-white ${compact ? 'p-4' : 'p-5'} shadow-xs`}>
      {/* Header Info Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 font-heading">
              dala-media Storage Bucket Upload
            </h4>
            <p className="text-[10px] text-stone-500">
              5MB max · JPEG, PNG, WEBP, SVG · RLS Public Read & Auth Insert
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
          Bucket Active
        </span>
      </div>

      <form onSubmit={handleUpload} className="mt-3.5 space-y-3">
        {/* Dropzone / File Picker */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed transition p-4 flex flex-col items-center justify-center text-center ${
            selectedFile
              ? 'border-emerald-400 bg-emerald-50/30'
              : 'border-stone-200 hover:border-amber-400 hover:bg-stone-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />

          {previewUrl ? (
            <div className="flex items-center gap-3 w-full">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 truncate">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{selectedFile?.name}</span>
                </div>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  {selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0} KB · {selectedFile?.type}
                </p>
                <span className="text-[10px] text-amber-700 hover:underline inline-block mt-0.5">
                  Click to replace file
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Remove selection"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-stone-800">
                Select or drag storefront media
              </p>
              <p className="text-[10px] text-stone-400">
                Optimized for fast mobile loading in Kisumu & East Africa
              </p>
            </div>
          )}
        </div>

        {/* Title & Metadata fields */}
        {selectedFile && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                Metadata Asset Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Swahili Coast Beaded Choker"
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                Section Destination
              </label>
              <input
                type="text"
                readOnly
                value={`public.media_metadata (${sectionType})`}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-stone-100 text-stone-600 font-mono"
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && (
          <div className="pt-1 flex items-center gap-2">
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition shadow-xs active:scale-98 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Persisting to Supabase Storage & Postgres...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload & Bind to public.media_metadata</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>

      {/* Upload Feedback / Success */}
      {uploadStatus && (
        <div
          className={`mt-3 p-3 rounded-xl border text-xs flex flex-col gap-1.5 ${
            uploadStatus.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {uploadStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{uploadStatus.message}</span>
          </div>

          {uploadStatus.url && (
            <div className="mt-1 flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-emerald-200 font-mono text-[11px] text-stone-700">
              <span className="truncate">{uploadStatus.url}</span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition text-[10px] font-bold flex-shrink-0"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
