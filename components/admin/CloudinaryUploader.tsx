"use client";

import Image from "next/image";
import { CldUploadWidget, type CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { FiUploadCloud, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function CloudinaryUploader({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[var(--text-muted)]">{label}</span>

      {value ? (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-[var(--border)]">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
            aria-label="Remove image"
          >
            <FiX size={14} />
          </button>
        </div>
      ) : preset ? (
        <CldUploadWidget
          uploadPreset={preset}
          onSuccess={(result) => {
            const info = result.info as CloudinaryUploadWidgetInfo;
            if (info?.secure_url) onChange(info.secure_url);
          }}
        >
          {({ open }) => (
            <Button type="button" variant="secondary" onClick={() => open()}>
              <FiUploadCloud /> Upload Image
            </Button>
          )}
        </CldUploadWidget>
      ) : (
        <p className="text-xs text-red-500">
          Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local to enable uploads.
        </p>
      )}
    </div>
  );
}
