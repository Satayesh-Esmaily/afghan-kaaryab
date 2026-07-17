import { getSupabaseBrowserClient } from "@/lib/supabase-client";

const AVATAR_BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET ?? "avatars";
const AVATAR_BUCKET_PUBLIC = process.env.NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET_PUBLIC === "true";

export async function uploadAvatarFile(file: File, userId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const compressed = await compressAvatarImage(file);
  const blob = await dataUrlToBlob(compressed);
  const path = `${sanitizeStoragePath(userId)}/avatar.webp`;

  const { error } = await supabase.storage.from(AVATAR_BUCKET_NAME).upload(path, blob, {
    contentType: "image/webp",
    upsert: true,
    cacheControl: "3600",
  });

  if (error) {
    return null;
  }

  return {
    path,
    url: await getAvatarAccessUrl(path),
  };
}

export async function getAvatarAccessUrl(path: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return "";

  if (AVATAR_BUCKET_PUBLIC) {
    return supabase.storage.from(AVATAR_BUCKET_NAME).getPublicUrl(path).data.publicUrl;
  }

  const { data, error } = await supabase.storage.from(AVATAR_BUCKET_NAME).createSignedUrl(path, 60 * 60);
  if (error || !data?.signedUrl) {
    return "";
  }

  return data.signedUrl;
}

async function compressAvatarImage(file: File) {
  const maxSize = 512;
  const quality = 0.82;

  if (!file.type.startsWith("image/")) {
    return await fileToDataUrl(file);
  }

  try {
    const image = await loadImageFromFile(file);
    const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      return await fileToDataUrl(file);
    }

    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/webp", quality);
  } catch {
    return await fileToDataUrl(file);
  }
}

function loadImageFromFile(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load image."));
      image.src = typeof reader.result === "string" ? reader.result : "";
    };

    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    };

    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl);
  return response.blob();
}

function sanitizeStoragePath(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
