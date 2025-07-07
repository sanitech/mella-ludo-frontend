import React, { useState } from "react";
import { adminService } from "../../services/adminService";
import {
  parseApiError,
  isValidationError,
  isConflictError,
  isFieldConflictError,
} from "../../utils/errorHandler";
import toast from "react-hot-toast";

const ErrorTest= () => {
  const [testData, setTestData] = useState({
    username: "superadmin",
    email: "test@example.com",
    password: "TestPass123!",
    role: "admin",
  });
  const [result, setResult] = useState(null);

  const test409Error = async () => {
    try {
      console.log("Testing with data:", testData);
      const response = await adminService.createAdmin(testData);
      setResult({ success: true, data: response });
    } catch (error) {
      console.error("Error caught:", error);
      console.error("Error response:", error.response);

      const parsedError = parseApiError(error);
      console.error("Parsed error:", parsedError);
      console.error("Is validation error:", isValidationError(parsedError));
      console.error("Is conflict error:", isConflictError(parsedError));
      console.error(
        "Is field conflict error:",
        isFieldConflictError(parsedError)
      );

      setResult({
        success: false,
        error: parsedError,
        isValidationError: isValidationError(parsedError),
        isConflictError: isConflictError(parsedError),
        isFieldConflictError: isFieldConflictError(parsedError),
      });
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">409 Error Test</h3>

      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Username"
          value={testData.username}
          onChange={(e) =>
            setTestData({ ...testData, username: e.target.value })
          }
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={testData.email}
          onChange={(e) => setTestData({ ...testData, email: e.target.value })}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={testData.password}
          onChange={(e) =>
            setTestData({ ...testData, password: e.target.value })
          }
          className="input-field"
        />
      </div>

      <button onClick={test409Error} className="btn-primary">
        Test 409 Error
      </button>

      {result && (
        <div className="mt-4 p-4 bg-white rounded border">
          <h4 className="font-bold">Result:</h4>
          <pre className="text-xs mt-2 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ErrorTest;
