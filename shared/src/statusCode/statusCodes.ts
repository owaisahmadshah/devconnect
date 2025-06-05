/**
 * HTTP Status Codes
 *
 * This file contains standardized HTTP status codes as constants.
 * Each status code includes a comment explaining when to use it.
 */

export const HttpStatus = {
  // 1XX - INFORMATIONAL
  /**
   * 100 Continue
   * The server has received the request headers and the client should proceed to send the request body.
   * Useful for large data uploads to confirm the server is willing to accept the request before sending large payloads.
   */
  CONTINUE: 100,

  /**
   * 101 Switching Protocols
   * The server is switching protocols as requested by the client (e.g., upgrading to WebSockets).
   */
  SWITCHING_PROTOCOLS: 101,

  /**
   * 102 Processing
   * The server has received and is processing the request, but no response is available yet.
   * Prevents the client from timing out during long-running operations.
   */
  PROCESSING: 102,

  /**
   * 103 Early Hints
   * Used to return preliminary headers before the final HTTP message.
   * Allows clients to preload resources while the server prepares the final response.
   */
  EARLY_HINTS: 103,

  // 2XX - SUCCESS
  /**
   * 200 OK
   * Standard success response. The request has succeeded.
   * Use for successful GET requests and other successful operations that return data.
   */
  OK: 200,

  /**
   * 201 Created
   * The request has succeeded and a new resource has been created.
   * Typically used as a response to POST requests that create new resources.
   */
  CREATED: 201,

  /**
   * 202 Accepted
   * The request has been accepted for processing, but processing is not yet complete.
   * Use for asynchronous operations where the result isn't immediately available.
   */
  ACCEPTED: 202,

  /**
   * 204 No Content
   * The request succeeded but returns no message body.
   * Use for successful operations that don't need to return data (e.g., DELETE operations).
   */
  NO_CONTENT: 204,

  /**
   * 206 Partial Content
   * The server is delivering only part of the resource due to a range header sent by the client.
   * Used for resumable downloads and video/audio streaming.
   */
  PARTIAL_CONTENT: 206,

  // 3XX - REDIRECTION
  /**
   * 300 Multiple Choices
   * The requested resource has multiple representations available.
   * The client should choose one of them.
   */
  MULTIPLE_CHOICES: 300,

  /**
   * 301 Moved Permanently
   * The requested resource has been permanently moved to a new URL.
   * Clients should update their links/bookmarks.
   */
  MOVED_PERMANENTLY: 301,

  /**
   * 302 Found (Previously "Moved Temporarily")
   * The requested resource temporarily resides at a different URL.
   * Use for temporary redirects where the original URL should still be used for future requests.
   */
  FOUND: 302,

  /**
   * 303 See Other
   * The response to the request can be found at another URI using a GET method.
   * Often used after POST operations to redirect to a resource.
   */
  SEE_OTHER: 303,

  /**
   * 304 Not Modified
   * The resource has not been modified since the last request.
   * Used with conditional GET requests to reduce bandwidth usage.
   */
  NOT_MODIFIED: 304,

  /**
   * 307 Temporary Redirect
   * The requested resource temporarily resides at another URI.
   * Similar to 302 but guarantees the method won't change.
   */
  TEMPORARY_REDIRECT: 307,

  /**
   * 308 Permanent Redirect
   * The resource has been permanently moved to another URI.
   * Similar to 301 but guarantees the method won't change.
   */
  PERMANENT_REDIRECT: 308,

  // 4XX - CLIENT ERRORS
  /**
   * 400 Bad Request
   * The server cannot process the request due to a client error (e.g., malformed syntax, invalid request message framing, or deceptive request routing).
   * Use when the client sends a request the server cannot understand.
   */
  BAD_REQUEST: 400,

  /**
   * 401 Unauthorized
   * Authentication is required and has failed or has not been provided.
   * Use when a user needs to provide valid credentials before accessing a resource.
   */
  UNAUTHORIZED: 401,

  /**
   * 402 Payment Required
   * Reserved for future use. Originally intended for digital payment systems.
   * Some APIs use this for subscription-based features.
   */
  PAYMENT_REQUIRED: 402,

  /**
   * 403 Forbidden
   * The client does not have access rights to the content.
   * Unlike 401, authentication won't help. Use when a user is authenticated but lacks permission.
   */
  FORBIDDEN: 403,

  /**
   * 404 Not Found
   * The requested resource could not be found on the server.
   * Use when a resource doesn't exist or when hiding the existence of a resource from unauthorized users.
   */
  NOT_FOUND: 404,

  /**
   * 405 Method Not Allowed
   * The request method is not supported for the requested resource.
   * Use when an HTTP method (GET, POST, etc.) is not allowed for a particular resource.
   */
  METHOD_NOT_ALLOWED: 405,

  /**
   * 406 Not Acceptable
   * The server cannot produce a response matching the list of acceptable values in the request's headers.
   * Used when content negotiation fails.
   */
  NOT_ACCEPTABLE: 406,

  /**
   * 408 Request Timeout
   * The server timed out waiting for the request from the client.
   * Use when a client starts a request but doesn't complete it within the server's timeout period.
   */
  REQUEST_TIMEOUT: 408,

  /**
   * 409 Conflict
   * The request conflicts with the current state of the resource.
   * Use for concurrent modifications, version conflicts, or other data conflicts.
   */
  CONFLICT: 409,

  /**
   * 410 Gone
   * The requested resource is no longer available and will not be available again.
   * Use for permanently removed resources (different from 404 which may be temporary).
   */
  GONE: 410,

  /**
   * 412 Precondition Failed
   * The server doesn't meet one of the preconditions specified in the request headers.
   * Use with conditional requests (If-Match, If-None-Match, etc.).
   */
  PRECONDITION_FAILED: 412,

  /**
   * 413 Payload Too Large
   * The request entity is larger than the server is willing or able to process.
   * Use when enforcing size limits on uploaded files or request bodies.
   */
  PAYLOAD_TOO_LARGE: 413,

  /**
   * 414 URI Too Long
   * The URI requested by the client is longer than the server is willing to interpret.
   * Use when limiting the size of GET request query parameters.
   */
  URI_TOO_LONG: 414,

  /**
   * 415 Unsupported Media Type
   * The request entity has a media type which the server or resource does not support.
   * Use when restricting content types (e.g., accepting only JSON or XML).
   */
  UNSUPPORTED_MEDIA_TYPE: 415,

  /**
   * 416 Range Not Satisfiable
   * The client has asked for a portion of the file, but the server cannot supply that portion.
   * Use for range requests where the range is invalid.
   */
  RANGE_NOT_SATISFIABLE: 416,

  /**
   * 422 Unprocessable Entity
   * The request was well-formed but was unable to be followed due to semantic errors.
   * Use for validation errors where the syntax is correct but the content is invalid.
   */
  UNPROCESSABLE_ENTITY: 422,

  /**
   * 423 Locked
   * The resource that is being accessed is locked.
   * Use when a resource cannot be modified because it's locked by another process.
   */
  LOCKED: 423,

  /**
   * 429 Too Many Requests
   * The user has sent too many requests in a given amount of time.
   * Use for rate limiting or throttling.
   */
  TOO_MANY_REQUESTS: 429,

  /**
   * 451 Unavailable For Legal Reasons
   * The server is denying access to the resource as a consequence of a legal demand.
   * Use for content that's been blocked for legal reasons.
   */
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,

  // 5XX - SERVER ERRORS
  /**
   * 500 Internal Server Error
   * A generic error message when the server encounters an unexpected condition.
   * Use as a catch-all for unhandled server-side errors.
   */
  INTERNAL_SERVER_ERROR: 500,

  /**
   * 501 Not Implemented
   * The server does not support the functionality required to fulfill the request.
   * Use when a feature or endpoint is planned but not yet implemented.
   */
  NOT_IMPLEMENTED: 501,

  /**
   * 502 Bad Gateway
   * The server was acting as a gateway or proxy and received an invalid response from the upstream server.
   * Use when a proxied request fails because of the upstream server.
   */
  BAD_GATEWAY: 502,

  /**
   * 503 Service Unavailable
   * The server is currently unable to handle the request due to temporary overloading or maintenance.
   * Use during maintenance windows or when under excessive load.
   */
  SERVICE_UNAVAILABLE: 503,

  /**
   * 504 Gateway Timeout
   * The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
   * Use when a proxied request times out.
   */
  GATEWAY_TIMEOUT: 504,

  /**
   * 507 Insufficient Storage
   * The server is unable to store the representation needed to complete the request.
   * Use when the server runs out of storage space.
   */
  INSUFFICIENT_STORAGE: 507,

  /**
   * 511 Network Authentication Required
   * The client needs to authenticate to gain network access.
   * Commonly used by captive portals like public WiFi login pages.
   */
  NETWORK_AUTHENTICATION_REQUIRED: 511,
} as const;

