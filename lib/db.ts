import { createClient } from "@datastax/astra-db-ts";

export const client = createClient({
  endpoint: process.env.ASTRA_DB_API_ENDPOINT!,
  token: process.env.ASTRA_DB_APPLICATION_TOKEN!,
});
