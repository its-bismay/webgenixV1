"use client";
import React, { useRef, useState } from "react";
import {
  Image as ImageIcon,
  Crop,
  Image as ImageUpscale,
  ImageMinus,
  Loader2Icon,
  Images,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageKit from "imagekit";
import { v4 as uuidV4 } from "uuid";

type Props = {
  selectedEl: HTMLImageElement;
};

type ImageKitUploadResponse = {
  url: string;
};

const transformOptions = [
  {
    label: "Smart Crop",
    value: "smartcrop",
    icon: <Crop />,
    transformation: "fo-auto",
  },
  {
    label: "Dropshadow",
    value: "dropshadow",
    icon: <Images />,
    transformation: "e-dropshadow",
  },
  {
    label: "Upscale",
    value: "upscale",
    icon: <ImageUpscale />,
    transformation: "e-upscale",
  },
  {
    label: "BG Remove",
    value: "bgremove",
    icon: <ImageMinus />,
    transformation: "e-bgremove",
  },
];

function ImageSettingSection({ selectedEl }: Props) {
  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  });

  const [altText, setAltText] = useState(selectedEl.alt || "");
  const [width, setWidth] = useState<number>(selectedEl.width || 300);
  const [height, setHeight] = useState<number>(selectedEl.height || 200);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [borderRadius, setBorderRadius] = useState(
    selectedEl.style.borderRadius || "0px"
  );
  const [preview, setPreview] = useState(selectedEl.src || "");
  const [activeTransforms, setActiveTransforms] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const saveUploadedFile = async () => {
    if (!selectedImage) return;
    setLoading(true);

    try {
      const ext = selectedImage.name.split(".").pop();

      const baseName = selectedImage.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase();

      const uniqueId =
        Date.now() + "-" + Math.random().toString(36).substring(2, 8);

      const fileName = `${baseName}-${uniqueId}.${ext}`;

      const imageRef = (await imagekit.upload({
        file: selectedImage,
        fileName,
        isPublished: true,
      })) as ImageKitUploadResponse;

      if (imageRef?.url) {
        const url = imageRef.url + "?tr=";
        selectedEl.src = url;
        setPreview(url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const GenerateAiImage = () => {
    setLoading(true);

    const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
    const uniqueId = `${Date.now()}-${uuidV4()}`;

    const url = `${endpoint}/ik-genimg-prompt-${altText}/${uniqueId}.png?tr=`;

    selectedEl.src = url;
    setPreview(url);
    setLoading(false);
  };

  const ApplyTransformation = (trValue: string) => {
    setLoading(true);

    let url = preview;

    if (!preview.includes(trValue)) {
      url = preview + trValue + ",";
    } else {
      url = preview.replaceAll(trValue + ",", "");
    }

    selectedEl.src = url;
    setPreview(url);
    setLoading(false);
  };

  return (
    <div className="w-96 shadow p-4 space-y-4">
      <h2 className="flex gap-2 items-center font-bold">
        <ImageIcon /> Image Settings
      </h2>

      <div className="flex justify-center">
        <img
          src={preview}
          alt={altText}
          className="max-h-40 object-contain border rounded cursor-pointer hover:opacity-80"
          onClick={openFileDialog}
          onLoad={() => setLoading(false)}
        />
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={saveUploadedFile}
        disabled={loading}
      >
        {loading && <Loader2Icon className="animate-spin" />}
        Upload Image
      </Button>

      <div>
        <label className="text-sm">Prompt</label>
        <Input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="mt-1"
        />
      </div>

      <Button
        className="w-full"
        onClick={GenerateAiImage}
        disabled={loading}
      >
        {loading && <Loader2Icon className="animate-spin" />}
        Generate AI Image
      </Button>

      <div>
        <label className="text-sm mb-1 block">AI Transform</label>
        <div className="flex gap-2 flex-wrap">
          <TooltipProvider>
            {transformOptions.map((opt) => (
              <Tooltip key={opt.value}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={
                      preview.includes(opt.transformation)
                        ? "default"
                        : "outline"
                    }
                    className="p-2"
                    onClick={() =>
                      ApplyTransformation(opt.transformation)
                    }
                  >
                    {opt.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{opt.label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>

      <div>
        <label className="text-sm">Border Radius</label>
        <Input
          type="text"
          value={borderRadius}
          onChange={(e) => {
            const val = e.target.value;
            setBorderRadius(val);
            selectedEl.style.borderRadius = val;
          }}
          className="mt-1"
        />
      </div>
    </div>
  );
}

export default ImageSettingSection;