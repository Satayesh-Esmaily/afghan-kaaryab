import { getSupabaseBrowserClient } from "@/lib/supabase-client";

const PROFILE_ATTACHMENT_BUCKET_NAME =
  process.env.NEXT_PUBLIC_SUPABASE_PROFILE_ATTACHMENT_BUCKET ?? "profile-attachments";
const PROFILE_ATTACHMENT_BUCKET_PUBLIC =
  process.env.NEXT_PUBLIC_SUPABASE_PROFILE_ATTACHMENT_BUCKET_PUBLIC === "true";

export async function uploadProfileAttachment(file: File, userId: string, folder: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase || !userId) return null;

  const path = `profiles/${sanitizeStoragePath(userId)}/${folder}/${Date.now()}-${sanitizeStoragePath(
    file.name || "attachment"
  )}`;

  const { error } = await supabase.storage.from(PROFILE_ATTACHMENT_BUCKET_NAME).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
    cacheControl: "3600",
  });

  if (error) {
    return null;
  }

  return {
    path,
    url: await getProfileAttachmentAccessUrl(path),
    fileName: file.name,
  };
}

export async function getProfileAttachmentAccessUrl(path: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return "";

  if (PROFILE_ATTACHMENT_BUCKET_PUBLIC) {
    return supabase.storage.from(PROFILE_ATTACHMENT_BUCKET_NAME).getPublicUrl(path).data.publicUrl;
  }

  const { data, error } = await supabase.storage
    .from(PROFILE_ATTACHMENT_BUCKET_NAME)
    .createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) {
    return "";
  }

  return data.signedUrl;
}

export async function deleteProfileAttachment(path: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return false;

  const { error } = await supabase.storage.from(PROFILE_ATTACHMENT_BUCKET_NAME).remove([path]);
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
