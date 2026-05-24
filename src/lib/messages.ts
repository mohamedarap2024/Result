/** Client-side message constants (match backend) */
export const MSG = {
  register: {
    success: "Registered successfully",
    failure: "Registration failed. Please try again",
  },
  login: {
    success: "Login successful",
    failure: "Login failed. Unable to verify user",
  },
  search: {
    notFound: "This ID is not registered",
    found: "Student record found",
  },
  save: {
    success: "Data saved successfully",
    failure: "Unable to save data",
  },
  update: {
    success: "Updated successfully",
    failure: "Update failed",
  },
  delete: {
    success: "Deleted successfully",
    failure: "Delete operation failed",
  },
  db: {
    connectionFailed: "Database connection failed",
    unableToProcess: "Unable to process request",
    networkBlocked:
      "Cannot reach API — check NEXT_PUBLIC_API_URL on Vercel and CORS_ORIGIN on backend, then redeploy both",
  },
  backend: {
    operationFailed: "Operation failed. Please try again later",
  },
  upload: {
    success: "Results uploaded successfully",
    failure: "Result upload failed",
  },
} as const;

export function getApiMessage(err: unknown, fallback: string): string {
  const axiosErr = err as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };
  return (
    axiosErr.response?.data?.message ||
    axiosErr.response?.data?.error ||
    (axiosErr.message?.includes("Network Error")
      ? MSG.db.networkBlocked
      : fallback)
  );
}
