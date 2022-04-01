import React, { useState, useEffect, useRef } from "react";

// import logo from "../logo.svg";
import getForms from "../functions/getForms";
import saveForms from "../functions/saveForms";

import formDataType from "../types/formDataType";
import initialFormFields from "../presets/initialFormFields";

export default function Home() {
  const localForms = getForms();
  const [listState, setListState] = useState(localForms);

  const newForm = () => {
    const createdForm: formDataType = {
      created_on: new Date().toString(),
      id: Number(new Date()),
      title: "Untitled Form",
      formFields: initialFormFields
    }
    setListState([...listState, createdForm]);
    saveForms([...listState, createdForm]);
  };

  const deleteForm = (formId: number) => {
    saveForms(listState.filter(form => form.id !== formId));
    setListState(listState.filter(form => form.id !== formId));
  }
  return (
    <>    
      <div className="flex">
        <div className="flex-1 items-center justify-center">
          <p>Welcome to the Home Page</p>
          <button onClick={newForm} className="m-2 p-2 bg-sky-500 rounded-md text-white">New Form</button>
        </div>
      </div>
      <div className="grid grid-cols-2">
      {
        listState.map(form => {
            return (<div className="m-5 p-5 block max-w-sm rounded-lg bg-white shadow-xl text-gray-700" key={form.id}>
              <p className="text-2xl flex justify-center m-2">{form.title}</p>
              <p><strong>Created on: </strong>{form.created_on}</p>
              <p><strong>Fields: </strong>{form.formFields.length}</p>
              <a href={`/form/${form.id}`}><button className="p-2 m-2 bg-sky-500 rounded-md text-white" >Open Form</button></a>
              <button className="p-2 m-2 bg-sky-500 rounded-md text-white" onClick={(_) => {deleteForm(form.id)}}>Delete Form</button>
            </div>)
          }
        )}
      </div>
    </>
  );
}
