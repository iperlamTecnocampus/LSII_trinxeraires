import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "../types/my-openapi-3-schema";

const fetchClient = createFetchClient<paths>({
  baseUrl: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const $api = createClient(fetchClient);

export { fetchClient };