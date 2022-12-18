export const CONFIG = {
  API_HOST: import.meta.env.VITE_API_HOST || '',
  CABLE_API_HOST:
    import.meta.env.VITE_CABLE_API_HOST?.replace(
      'localhost',
      window.location.hostname
    ) || '/cable',
};
