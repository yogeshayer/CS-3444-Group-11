import { createClient } from "@datastax/astra-db-ts";

const client = createClient({
  databaseId: process.env.ASTRA_DB_ID!,
  region: process.env.ASTRA_DB_REGION!,
  applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN!,
});
