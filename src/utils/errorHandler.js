export const parseApiError = (error) => {
  if (error.response) {
    const { data, status } = error.response;
    
    if (status === 401) {
      return new Error("Authentication failed. Please login again.");
    }
    
    if (status === 403) {
      return new Error("Access denied. You don't have permission for this action.");
    }
    
    if (status === 404) {
      return new Error("Resource not found.");
    }
    
    if (status === 409) {
      if (data.conflicts && Array.isArray(data.conflicts)) {
        const conflictMessages = data.conflicts.map(conflict => conflict.message).join(", ");
        return new Error(`Conflict: ${conflictMessages}`);
      }
      return new Error(data.message || "Conflict occurred.");
    }
    
    if (status === 422) {
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map(err => err.message).join(", ");
        return new Error(`Validation error: ${errorMessages}`);
      }
      return new Error(data.message || "Validation failed.");
    }
    
    if (status >= 500) {
      return new Error("Server error. Please try again later.");
    }
    
    return new Error(data.message || `Request failed with status ${status}`);
  }
  
  if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK") {
    return new Error("Network error. Please check your connection.");
  }
  
  if (error.code === "ECONNABORTED") {
    return new Error("Request timeout. Please try again.");
  }
  
  return new Error(error.message || "An unexpected error occurred.");
};

export const getFieldError = (errors, field) => {
  const fieldError = errors?.find(
    (err) =>
      err.field.toLowerCase() === field.toLowerCase() ||
      err.field.toLowerCase().includes(field.toLowerCase())
  );
  return fieldError?.message || null;
};

export const formatValidationErrors = (errors) => {
  if (!errors || errors.length === 0) return "";

  return errors.map((err) => `${err.field}: ${err.message}`).join("\n");
};

export const isValidationError = (error) => {
  return !!(error.errors && error.errors.length > 0);
};

export const isConflictError = (error) => {
  return error.status === 409;
};

export const isFieldConflictError = (error) => {
  return isConflictError(error) && !!(error.errors && error.errors.length > 0);
};

// Authentication error helpers
export const isAuthenticationError = (error) => {
  return error.status === 401;
};

export const isPasswordError = (error) => {
  return error.message === "Incorrect password" || 
         (error.hint && error.hint.includes("password"));
};

export const isUsernameError = (error) => {
  return error.message === "Username not found" || 
         (error.hint && error.hint.includes("username"));
};

export const isAccountDisabledError = (error) => {
  return error.message === "Account disabled" || 
         error.error === "ACCOUNT_DISABLED";
};

export const isMissingCredentialsError = (error) => {
  return error.message === "Missing credentials" || 
         error.error === "MISSING_CREDENTIALS";
};
