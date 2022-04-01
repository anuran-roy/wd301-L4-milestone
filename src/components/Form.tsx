import React, { useState, useRef, useEffect } from "react";
import LabelledInput from "./LabelledInput";
import getForms from "../functions/getForms";
import saveForms from "../functions/saveForms";
import AppContainer from "./AppContainer";
interface formFieldType {
  id: number,
  label: string,
  fieldType: string,
  value: string
}

interface formDataType {
  created_on: string,
  id: number,
  title: string,
  formFields: formFieldType[]
}

const initialFormFields: formFieldType[] = [
  { id: 1, label: "First Name", fieldType: "text", value: "" },
  { id: 2, label: "Last Name", fieldType: "text", value: "" },
  { id: 3, label: "Email", fieldType: "email", value: "" },
  { id: 4, label: "Date of Birth", fieldType: "date", value: "" },
];


export default function Form(props: { formId: number }) {
  const initialFormState: () => formDataType = () => {
    const localForms = getForms();

    if (localForms.length > 0) {
      return localForms.filter(form => form.id === props.formId)[0];
    }

    const newForm = {
      created_on: (new Date()).toString(),
      id: Number(new Date()),
      title: "New Untitled Form",
      formFields: initialFormFields,
    };

    saveForms([...localForms, newForm]);
    return newForm;
  };

  const [formState, setFormState] = useState(() => initialFormState());
  const [newField, setNewField] = useState("");

  const initialAutoSaveState: () => boolean = () => {
    let prevAutoSaveState: any = localStorage.getItem("autoSave");
    let persistentAutoSaveState: boolean = prevAutoSaveState
      ? JSON.parse(prevAutoSaveState)
      : false;
  
    return persistentAutoSaveState;
  };

  const [autoSaveState, setAutoSaveState] = useState(initialAutoSaveState());

  const saveForm = (currentState: formDataType) => {
    const localForms = getForms();
    const updatedLocalForms = localForms.map((form) => {
      return form.id === currentState.id ? currentState : form;
    });
    saveForms(updatedLocalForms);
    localStorage.setItem("autoSave", JSON.stringify(autoSaveState));
  };

  useEffect(() => {
    if (autoSaveState === true) {
      const timeout = setTimeout(() => {
        saveForm(formState);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [formState]);

  const switchAutoSave = () => {
    if (autoSaveState === true) {
      setAutoSaveState(false);
    } else {
      setAutoSaveState(true);
    }
  };

  const addField = () => {
    let field_type: string = "text";
    if (newField.toLowerCase() === "password") {
      field_type = "password";
    }
    if (newField.length === 0) {
      alert("Can't add a field with empty name!");
    } else {
      setFormState({
        ...formState,
        formFields: [
          ...formState.formFields,
          {
            id: Number(new Date()),
            label: newField,
            fieldType: field_type,
            value: "",
          },
        ],
      });

      setNewField("");
    }
  };

  const clearFields = () => {
    setFormState({
      ...formState,
      formFields: formState.formFields.map((field) => {
        return { ...field, value: "" };
      }),
    });
  };

  const removeField = (id: number) => {
    setFormState({
      ...formState,
      formFields: formState.formFields.filter((field) => {
        return field.id !== id;
      }),
    });
  };

  const updateField = (e_value: string, id: number) => {
    setFormState({
      ...formState,
      formFields: formState.formFields.map((field) => {
        if (field.id === id) {
          return {
            ...field,
            value: e_value,
          };
        }

        return field;
      }),
    });
  };

  const setTitle = (formId: number, title: string) => {
    setFormState({...formState, title: title});
    saveForm(formState);
  }
  return (
    <AppContainer>
    <div className="flex flex-col justify-center m-6 p-5 align-middle">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* <label htmlFor="formTitle">Form Name: </label> */}
        <div className="divide-y-8 divide-black-500">
        <input
          type="text"
          className="my-2 flex-1 text-4xl focus:rounded-lg border-b-2 border-white hover:border-sky-500 p-2"
          value={formState.title}
          onChange={(e) => {setTitle(props.formId, e.target.value)}}
          placeholder="Enter form name..."
          id="formTitle"></input></div><br />
        {formState.formFields.map((field) => (
          <LabelledInput
            id={field.id}
            key={field.id}
            label={field.label}
            fieldType={field.fieldType}
            removeFieldCB={removeField}
            value={field.value}
            updateFieldCB={updateField}
          />
        ))}

        <button
          type="submit"
          // onClick={document.forms[0].submit()}
          className="btn m-4 rounded-lg bg-sky-500 py-2 px-4 font-bold text-white hover:bg-sky-700"
        >
          Submit
        </button>
        <a href="/"><button
          className="btn m-4 rounded-lg bg-sky-500 py-2 px-4 font-bold text-white hover:bg-sky-700"
        >
          Close Form
        </button></a>
        <button
          onClick={clearFields}
          className="btn m-4 rounded-lg bg-sky-500 py-2 px-4 font-bold text-white hover:bg-sky-700"
        >
          Clear Form
        </button>
        <button
          onClick={(_) => {saveForm(formState)}}
          className="btn m-4 rounded-lg bg-sky-500 py-2 px-4 font-bold text-white hover:bg-sky-700"
        >
          Save Form
        </button>
      </form>
      <div className="flex">
        <input
          type="text"
          className="my-2 flex-1 rounded-lg border-2 border-gray-200 p-2"
          placeholder="Enter new field name..."
          id="addFieldInput"
          value={newField}
          onChange={(e: any) => {
            e.preventDefault();
            // console.log(e.target.value);
            setNewField(e.target.value);
          }}
        />
        <button
          onClick={addField}
          className="btn m-4 rounded-lg bg-sky-500 py-2 px-4 font-bold text-white hover:bg-sky-700"
        >
          Add Field
        </button>
        <div className="my-2 flex-1 items-center py-2">
              <label htmlFor="autoSave" className="px-2">
                Autosave?
              </label>
              <input
                type="checkbox"
                name="autosave"
                id="autoSave"
                defaultChecked={autoSaveState}
                onClick={(_) => {
                  switchAutoSave();
                }}
              ></input>
            </div>
      </div>
    </div>
    </AppContainer>
  );
}
