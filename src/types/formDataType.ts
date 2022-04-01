import formFieldType from "./formFieldType";

export default interface formDataType {
    created_on: string;
    id: number;
    title: string;
    formFields: formFieldType[];
  }