import formFieldType from "./formFieldType";

export default interface responseDataType {
  last_modified: string;
  id: number;
  title: string;
  formFields: formFieldType[];
}
