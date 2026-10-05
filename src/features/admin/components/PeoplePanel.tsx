import { useQuery } from "@tanstack/react-query";
import { profilesQuery, rolesByUserQuery } from "@/shared/api/profiles";
import { PersonRolesRow } from "./PersonRolesRow";

export function PeoplePanel() {
  const { data: people = [] } = useQuery(profilesQuery);
  const { data: rolesByUser = {} } = useQuery(rolesByUserQuery);
  const managers = people.filter((person) => rolesByUser[person.id]?.includes("manager"));

  return (
    <div className="glass overflow-hidden rounded-2xl">
      {people.map((person) => (
        <PersonRolesRow
          key={person.id}
          person={person}
          roles={rolesByUser[person.id] ?? []}
          managerOptions={managers.filter((manager) => manager.id !== person.id)}
        />
      ))}
    </div>
  );
}
