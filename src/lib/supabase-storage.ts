import { getSupabaseBrowserClient } from "@/lib/supabase-client";

type UploadToBucketOptions = {
  bucketName: string;
  path: string;
  file: File | Blob;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
  publicBucket?: boolean;
};

export function sanitizeStoragePath(value: string, fallback = "item") {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || fallback;
}

export function buildStoragePath(...segments: string[]) {
  return segments.map((segment) => sanitizeStoragePath(segment)).join("/");
}

export async function uploadToBucket({
  bucketName,
  path,
  file,
  contentType,
  cacheControl = "3600",
  upsert = true,
  publicBucket = false,
}: UploadToBucketOptions) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const { error } = await supabase.storage.from(bucketName).upload(path, file, {
    contentType: contentType ?? (file instanceof File ? file.type || "application/octet-stream" : "application/octet-stream"),
    upsert,
    cacheControl,
  });

  if (error) {
    return null;
  }

  return {
    path,
    url: await getBucketAccessUrl(bucketName, path, publicBucket),
  };
}

export async function getBucketAccessUrl(bucketName: string, path: string, publicBucket = false) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return "";

  if (publicBucket) {
    return supabase.storage.from(bucketName).getPublicUrl(path).data.publicUrl;
  }

  const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(path, 60 * 60);
  if (error || !data?.signedUrl) {
    return "";
  }

  return data.signedUrl;
}

export async function deleteFromBucket(bucketName: string, path: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return false;

  const { error } = await supabase.storage.from(bucketName).remove([path]);
  return !error;
}
