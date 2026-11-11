export const getEnv = () => {
  const {
    VITE_API_DOMAIN,
    VITE_MEDIA_DOMAIN,
    VITE_FILE_API_DOMAIN = 'http://localhost:8000',
    ...otherViteConfig
  } = import.meta.env;

  return {
    API_BASE_URL: `${VITE_API_DOMAIN}/api`,
    MEDIA_BASE_URL: `${VITE_MEDIA_DOMAIN}/media`,
    FILE_API_BASE_URL: VITE_FILE_API_DOMAIN.replace(/\/$/, ''),
    __vite__: otherViteConfig,
  };
};
