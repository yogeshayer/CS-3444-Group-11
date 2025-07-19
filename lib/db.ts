import { AstraDB } from "@datastax/astra-db-ts";

export const db = new AstraDB({
  endpoint: process.env.ASTRA_DB_API_ENDPOINT!,
  token: process.env.ASTRA_DB_APPLICATION_TOKEN!,
});
