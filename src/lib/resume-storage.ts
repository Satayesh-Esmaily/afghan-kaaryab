import { getSupabaseBrowserClient } from "@/lib/supabase-client";

const RESUME_BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_RESUME_BUCKET ?? "resumes";
const RESUME_BUCKET_PUBLIC = process.env.NEXT_PUBLIC_SUPABASE_RESUME_BUCKET_PUBLIC === "true";

export function getResumeBucketName() {
  return RESUME_BUCKET_NAME;
}

export function isResumeBucketPublic() {
  return RESUME_BUCKET_PUBLIC;
}

export async function uploadResumeFile(file: File, userId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const safeName = sanitizeStoragePath(file.name || "resume");
  const path = `profiles/${sanitizeStoragePath(userId)}/resumes/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(RESUME_BUCKET_NAME).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
    cacheControl: "3600",
  });

  if (error) {
    return null;
  }

  const url = RESUME_BUCKET_PUBLIC
    ? supabase.storage.from(RESUME_BUCKET_NAME).getPublicUrl(path).data.publicUrl
    : await getResumeAccessUrl(path);

  return {
    fileName: file.name,
    path,
    url,
  };
}

export async function getResumeAccessUrl(path: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return "";

  if (RESUME_BUCKET_PUBLIC) {
    return supabase.storage.from(RESUME_BUCKET_NAME).getPublicUrl(path).data.publicUrl;
  }

  const { data, error } = await supabase.storage.from(RESUME_BUCKET_NAME).createSignedUrl(path, 60 * 60);
  if (error || !data?.signedUrl) {
    return "";
  }

  return data.signedUrl;
}

export async function deleteResumeFile(path: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return false;

  const { error } = await supabase.storage.from(RESUME_BUCKET_NAME).remove([path]);
  return !error;
}

function sanitizeStoragePath(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
