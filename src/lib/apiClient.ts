import axios, { AxiosError, AxiosResponse } from 'axios';
import { log } from 'console';
import { get as lodashGet } from 'lodash';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    'API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your .env.local file.'
  );
}

class ApiClientError extends Error {
  public statusCode: number;
  public errorData: any;

  constructor(
    message: string,
    statusCode: number = 500,
    errorData: any = null
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.errorData = errorData;
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true
  // headers: {
  //   'Content-Type': 'application/json'
  // }
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    // Error Interceptor for failed requests
    const response = error.response;
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let statusCode = 500;
    let errorData = null;

    if (response) {
      statusCode = response.status;
      errorData = response.data;
      errorMessage =
        lodashGet(response.data, 'message') ||
        lodashGet(response.data, 'error') ||
        error.message;

      if (statusCode === 401) {
        console.error('Authentication error. You may need to log in again.');
        // Here you could emit an event to trigger a global logout
        // eventEmitter.emit('signOut');
      }
    } else if (error.request) {
      errorMessage =
        'The server is not responding. Please check your network connection.';
      statusCode = 503;
    }

    // Reject with a structured custom error
    return Promise.reject(
      new ApiClientError(errorMessage, statusCode, errorData)
    );
  }
);

const apiClientFileDownload = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true
});

// IMPORTANT: Add the ERROR interceptor to the new client as well,
// but NOT the success interceptor that returns response.data
apiClientFileDownload.interceptors.response.use(
  (response: AxiosResponse) => {
    // For this client, we return the full response object
    // or let it pass through to allow direct access to headers
    return response;
  },
  (error: AxiosError) => {
    // Re-use the same error handling logic
    const response = error.response;
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let statusCode = 500;
    let errorData = null;

    if (response) {
      statusCode = response.status;
      errorData = response.data;
      errorMessage =
        lodashGet(response.data, 'message') ||
        lodashGet(response.data, 'error') ||
        error.message;

      if (statusCode === 401) {
        console.error('Authentication error. You may need to log in again.');
      }
    } else if (error.request) {
      errorMessage =
        'The server is not responding. Please check your network connection.';
      statusCode = 503;
    }

    return Promise.reject(
      new ApiClientError(errorMessage, statusCode, errorData)
    );
  }
);

const get = <T>(url: string, config?: object): Promise<T> =>
  apiClient.get<T, T>(url, config);
const post = <T>(url: string, data?: any, config?: object): Promise<T> =>
  apiClient.post<T, T>(url, data, config);
const put = <T>(url: string, data?: any, config?: object): Promise<T> =>
  apiClient.put<T, T>(url, data, config);
const del = <T>(url: string, config?: object): Promise<T> =>
  apiClient.delete<T, T>(url, config);

const fetchData = async (apiCall: Promise<any>) => {
  try {
    // If the call is successful, the interceptor has already returned the data.
    return await apiCall;
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        code: error.statusCode,
        message: error.message,
        data: error.errorData
      };
    }
    // Fallback for non-API errors
    return {
      code: 'FAILED',
      message: (error as Error).message,
      data: null
    };
  }
};

export const GetCall = (url: string, headers = {}) =>
  fetchData(get(url, { headers }));
export const PostCall = (url: string, payload = {}, headers = {}) =>
  fetchData(post(url, payload, { headers }));
export const PutCall = (url: string, payload = {}, headers = {}) =>
  fetchData(put(url, payload, { headers }));
export const DeleteCall = (url: string, payload = {}, headers = {}) =>
  fetchData(del(url, { data: payload, headers }));

const handleFileDownload = (
  response: AxiosResponse,
  defaultFilename: string
) => {
  console.log('called');

  const contentDisposition = response.headers['content-disposition'];
  let filename = defaultFilename;

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch && filenameMatch.length > 1) {
      filename = filenameMatch[1];
    }
  }

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  // window.open(url, '_blank');
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const GetPdfCall = async (
  url: string,
  filename: string = 'download.pdf',
  headers: object = {}
) => {
  try {
    const response = await apiClientFileDownload.get(url, {
      headers,
      responseType: 'blob'
    });
    handleFileDownload(response, filename);
    return { code: 'SUCCESS', message: 'Report downloaded!' };
  } catch (error: any) {
    return {
      code: 'FAILED',
      message: error.message || 'Failed to download PDF',
      data: null
    };
  }
};

export const PostPdfCall = async (
  url: string,
  payload: object = {},
  headers: object = {}
) => {
  try {
    const response = await apiClientFileDownload.post(url, payload, {
      headers,
      responseType: 'blob'
    });
    handleFileDownload(response, 'downloaded.pdf');
    return { code: 'SUCCESS', message: 'PDF downloaded!' };
  } catch (error: any) {
    return {
      code: 'FAILED',
      message: error.message || 'Failed to download PDF',
      data: null
    };
  }
};

export const GetExcelCall = async (
  url: string,
  filename: string = 'download',
  headers: object = {}
) => {
  try {
    // Use the new client here
    const response = await apiClientFileDownload.get(url, {
      headers,
      responseType: 'blob'
    });

    // NOW response.headers WILL BE DEFINED!
    const contentDisposition = response.headers['content-disposition'];
    let finalFilename = filename;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length > 1) {
        finalFilename = filenameMatch[1];
      }
    }

    const contentType = response.headers['content-type'];
    let extension = 'xlsx';
    if (
      contentType?.includes('ms-excel') ||
      contentType?.includes('application/vnd.ms-excel')
    ) {
      extension = 'xls';
    } else if (
      contentType?.includes('spreadsheetml') ||
      contentType?.includes(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
    ) {
      extension = 'xlsx';
    } else if (contentType?.includes('csv')) {
      extension = 'csv';
    }

    if (!finalFilename.includes('.')) {
      finalFilename = `${finalFilename}.${extension}`;
    }

    handleFileDownload(response, finalFilename);
    return { code: 'SUCCESS', message: 'File downloaded successfully' };
  } catch (error: any) {
    return {
      code: 'FAILED',
      message: error.message || 'Failed to download Excel file',
      data: null
    };
  }
};
