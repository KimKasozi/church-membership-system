/**
 * File storage abstraction.
 * Primary implementation: Vercel Blob.
 * Can be swapped for S3 / R2 later without changing callers.
 */

export interface UploadResult {
  storageKey: string;
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export async function uploadFile(
  file: File | Buffer,
  options: {
    fileName: string;
    contentType: string;
    folder?: string;
  }
): Promise<UploadResult> {
  // TODO: Implement with @vercel/blob put()
  // For now throw so callers know it is not ready
  throw new Error(
    "File storage not yet configured. Set BLOB_READ_WRITE_TOKEN and implement uploadFile."
  );
}

export async function getSignedDownloadUrl(
  storageKey: string,
  expiresInSeconds = 3600
): Promise<string> {
  throw new Error("getSignedDownloadUrl not yet implemented");
}

export async function deleteFile(storageKey: string): Promise<void> {
  throw new Error("deleteFile not yet implemented");
}
