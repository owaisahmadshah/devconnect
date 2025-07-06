export type ApiResponse<T> = {
  statusCode: number;
  data: T;
  message: string;
};
