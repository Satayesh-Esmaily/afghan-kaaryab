"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useProfileContext } from "@/context/profile-context";
import { getAvatarAccessUrl, uploadAvatarFile } from "@/lib/avatar-storage";
import { uploadProfileAttachment } from "@/lib/profile-attachment-storage";
import { deleteResumeFile as deleteStoredResumeFile, getResumeAccessUrl, uploadResumeFile } from "@/lib/resume-storage";
import type { JobSeekerProfile } from "@/lib/app-state";
import {
  getFileNameFromPath,
  getFileNameFromUrl,
  resolveAttachmentEntryUrls,
  serializeAwardEntries,
  serializeCertificationEntries,
  serializeDocumentEntries,
} from "@/components/profile/profile-view/profile-view-helpers";

type UseProfileUploadResult = {
  resumeFiles: string[];
  resumeUploadBusy: boolean;
  resumeUploadError: string;
  setResumeUploadError: (value: string) => void;
  uploadAvatar: (file: File | null) => Promise<void>;
  uploadResumeFiles: (files: File[]) => Promise<void>;
  deleteResume: () => Promise<void>;
  downloadResume: () => Promise<void>;
  uploadAttachment: (file: File, folder: string) => Promise<Awaited<ReturnType<typeof uploadProfileAttachment>> | null>;
};

export function useProfileUpload(userId: string | null): UseProfileUploadResult {
  const { profile, updateProfile } = useProfileContext();
  const [resumeUploadError, setResumeUploadError] = useState("");
  const [resumeUploadBusy, setResumeUploadBusy] = useState(false);
  const resumeFiles = useMemo(() => {
    if (profile.resumeStoragePath) {
      return [getFileNameFromPath(profile.resumeStoragePath)];
    }

    if (profile.resumeUrl) {
      return [getFileNameFromUrl(profile.resumeUrl)];
    }

    return [];
  }, [profile.resumeStoragePath, profile.resumeUrl]);

  useEffect(() => {
    let cancelled = false;

    async function refreshProfileUrls() {
      const updates: Partial<JobSeekerProfile> = {};

      if (profile.avatarStoragePath) {
        const nextAvatarUrl = await getAvatarAccessUrl(profile.avatarStoragePath);
        if (!cancelled && nextAvatarUrl && nextAvatarUrl !== profile.avatarUrl) {
          updates.avatarUrl = nextAvatarUrl;
        }
      }

      if (profile.resumeStoragePath) {
        const nextResumeUrl = await getResumeAccessUrl(profile.resumeStoragePath);
        if (!cancelled && nextResumeUrl && nextResumeUrl !== profile.resumeUrl) {
          updates.resumeUrl = nextResumeUrl;
        }
      }

      const [certificationEntries, awardEntries, documentEntries] = await Promise.all([
        resolveAttachmentEntryUrls(profile.certificationEntries),
        resolveAttachmentEntryUrls(profile.awardEntries),
        resolveAttachmentEntryUrls(profile.documentEntries),
      ]);

      if (cancelled) {
        return;
      }

      if (certificationEntries !== profile.certificationEntries) {
        updates.certificationEntries = certificationEntries;
        updates.certifications = serializeCertificationEntries(certificationEntries);
      }

      if (awardEntries !== profile.awardEntries) {
        updates.awardEntries = awardEntries;
        updates.awards = serializeAwardEntries(awardEntries);
      }

      if (documentEntries !== profile.documentEntries) {
        updates.documentEntries = documentEntries;
        updates.documents = serializeDocumentEntries(documentEntries);
      }

      if (Object.keys(updates).length > 0) {
        updateProfile(updates);
      }
    }

    void refreshProfileUrls();

    return () => {
      cancelled = true;
    };
  }, [
    profile.avatarStoragePath,
    profile.avatarUrl,
    profile.awardEntries,
    profile.certificationEntries,
    profile.documentEntries,
    profile.resumeStoragePath,
    profile.resumeUrl,
    updateProfile,
  ]);

  const uploadAvatar = useCallback(
    async (file: File | null) => {
      if (!file || !userId) {
        return;
      }

      const result = await uploadAvatarFile(file, userId);
      if (result) {
        updateProfile({ avatarUrl: result.url, avatarStoragePath: result.path });
      }
    },
    [updateProfile, userId]
  );

  const uploadResumeFiles = useCallback(
    async (files: File[]) => {
      setResumeUploadError("");

      if (files.length === 0) {
        return;
      }

      setResumeUploadBusy(true);

      try {
        if (!userId) {
          setResumeUploadError("You need to be signed in to upload a resume.");
          return;
        }

        const uploadedItems = (await Promise.all(files.map((file) => uploadResumeFile(file, userId)))).filter(
          (item): item is NonNullable<typeof item> => Boolean(item)
        );

        const activeResume = uploadedItems.at(-1);
        if (activeResume) {
          updateProfile({
            resumeUrl: activeResume.url,
            resumeStoragePath: activeResume.path,
          });
        }
      } catch {
        setResumeUploadError("We could not upload the file. Please try again.");
      } finally {
        setResumeUploadBusy(false);
      }
    },
    [updateProfile, userId]
  );

  const deleteResume = useCallback(async () => {
    if (!profile.resumeStoragePath) {
      updateProfile({ resumeUrl: "", resumeStoragePath: "" });
      return;
    }

    const deleted = await deleteStoredResumeFile(profile.resumeStoragePath);
    if (deleted) {
      updateProfile({ resumeUrl: "", resumeStoragePath: "" });
    } else {
      setResumeUploadError("We could not delete the file right now.");
    }
  }, [profile.resumeStoragePath, updateProfile]);

  const downloadResume = useCallback(async () => {
    if (!profile.resumeStoragePath && !profile.resumeUrl) {
      return;
    }

    const url = profile.resumeStoragePath ? await getResumeAccessUrl(profile.resumeStoragePath) : profile.resumeUrl;

    if (!url) {
      setResumeUploadError("We could not generate a download link.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }, [profile.resumeStoragePath, profile.resumeUrl]);

  const uploadAttachment = useCallback(
    async (file: File, folder: string) => uploadProfileAttachment(file, userId ?? "", folder),
    [userId]
  );

  return {
    resumeFiles,
    resumeUploadBusy,
    resumeUploadError,
    setResumeUploadError,
    uploadAvatar,
    uploadResumeFiles,
    deleteResume,
    downloadResume,
    uploadAttachment,
  };
}
