declare global {
  namespace NodeJS {
    interface Process {
      NODE_ENV: 'development' | 'production';
      env: {
        NEXT_PUBLIC_API_URL: string;
      }
    }
  }
}

export const siteName = process.env.NEXT_PUBLIC_API_URL;
