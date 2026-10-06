import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useT } from "@/shared/i18n";
import { userAssignmentsQuery, type AssignableItem } from "@/shared/api/assignments";
import { coursesQuery } from "@/shared/api/courses";
import { documentsQuery } from "@/shared/api/documents";
import type { Profile } from "@/shared/api/types";
import { useAuth } from "@/features/auth/use-auth";
import { useCreateAssignments } from "../hooks/use-assignment-mutations";
import { AssignableOptionList, type AssignableOption } from "./AssignableOptionList";
import { CurrentAssignmentRow } from "./CurrentAssignmentRow";

interface AssignDialogProps {
  employee: Profile | null;
  onClose: () => void;
}

function isSameItem(first: AssignableItem, second: AssignableItem): boolean {
  return first.kind === second.kind && first.id === second.id;
}

export function AssignDialog({ employee, onClose }: AssignDialogProps) {
  const { userId } = useAuth();
  const { t } = useT();
  const { data: courses = [] } = useQuery(coursesQuery);
  const { data: documents = [] } = useQuery(documentsQuery);
  const { data: currentAssignments = [] } = useQuery({
    ...userAssignmentsQuery(employee?.id ?? ""),
    enabled: !!employee,
  });
  const [selectedItems, setSelectedItems] = useState<AssignableItem[]>([]);
  const [dueDate, setDueDate] = useState("");
  const createAssignments = useCreateAssignments();

  const assignedItemIds = new Set(
    currentAssignments.map((assignment) => assignment.course_id ?? assignment.document_id),
  );
  const courseOptions: AssignableOption[] = courses
    .filter((course) => !assignedItemIds.has(course.id))
    .map((course) => ({
      kind: "course",
      id: course.id,
      title: course.title,
      meta: `${course.minutes} min`,
    }));
  const documentOptions: AssignableOption[] = documents
    .filter((document) => !assignedItemIds.has(document.id))
    .map((document) => ({
      kind: "document",
      id: document.id,
      title: document.title,
      meta: `${document.pages} p`,
    }));

  const isSelected = (item: AssignableItem) =>
    selectedItems.some((selected) => isSameItem(selected, item));
  const toggleItem = (item: AssignableItem) =>
    setSelectedItems((current) =>
      isSelected(item)
        ? current.filter((selected) => !isSameItem(selected, item))
        : [...current, item],
    );

  const assignSelectedItems = () => {
    if (!employee) return;
    createAssignments.mutate(
      { userId: employee.id, items: selectedItems, dueDate, assignedBy: userId },
      {
        onSuccess: () => {
          toast.success(t.assign.added(selectedItems.length, employee.full_name));
          setSelectedItems([]);
        },
      },
    );
  };

  return (
    <Dialog open={!!employee} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {t.assign.title(employee?.full_name ?? "")}
          </DialogTitle>
        </DialogHeader>

        <div>
          <h3 className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {t.assign.current}
          </h3>
          {currentAssignments.length === 0 && (
            <p className="text-[0.75rem] text-muted-foreground">{t.assign.none}</p>
          )}
          <div className="space-y-2">
            {currentAssignments.map((assignment) => (
              <CurrentAssignmentRow key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <AssignableOptionList
            title={t.assign.addCourses}
            emptyMessage={t.assign.allCourses}
            options={courseOptions}
            isSelected={isSelected}
            onToggle={toggleItem}
          />
          <AssignableOptionList
            title={t.assign.addDocuments}
            emptyMessage={t.assign.allDocuments}
            options={documentOptions}
            isSelected={isSelected}
            onToggle={toggleItem}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-[0.75rem] font-medium text-muted-foreground">
            {t.assign.dueDate}{" "}
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="ml-2 rounded-lg bg-card px-2 py-1.5 text-[0.75rem] ring-1 ring-border"
            />
          </label>
          <button
            type="button"
            disabled={selectedItems.length === 0 || createAssignments.isPending}
            onClick={assignSelectedItems}
            className="ml-auto rounded-xl bg-primary px-5 py-2 text-[0.8125rem] font-semibold text-primary-foreground shadow-primary transition hover:opacity-90 disabled:opacity-50"
          >
            {t.assign.button(selectedItems.length)}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
