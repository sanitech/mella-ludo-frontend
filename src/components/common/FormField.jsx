import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff, RefreshCw } from "lucide-react";
import { validatePassword, getPasswordStrength, generateRandomPassword, EXAMPLE_PASSWORDS } from "../../utils/passwordHelper";



const FormField = ({
  label,
  name,
  type = "text",
  required = false,
  disabled = false,
  minLength,
  value,
  onChange,
  error,
  placeholder,
  options,
  helpText,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const inputClasses = `input-field mt-1 ${
    disabled ? "disabled:bg-gray-100" : ""
  } ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`;

  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    const event = {
      target: { value: newPassword }
    } 
    onChange(event);
  };

  const renderPasswordField = () => (
    <div className="relative">
      <input
        type={inputType}
        name={name}
        required={required}
        disabled={disabled}
        minLength={minLength}
        className={`${inputClasses} pr-20`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
        {value && (
          <button
            type="button"
            onClick={handleGeneratePassword}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Generate random password"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="p-1 text-gray-400 hover:text-gray-600"
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  const renderPasswordStrength = () => {
    if (!value || value.length === 0) return null;

    const validation = validatePassword(value);
    const strength = getPasswordStrength(value);

    return (
      <div className="mt-2 space-y-2">
        {/* Password strength indicator */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                strength.strength === 'weak' ? 'bg-red-500 w-1/3' :
                strength.strength === 'medium' ? 'bg-yellow-500 w-2/3' :
                'bg-green-500 w-full'
              }`}
            />
          </div>
          <span className={`text-xs font-medium ${
            strength.strength === 'weak' ? 'text-red-600' :
            strength.strength === 'medium' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {strength.strength.charAt(0).toUpperCase() + strength.strength.slice(1)}
          </span>
        </div>

        {/* Validation checklist */}
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className={`flex items-center space-x-1 ${value.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{value.length >= 8 ? '✓' : '○'}</span>
            <span>8+ characters</span>
          </div>
          <div className={`flex items-center space-x-1 ${/[A-Z]/.test(value) ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{/[A-Z]/.test(value) ? '✓' : '○'}</span>
            <span>Uppercase</span>
          </div>
          <div className={`flex items-center space-x-1 ${/[a-z]/.test(value) ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{/[a-z]/.test(value) ? '✓' : '○'}</span>
            <span>Lowercase</span>
          </div>
          <div className={`flex items-center space-x-1 ${/\d/.test(value) ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{/\d/.test(value) ? '✓' : '○'}</span>
            <span>Number</span>
          </div>
          <div className={`flex items-center space-x-1 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) ? '✓' : '○'}</span>
            <span>Special char</span>
          </div>
        </div>

        {/* Example passwords */}
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showExamples ? 'Hide' : 'Show'} example passwords
          </button>
          {showExamples && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
              <p className="text-gray-600 mb-1">Try these examples:</p>
              <div className="grid grid-cols-2 gap-1">
                {EXAMPLE_PASSWORDS.slice(0, 6).map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      const event = { target: { value: example } } 
                      onChange(event);
                    }}
                    className="text-left text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-1 py-0.5 rounded"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && "*"}
      </label>

      {type === "select" && options ? (
        <select
          name={name}
          required={required}
          disabled={disabled}
          className={inputClasses}
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : isPasswordField ? (
        renderPasswordField()
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          disabled={disabled}
          minLength={minLength}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}

      {error && (
        <div className="flex items-center mt-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {helpText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
      )}

      {/* Password strength indicator and examples */}
      {isPasswordField && renderPasswordStrength()}
    </div>
  );
};

export default FormField;
