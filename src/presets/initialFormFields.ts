import formFieldType from "../types/formFieldType";

const initialFormFields: formFieldType[] = [
    { id: 1, label: "First Name", fieldType: "text", value: "" },
    { id: 2, label: "Last Name", fieldType: "text", value: "" },
    { id: 3, label: "Email", fieldType: "email", value: "" },
    { id: 4, label: "Date of Birth", fieldType: "date", value: "" },
  ];

export default initialFormFields;