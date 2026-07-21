"use client";

import { useCallback, useEffect, useState } from "react";
import { useProfileContext } from "@/context/profile-context";
import { getAvatarAccessUrl, uploadAvatarFile } from "@/lib/avatar-storage";
import { uploadProfileAttachment } from "@/lib/profile-attachment-storage";
import { deleteResumeFile as deleteStoredResumeFile, getResumeAccessUrl, uploadResumeFile } from "@/lib/resume-storage";
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
  const [resumeFiles, setResumeFiles] = useState<string[]>([]);
  const [resumeUploadError, setResumeUploadError] = useState("");
  const [resumeUploadBusy, setResumeUploadBusy] = useState(false);

  useEffect(() => {
    if (profile.resumeStoragePath) {
      setResumeFiles([getFileNameFromPath(profile.resumeStoragePath)]);
      return;
    }

    if (profile.resumeUrl) {
      setResumeFiles([getFileNameFromUrl(profile.resumeUrl)]);
      return;
    }

    setResumeFiles([]);
  }, [profile.resumeStoragePath, profile.resumeUrl]);

  useEffect(() => {
    let cancelled = false;

    async function refreshAvatarUrl() {
      if (!profile.avatarStoragePath) {
        return;
      }

      const nextUrl = await getAvatarAccessUrl(profile.avatarStoragePath);
      if (cancelled || !nextUrl || nextUrl === profile.avatarUrl) {
        return;
      }

      updateProfile({ avatarUrl: nextUrl });
    }

    void refreshAvatarUrl();

    return () => {
      cancelled = true;
    };
  }, [profile.avatarStoragePath, profile.avatarUrl, updateProfile]);

  useEffect(() => {
    let cancelled = false;

    async function refreshResumeUrl() {
      if (!profile.resumeStoragePath) {
        return;
      }

      const nextUrl = await getResumeAccessUrl(profile.resumeStoragePath);
      if (cancelled || !nextUrl || nextUrl === profile.resumeUrl) {
        return;
      }

      updateProfile({ resumeUrl: nextUrl });
    }

    void refreshResumeUrl();

    return () => {
      cancelled = true;
    };
  }, [profile.resumeStoragePath, profile.resumeUrl, updateProfile]);

  useEffect(() => {
    let cancelled = false;

    async function refreshAttachmentUrls() {
      const [certificationEntries, awardEntries, documentEntries] = await Promise.all([
        resolveAttachmentEntryUrls(profile.certificationEntries),
        resolveAttachmentEntryUrls(profile.awardEntries),
        resolveAttachmentEntryUrls(profile.documentEntries),
      ]);

      if (cancelled) {
        return;
      }

      if (certificationEntries !== profile.certificationEntries) {
        updateProfile({
          certificationEntries,
          certifications: serializeCertificationEntries(certificationEntries),
        });
      }

      if (awardEntries !== profile.awardEntries) {
        updateProfile({
          awardEntries,
          awards: serializeAwardEntries(awardEntries),
        });
      }

      if (documentEntries !== profile.documentEntries) {
        updateProfile({
          documentEntries,
          documents: serializeDocumentEntries(documentEntries),
        });
      }
    }

    void refreshAttachmentUrls();

    return () => {
      cancelled = true;
    };
  }, [profile.awardEntries, profile.certificationEntries, profile.documentEntries, updateProfile]);

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

        const uploadedItems: Awaited<ReturnType<typeof uploadResumeFile>>[] = [];

        for (const file of files) {
          const result = await uploadResumeFile(file, userId);
          if (result) {
            uploadedItems.unshift(result);
          }
        }

        const activeResume = uploadedItems[0];
        if (activeResume) {
          setResumeFiles([activeResume.fileName]);
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
      setResumeFiles([]);
      updateProfile({ resumeUrl: "", resumeStoragePath: "" });
      return;
    }

    const deleted = await deleteStoredResumeFile(profile.resumeStoragePath);
    if (deleted) {
      setResumeFiles([]);
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
