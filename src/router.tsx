import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { reportDataError } from "@/shared/lib/data-errors";

// Every failed read or write is logged and shown as a toast here, so components don't repeat it.
function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) =>
        reportDataError(error, "Loading data failed", { queryKey: query.queryKey }),
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) =>
        reportDataError(error, "Saving data failed", { mutationKey: mutation.options.mutationKey }),
    }),
  });
}

export const getRouter = () => {
  const queryClient = createQueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
