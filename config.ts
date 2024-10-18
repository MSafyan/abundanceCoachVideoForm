var backendUrl = process.env.BACKEND_URL_DEV;

if (process.env.NODE_ENV === "production") {
  backendUrl = process.env.BACKEND_URL_PROD;
  // @ts-ignore
} else if (process.env.NODE_ENV === "staging") {
  backendUrl = process.env.BACKEND_URL_STAGING;
}

export { backendUrl };
