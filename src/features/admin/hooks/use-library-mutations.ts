import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse, deleteCourse } from "@/shared/api/courses";
import { attachDocumentPdf, createDocument, deleteDocument } from "@/shared/api/documents";
import { QUERY_KEYS } from "@/shared/api/query-keys";
import type { CourseInput, DocumentInput } from "@/shared/api/validation";

// Deleting a course or document also deletes its assignments (database cascade), so both caches refresh.

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-course"],
    mutationFn: (input: CourseInput) => createCourse(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses }),
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-course"],
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments });
    },
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-document"],
    mutationFn: ({ input, pdfFile }: { input: DocumentInput; pdfFile: File | null }) =>
      createDocument(input, pdfFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents }),
  });
}

export function useAttachDocumentPdf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["attach-document-pdf"],
    mutationFn: ({ documentId, pdfFile }: { documentId: string; pdfFile: File }) =>
      attachDocumentPdf(documentId, pdfFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-document"],
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.documents });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments });
    },
  });
}
