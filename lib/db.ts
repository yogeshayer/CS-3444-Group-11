import { AstraDB } from "@datastax/astra-db-ts";

export const client = new AstraDB({
  databaseId: process.env.ASTRA_DB_ID!,
  region: process.env.ASTRA_DB_REGION!,
  applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN!,
});
