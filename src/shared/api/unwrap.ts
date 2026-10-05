interface SupabaseResult<T> {
  data: T | null;
  error: Error | null;
}

/** Returns the data of a Supabase response, or throws its error so react-query can report it. */
export function unwrapData<T>({ data, error }: SupabaseResult<T>): T {
  if (error) throw error;
  if (data === null) throw new Error("Supabase returned no data");
  return data;
}

/** Throws the error of a Supabase write that returns no rows. */
export function throwIfError({ error }: { error: Error | null }): void {
  if (error) throw error;
}
