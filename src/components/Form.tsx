import React, { useState, useEffect } from "react";
import Label from "./Labels";
import getForms from "../functions/getForms";
import saveForms from "../functions/saveForms";
import AppContainer from "./AppContainer";
import { Link } from "raviger";

import Header from "./Header";

interface formFieldType {
  id: number;
  label: string;
  fieldType: string;
  value: string;
}

interface formDataType {
  created_on: string;
  id: number;
  title: string;
  formFields: formFieldType[];
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
      return localForms.filter((form) => form.id === props.formId)[0];
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

  const addField = (field_type: string) => {
    // let field_type: string = "text";
    // if (newField.toLowerCase() === "password") {
    //   field_type = "password";
    // }
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

  const clearLabels = () => {
    setFormState({
      ...formState,
      formFields: formState.formFields.map((field) => {
        return { ...field, label: "" };
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

  // const updateField = (e_value: string, id: number) => {
  //   setFormState({
  //     ...formState,
  //     formFields: formState.formFields.map((field) => {
  //       if (field.id === id) {
  //         return {
  //           ...field,
  //           value: e_value,
  //         };
  //       }

  //       return field;
  //     }),
  //   });
  // };

  const updateLabel = (label_value: string, id: number) => {
    setFormState({
      ...formState,
      formFields: formState.formFields.map((field) => {
        if (field.id === id) {
          return {
            ...field,
            label: label_value,
          };
        }

        return field;
      }),
    });
  };

  const setTitle = (formId: number, title: string) => {
    setFormState({ ...formState, title: title });
    saveForm(formState);
  };
  return (
    <AppContainer>
      <Header title="" />
      <div className="m-6 flex flex-col justify-center p-5 align-middle">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {/* <label htmlFor="formTitle">Form Name: </label> */}
          <div className="divide-black-500 flex divide-y-8">
            <input
              type="text"
              className="my-2 h-14 w-14 flex-1 items-center border-0 p-2 text-center text-4xl hover:border-b-2 hover:border-b-sky-500 focus:border-b-2 focus:border-b-sky-500 focus:outline-none focus:ring-0"
              value={formState.title}
              onChange={(e) => {
                setTitle(props.formId, e.target.value);
              }}
              placeholder="Enter form name..."
              id="formTitle"
            ></input>
          </div>
          <br />
          {formState.formFields.map((field) => (
            <Label
              id={field.id}
              key={field.id}
              label={field.label}
              fieldType={field.fieldType}
              removeFieldCB={removeField}
              value={field.value}
              updateLabelCB={updateLabel}
            />
          ))}
          <div className="flex gap-6">
            {/* <div
              // type="submit"
              onClick={(_) => {
                document.forms[0].submit();
              }}
              className="btn my-4 rounded-md bg-sky-500 py-2 px-4 font-bold text-white hover:cursor-pointer hover:bg-sky-700"
            >
              Submit
            </div> */}
            <Link href="/">
              <div className="my-4 rounded-md bg-sky-500 py-2 px-4 font-bold text-white hover:bg-sky-700">
                Close Form
              </div>{" "}
            </Link>
            <div
              onClick={clearLabels}
              className="btn my-4 rounded-md bg-sky-500 py-2 px-4 font-bold text-white hover:cursor-pointer hover:bg-sky-700"
            >
              Clear Labels
            </div>
            <div
              onClick={(_) => {
                saveForm(formState);
              }}
              className="btn my-4 rounded-md bg-sky-500 py-2 px-4 font-bold text-white hover:cursor-pointer hover:bg-sky-700"
            >
              Save Form
            </div>
          </div>
        </form>
        <div className="flex">
          <input
            type="text"
            className="my-2 flex-1 rounded-md border-2 border-gray-200 p-2"
            placeholder="Enter new field name..."
            id="addFieldInput"
            value={newField}
            onChange={(e: any) => {
              e.preventDefault();
              // console.log(e.target.value);
              setNewField(e.target.value);
            }}
          />
          <select
            id="fieldOptions"
            name="fieldOptions"
            className="mx-5 rounded-md px-3"
          >
            <optgroup label="Textual">
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
              <option value="url">URL</option>
            </optgroup>
            <optgroup label="Numeric">
              <option value="number">Number</option>
              <option value="tel">Phone Number</option>
              <option value="range">Range</option>
            </optgroup>
            {/* <optgroup label="Multimedia">
              <option value="image">Image Upload</option>
              <option value="file">File Upload</option>
            </optgroup> */}

            {/* <option value="color">Color</option> */}
            {/* <option value="checkbox">Checkbox</option> */}
          </select>
          <button
            onClick={(_) => {
              addField(document.getElementById("fieldOptions").value);
            }}
            className="btn m-4 rounded-lg bg-white py-2 px-4 text-2xl font-bold text-green-500 shadow-lg hover:bg-green-500 hover:text-white"
          >
            +
          </button>
          <div className="my-2 mx-6 flex-1 items-center py-2 px-6">
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
