import axios, { AxiosError } from 'axios';

export function handleApiError(error: unknown): string | object {
  if (axios.isAxiosError(error)) {
    // Axios error: can have response data or message
    return error.response?.data || error.message;
  } else if (error instanceof Error) {
    // Normal JS error
    return error.message;
  } else {
    // Fallback
    return 'Unknown error occurred';
  }
}
