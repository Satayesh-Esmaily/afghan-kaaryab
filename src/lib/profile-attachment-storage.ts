import {
  buildStoragePath,
  deleteFromBucket,
  getBucketAccessUrl,
  sanitizeStoragePath,
  uploadToBucket,
} from "@/lib/supabase-storage";

const PROFILE_ATTACHMENT_BUCKET_NAME =
  process.env.NEXT_PUBLIC_SUPABASE_PROFILE_ATTACHMENT_BUCKET ?? "profile-attachments";
const PROFILE_ATTACHMENT_BUCKET_PUBLIC =
  process.env.NEXT_PUBLIC_SUPABASE_PROFILE_ATTACHMENT_BUCKET_PUBLIC === "true";

export async function uploadProfileAttachment(file: File, userId: string, folder: string) {
  if (!userId) return null;

  const path = buildStoragePath(userId, folder, `${Date.now()}-${sanitizeStoragePath(file.name || "attachment")}`);

  const result = await uploadToBucket({
    bucketName: PROFILE_ATTACHMENT_BUCKET_NAME,
    path,
    file,
    contentType: file.type || "application/octet-stream",
    publicBucket: PROFILE_ATTACHMENT_BUCKET_PUBLIC,
  });

  return result
    ? {
        path: result.path,
        url: result.url,
        fileName: file.name,
      }
    : null;
}

export async function getProfileAttachmentAccessUrl(path: string) {
  return getBucketAccessUrl(PROFILE_ATTACHMENT_BUCKET_NAME, path, PROFILE_ATTACHMENT_BUCKET_PUBLIC);
}

export async function deleteProfileAttachment(path: string) {
  return deleteFromBucket(PROFILE_ATTACHMENT_BUCKET_NAME, path);
}
