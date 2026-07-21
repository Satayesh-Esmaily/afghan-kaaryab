"use client";

import { useCallback, useMemo, useState } from "react";
import { useProfileContext } from "@/context/profile-context";
import type {
  AwardEntry,
  CertificationEntry,
  DocumentEntry,
  EducationEntry,
  ExperienceEntry,
} from "@/lib/app-state";
import { deleteProfileAttachment } from "@/lib/profile-attachment-storage";
import {
  mapAwardFormToEntry,
  mapCertificationFormToEntry,
  mapDocumentFormToEntry,
  mapEducationFormToEntry,
  mapExperienceFormToEntry,
  removeDelimitedItem,
  serializeAwardEntries,
  serializeCertificationEntries,
  serializeDocumentEntries,
  serializeEducationEntries,
  serializeExperienceEntries,
} from "@/components/profile/profile-view/profile-view-helpers";
import type {
  AwardEntryFormValues,
  CertificationEntryFormValues,
  DocumentEntryFormValues,
  EducationEntryFormValues,
  ExperienceEntryFormValues,
} from "@/lib/schemas";

type EntryIndex = number | null;

export function useProfileActions() {
  const { profile, updateProfile } = useProfileContext();
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<EntryIndex>(null);
  const [editingEducationIndex, setEditingEducationIndex] = useState<EntryIndex>(null);
  const [editingCertificationIndex, setEditingCertificationIndex] = useState<EntryIndex>(null);
  const [editingAwardIndex, setEditingAwardIndex] = useState<EntryIndex>(null);
  const [editingDocumentIndex, setEditingDocumentIndex] = useState<EntryIndex>(null);

  const experienceEntries = useMemo(
    () => (Array.isArray(profile.experienceEntries) ? profile.experienceEntries : []),
    [profile.experienceEntries]
  );
  const educationEntries = useMemo(
    () => (Array.isArray(profile.educationEntries) ? profile.educationEntries : []),
    [profile.educationEntries]
  );
  const certificationEntries = useMemo(
    () => (Array.isArray(profile.certificationEntries) ? profile.certificationEntries : []),
    [profile.certificationEntries]
  );
  const awardEntries = useMemo(
    () => (Array.isArray(profile.awardEntries) ? profile.awardEntries : []),
    [profile.awardEntries]
  );
  const documentEntries = useMemo(
    () => (Array.isArray(profile.documentEntries) ? profile.documentEntries : []),
    [profile.documentEntries]
  );

  const removeSkill = useCallback(
    (skillToRemove: string) => {
      updateProfile({ skills: removeDelimitedItem(profile.skills, skillToRemove) });
    },
    [profile.skills, updateProfile]
  );

  const removeLanguage = useCallback(
    (languageToRemove: string) => {
      updateProfile({ languages: removeDelimitedItem(profile.languages, languageToRemove) });
    },
    [profile.languages, updateProfile]
  );

  const addExperience = useCallback(
    (values: ExperienceEntryFormValues) => {
      const nextEntry = mapExperienceFormToEntry(values, experienceEntries[editingExperienceIndex ?? -1]?.id);
      const nextEntries =
        editingExperienceIndex === null || editingExperienceIndex < 0
          ? [nextEntry, ...experienceEntries]
          : experienceEntries.map((entry, index) => (index === editingExperienceIndex ? nextEntry : entry));

      updateProfile({
        experienceEntries: nextEntries,
        experience: serializeExperienceEntries(nextEntries),
      });
      setEditingExperienceIndex(null);
    },
    [editingExperienceIndex, experienceEntries, updateProfile]
  );

  const addEducation = useCallback(
    (values: EducationEntryFormValues) => {
      const nextEntry = mapEducationFormToEntry(values, educationEntries[editingEducationIndex ?? -1]?.id);
      const nextEntries =
        editingEducationIndex === null || editingEducationIndex < 0
          ? [nextEntry, ...educationEntries]
          : educationEntries.map((entry, index) => (index === editingEducationIndex ? nextEntry : entry));

      updateProfile({
        educationEntries: nextEntries,
        education: serializeEducationEntries(nextEntries),
      });
      setEditingEducationIndex(null);
    },
    [editingEducationIndex, educationEntries, updateProfile]
  );

  const addCertification = useCallback(
    (values: CertificationEntryFormValues) => {
      const nextEntry = mapCertificationFormToEntry(values, certificationEntries[editingCertificationIndex ?? -1]?.id);
      const nextEntries =
        editingCertificationIndex === null || editingCertificationIndex < 0
          ? [nextEntry, ...certificationEntries]
          : certificationEntries.map((entry, index) => (index === editingCertificationIndex ? nextEntry : entry));

      updateProfile({
        certificationEntries: nextEntries,
        certifications: serializeCertificationEntries(nextEntries),
      });
      setEditingCertificationIndex(null);
    },
    [certificationEntries, editingCertificationIndex, updateProfile]
  );

  const addAward = useCallback(
    (values: AwardEntryFormValues) => {
      const nextEntry = mapAwardFormToEntry(values, awardEntries[editingAwardIndex ?? -1]?.id);
      const nextEntries =
        editingAwardIndex === null || editingAwardIndex < 0
          ? [nextEntry, ...awardEntries]
          : awardEntries.map((entry, index) => (index === editingAwardIndex ? nextEntry : entry));

      updateProfile({
        awardEntries: nextEntries,
        awards: serializeAwardEntries(nextEntries),
      });
      setEditingAwardIndex(null);
    },
    [awardEntries, editingAwardIndex, updateProfile]
  );

  const addDocument = useCallback(
    (values: DocumentEntryFormValues) => {
      const nextEntry = mapDocumentFormToEntry(values, documentEntries[editingDocumentIndex ?? -1]?.id);
      const nextEntries =
        editingDocumentIndex === null || editingDocumentIndex < 0
          ? [nextEntry, ...documentEntries]
          : documentEntries.map((entry, index) => (index === editingDocumentIndex ? nextEntry : entry));

      updateProfile({
        documentEntries: nextEntries,
        documents: serializeDocumentEntries(nextEntries),
      });
      setEditingDocumentIndex(null);
    },
    [documentEntries, editingDocumentIndex, updateProfile]
  );

  const deleteExperience = useCallback(
    (index: number) => {
      const next = experienceEntries.filter((_, itemIndex) => itemIndex !== index);
      updateProfile({
        experienceEntries: next,
        experience: serializeExperienceEntries(next),
      });
    },
    [experienceEntries, updateProfile]
  );

  const deleteEducation = useCallback(
    (index: number) => {
      const next = educationEntries.filter((_, itemIndex) => itemIndex !== index);
      updateProfile({
        educationEntries: next,
        education: serializeEducationEntries(next),
      });
    },
    [educationEntries, updateProfile]
  );

  const deleteCertification = useCallback(
    async (index: number) => {
      const entry = certificationEntries[index];
      const next = certificationEntries.filter((_, itemIndex) => itemIndex !== index);

      updateProfile({
        certificationEntries: next,
        certifications: serializeCertificationEntries(next),
      });

      if (entry?.attachmentStoragePath) {
        await deleteProfileAttachment(entry.attachmentStoragePath);
      }
    },
    [certificationEntries, updateProfile]
  );

  const deleteAward = useCallback(
    async (index: number) => {
      const entry = awardEntries[index];
      const next = awardEntries.filter((_, itemIndex) => itemIndex !== index);

      updateProfile({
        awardEntries: next,
        awards: serializeAwardEntries(next),
      });

      if (entry?.attachmentStoragePath) {
        await deleteProfileAttachment(entry.attachmentStoragePath);
      }
    },
    [awardEntries, updateProfile]
  );

  const deleteDocument = useCallback(
    async (index: number) => {
      const entry = documentEntries[index];
      const next = documentEntries.filter((_, itemIndex) => itemIndex !== index);

      updateProfile({
        documentEntries: next,
        documents: serializeDocumentEntries(next),
      });

      if (entry?.attachmentStoragePath) {
        await deleteProfileAttachment(entry.attachmentStoragePath);
      }
    },
    [documentEntries, updateProfile]
  );

  return useMemo(
    () => ({
      experienceEntries,
      educationEntries,
      certificationEntries,
      awardEntries,
      documentEntries,
      editingExperienceIndex,
      editingEducationIndex,
      editingCertificationIndex,
      editingAwardIndex,
      editingDocumentIndex,
      setEditingExperienceIndex,
      setEditingEducationIndex,
      setEditingCertificationIndex,
      setEditingAwardIndex,
      setEditingDocumentIndex,
      addExperience,
      addEducation,
      addCertification,
      addAward,
      addDocument,
      deleteExperience,
      deleteEducation,
      deleteCertification,
      deleteAward,
      deleteDocument,
      removeSkill,
      removeLanguage,
    }),
    [
      addAward,
      addCertification,
      addDocument,
      addEducation,
      addExperience,
      awardEntries,
      certificationEntries,
      deleteAward,
      deleteCertification,
      deleteDocument,
      deleteEducation,
      deleteExperience,
      documentEntries,
      editingAwardIndex,
      editingCertificationIndex,
      editingDocumentIndex,
      editingEducationIndex,
      editingExperienceIndex,
      educationEntries,
      experienceEntries,
      removeLanguage,
      removeSkill,
    ]
  );
}
