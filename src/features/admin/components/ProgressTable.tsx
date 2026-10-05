import { useState } from "react";
import { EmptyState } from "@/shared/components/EmptyState";
import type { Assignment, Profile } from "@/shared/api/types";
import { AssignDialog } from "./AssignDialog";
import { ProgressTableRow } from "./ProgressTableRow";

interface ProgressTableProps {
  people: Profile[];
  assignments: Assignment[];
  emptyMessage: string;
}

function groupAssignmentsByUser(assignments: Assignment[]): Map<string, Assignment[]> {
  const assignmentsByUser = new Map<string, Assignment[]>();
  for (const assignment of assignments) {
    const userAssignments = assignmentsByUser.get(assignment.user_id) ?? [];
    userAssignments.push(assignment);
    assignmentsByUser.set(assignment.user_id, userAssignments);
  }
  return assignmentsByUser;
}

export function ProgressTable({ people, assignments, emptyMessage }: ProgressTableProps) {
  const [editedPerson, setEditedPerson] = useState<Profile | null>(null);
  if (people.length === 0) return <EmptyState message={emptyMessage} />;

  const assignmentsByUser = groupAssignmentsByUser(assignments);

  return (
    <>
      <div className="glass overflow-hidden rounded-2xl">
        {people.map((person) => (
          <ProgressTableRow
            key={person.id}
            person={person}
            assignments={assignmentsByUser.get(person.id) ?? []}
            onAssign={() => setEditedPerson(person)}
          />
        ))}
      </div>
      <AssignDialog employee={editedPerson} onClose={() => setEditedPerson(null)} />
    </>
  );
}
