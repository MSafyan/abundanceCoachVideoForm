const getBackendUrl = () => {
  // This will be replaced at build time with the actual environment
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    return process.env.NEXT_PUBLIC_BACKEND_URL_PROD;
  } else if (process.env.NEXT_PUBLIC_APP_ENV === "staging") {
    return process.env.NEXT_PUBLIC_BACKEND_URL_STAGING;
  } else {
    return process.env.NEXT_PUBLIC_BACKEND_URL_DEV;
  }
};

export const backendUrl = getBackendUrl();
