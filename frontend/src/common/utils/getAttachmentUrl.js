/**
 * Builds an authenticated URL for file attachments.
 * Converts the API base URL to the server root and appends a token for authentication.
 *
 * @param {Object} attachment - The attachment object with a `url` property (relative path).
 * @param {string} token - The JWT auth token.
 * @returns {string|null} The full authenticated URL, or null if inputs are invalid.
 */
export const getAttachmentUrl = (attachment, token) => {
  if (!attachment?.url || !token) return null;

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");
  const fullUrl = `${baseUrl}${attachment.url}`;
  return `${fullUrl}?token=${encodeURIComponent(token)}`;
};
