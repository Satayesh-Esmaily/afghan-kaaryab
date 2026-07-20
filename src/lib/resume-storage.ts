import { buildStoragePath, deleteFromBucket, getBucketAccessUrl, uploadToBucket } from "@/lib/supabase-storage";

const RESUME_BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_RESUME_BUCKET ?? "resumes";
const RESUME_BUCKET_PUBLIC = process.env.NEXT_PUBLIC_SUPABASE_RESUME_BUCKET_PUBLIC === "true";

export function getResumeBucketName() {
  return RESUME_BUCKET_NAME;
}

export function isResumeBucketPublic() {
  return RESUME_BUCKET_PUBLIC;
}

export async function uploadResumeFile(file: File, userId: string) {
  const safeName = sanitizeStoragePath(file.name || "resume");
  const path = buildStoragePath(userId, "resumes", `${Date.now()}-${safeName}`);

  const result = await uploadToBucket({
    bucketName: RESUME_BUCKET_NAME,
    path,
    file,
    contentType: file.type || "application/octet-stream",
    publicBucket: RESUME_BUCKET_PUBLIC,
  });

  return result
    ? {
    fileName: file.name,
      path: result.path,
      url: result.url,
    }
    : null;
}

export async function getResumeAccessUrl(path: string) {
  return getBucketAccessUrl(RESUME_BUCKET_NAME, path, RESUME_BUCKET_PUBLIC);
}

export async function deleteResumeFile(path: string) {
  return deleteFromBucket(RESUME_BUCKET_NAME, path);
}

function sanitizeStoragePath(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
