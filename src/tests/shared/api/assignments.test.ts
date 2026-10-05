import { beforeEach, describe, expect, it, vi } from "vitest";

const { insertMock, updateMock, eqMock, fromMock } = vi.hoisted(() => {
  const eqMock = vi.fn();
  const insertMock = vi.fn();
  const updateMock = vi.fn(() => ({ eq: eqMock }));
  const fromMock = vi.fn(() => ({ insert: insertMock, update: updateMock }));
  return { insertMock, updateMock, eqMock, fromMock };
});

vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: fromMock } }));

import { createAssignments, updateAssignmentProgress } from "@/shared/api/assignments";
import { ValidationError } from "@/shared/api/validation";

describe("createAssignments", () => {
  beforeEach(() => vi.clearAllMocks());

  it("inserts one row per item with the right course or document column", async () => {
    insertMock.mockResolvedValue({ error: null });

    await createAssignments({
      userId: "user-1",
      items: [
        { kind: "course", id: "course-1" },
        { kind: "document", id: "document-1" },
      ],
      dueDate: "2026-10-20",
      assignedBy: "hr-1",
    });

    expect(fromMock).toHaveBeenCalledWith("assignments");
    expect(insertMock).toHaveBeenCalledWith([
      {
        user_id: "user-1",
        course_id: "course-1",
        document_id: null,
        due_date: "2026-10-20",
        assigned_by: "hr-1",
      },
      {
        user_id: "user-1",
        course_id: null,
        document_id: "document-1",
        due_date: "2026-10-20",
        assigned_by: "hr-1",
      },
    ]);
  });

  it("rejects an invalid due date before calling the database", async () => {
    await expect(
      createAssignments({ userId: "user-1", items: [], dueDate: "tomorrow", assignedBy: "hr-1" }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("throws the database error so the UI can report it", async () => {
    const databaseError = new Error("permission denied");
    insertMock.mockResolvedValue({ error: databaseError });

    await expect(
      createAssignments({
        userId: "user-1",
        items: [{ kind: "course", id: "c" }],
        dueDate: "",
        assignedBy: "hr-1",
      }),
    ).rejects.toBe(databaseError);
  });
});

describe("updateAssignmentProgress", () => {
  beforeEach(() => vi.clearAllMocks());

  it("caps progress at 100", async () => {
    eqMock.mockResolvedValue({ error: null });

    await updateAssignmentProgress("assignment-1", 136);

    expect(updateMock).toHaveBeenCalledWith({ progress: 100 });
    expect(eqMock).toHaveBeenCalledWith("id", "assignment-1");
  });
});
