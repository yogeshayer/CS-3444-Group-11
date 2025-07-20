import { createClient } from "@datastax/astra-db-ts";

export const db = createClient({
  endpoint: "https://choreboarddb-2256d123-7e37-4a2f-8b36-5c3be48e27a5-us-east1.apps.astra.datastax.com",
  token: "AstraCS:fBcNpLyyHjuJJBMWAahMkTrc:c2505efed17efd73ad33695c01ed8a158917373e6f6900c24b77c8a3a90112be",
});