/**
 * Type definition for HTTP status codes
 * This allows for type-safe usage of status codes throughout the application
 */
export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];

/**
 * Helper function to check if a status code indicates success (2xx)
 * @param {number} statusCode - The HTTP status code to check
 * @returns {boolean} True if the status code is in the 2xx range
 */
export const isSuccessStatus = (statusCode: number): boolean => {
  return statusCode >= 200 && statusCode < 300;
};

/**
 * Helper function to check if a status code indicates client error (4xx)
 * @param {number} statusCode - The HTTP status code to check
 * @returns {boolean} True if the status code is in the 4xx range
 */
export const isClientErrorStatus = (statusCode: number): boolean => {
  return statusCode >= 400 && statusCode < 500;
};

/**
 * Helper function to check if a status code indicates server error (5xx)
 * @param {number} statusCode - The HTTP status code to check
 * @returns {boolean} True if the status code is in the 5xx range
 */
export const isServerErrorStatus = (statusCode: number): boolean => {
  return statusCode >= 500 && statusCode < 600;
};

/**
 * Helper function to get a default message for a status code
 * @param {HttpStatusCode} statusCode - The HTTP status code
 * @returns {string} A human-readable default message for the status code
 */
export const getDefaultMessageForStatus = (statusCode: HttpStatusCode): string => {
  switch (statusCode) {
    case HttpStatus.OK:
      return 'Request successful';
    case HttpStatus.CREATED:
      return 'Resource created successfully';
    case HttpStatus.NO_CONTENT:
      return 'Request successful, no content to return';
    case HttpStatus.BAD_REQUEST:
      return 'Invalid request parameters';
    case HttpStatus.UNAUTHORIZED:
      return 'Authentication required';
    case HttpStatus.FORBIDDEN:
      return 'You do not have permission to access this resource';
    case HttpStatus.NOT_FOUND:
      return 'The requested resource was not found';
    case HttpStatus.METHOD_NOT_ALLOWED:
      return 'This method is not allowed for the requested resource';
    case HttpStatus.CONFLICT:
      return 'The request conflicts with the current state of the resource';
    case HttpStatus.GONE:
      return 'The requested resource is no longer available';
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'Validation failed for the provided data';
    case HttpStatus.TOO_MANY_REQUESTS:
      return 'Rate limit exceeded, please try again later';
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return 'An unexpected error occurred on the server';
    case HttpStatus.BAD_GATEWAY:
      return 'The server received an invalid response from an upstream server';
    case HttpStatus.SERVICE_UNAVAILABLE:
      return 'Service temporarily unavailable, please try again later';
    default:
      return 'Unknown status';
  }
};
