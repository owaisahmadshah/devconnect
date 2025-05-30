import { getErrorDetails } from "./errorHanldling";

export const shouldRetry = (failureCount: number, error: unknown) => {
  const err = getErrorDetails(error);
  if (err?.statusCode !== undefined && err?.statusCode >= 400 && err?.statusCode < 500) {
    return false;
  }
  return failureCount < 3;
};