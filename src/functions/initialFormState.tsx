import formDataType from "../types/formDataType";

import saveForms from "./saveForms";
import getForms from "./getForms";

import initialFormFields from "../presets/initialFormFields";

const initialFormState: () => formDataType = () => {
    const localForms: formDataType[] = getForms();

    if (localForms.length > 0) {
      return localForms[0];
    }

    const newForm = {
      created_on: new Date().toString(),
      id: Number(new Date()),
      title: "New Untitled Form",
      formFields: initialFormFields,
    };

    saveForms([...localForms, newForm]);
    return newForm;
  };

export default initialFormState;