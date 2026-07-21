"use client";

import { useCallback, useMemo, useState } from "react";
import { uploadProfileAttachment } from "@/lib/profile-attachment-storage";

type UseAttachmentUploadArgs = {
  userId: string | null;
  folder: string;
};

export function useAttachmentUpload({ userId, folder }: UseAttachmentUploadArgs) {
  const [attachmentBusy, setAttachmentBusy] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");

  const uploadAttachment = useCallback(
    async (file: File) => {
      setAttachmentError("");
      setAttachmentBusy(true);

      try {
        const result = await uploadProfileAttachment(file, userId ?? "", folder);

        if (!result) {
          setAttachmentError("We could not upload the file. Please try again.");
          return null;
        }

        return result;
      } catch {
        setAttachmentError("We could not upload the file. Please try again.");
        return null;
      } finally {
        setAttachmentBusy(false);
      }
    },
    [folder, userId]
  );

  return useMemo(
    () => ({
      attachmentBusy,
      attachmentError,
      setAttachmentError,
      uploadAttachment,
    }),
    [attachmentBusy, attachmentError, uploadAttachment]
  );
}
