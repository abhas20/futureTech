const InputField = ({ label, type = "text", value, onChange, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
};

export default InputField;
