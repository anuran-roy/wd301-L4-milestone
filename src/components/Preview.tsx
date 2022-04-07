import React, { useState, useEffect } from "react";
import AppContainer from "./AppContainer";
import Header from "./Header";
import { navigate } from "raviger";
import formDataType from "../types/formDataType";
import responseDataType from "../types/responseDataType";
import getForms from "../functions/getForms";
import getResponses from "../functions/getResponses";
import saveResponses from "../functions/saveResponses";
import PreviewInput from "./PreviewInput";

// import initialFormFields from "../presets/initialFormFields";

export default function Preview(props: { formId: number }) {
  const getForm: () => formDataType = () => {
    const localForm = getForms().filter((form) => form.id === props.formId)[0];

    return localForm;
  };

  const initialResponseState = () => {
    const localResponses = getResponses();
    const relevantForm = getForm();
    const relevantResponse = localResponses.filter((response) => response.id === props.formId && response.hash === relevantForm.hash);

    if (relevantResponse.length > 0) {
      return relevantResponse[0];
    }

    const formDetails = getForm();
    const newResponse = {
      last_modified: new Date().toString(),
      id: props.formId,
      hash: relevantForm.hash,
      title: formDetails.title,
      formFields: formDetails.formFields,
    };

    saveResponses([...localResponses, newResponse]);
    return newResponse;
  };

  const [question, setQuestion] = useState(0);
  const [responseState, setResponseState] = useState(() =>
    initialResponseState()
  );

  const emptyForm = () => {
    alert("Form Empty. Returning to home screen...");
    navigate("/");
  };

  const gotoNextQuestion = () => {
    if (question < responseState.formFields.length - 1) {
      setQuestion(question + 1);
      // setQuestionDetails(responseState.formFields[question]);
    } else {
      alert("You are at the last question!");
    }
  };

  const gotoPreviousQuestion = () => {
    if (question > 0) {
      setQuestion(question - 1);
      // setQuestionDetails(responseState.formFields[question]);
    } else {
      alert("You are at the first question!");
    }
  };

  const gotoFirstQuestion = () => {
    setQuestion(0);
    // setQuestionDetails(responseState.formFields[question]);
  };

  const gotoLastQuestion = () => {
    setQuestion(responseState.formFields.length - 1);
    // setQuestionDetails(responseState.formFields[question]);
  };

  const closePreview = () => {
    navigate("/");
  };

  const saveResponse = (toSaveResponse: responseDataType) => {
    saveResponses([
      ...getResponses().filter((response) => response.id !== toSaveResponse.id),
      toSaveResponse,
    ]);
  };

  useEffect(() => {
    saveResponse({ ...responseState, last_modified: new Date().toString() });
  }, [question, responseState]);

  //   const initialResponseState = () => {
  //       let currentForms: formDataType[];
  //     const savedJSON = localStorage.getItem("savedResponses");
  //     if (savedJSON !== undefined) {
  //         currentForms = JSON.parse(savedJSON);
  //     } else {
  //         currentForms = [];
  //     }

  //     return currentForms;
  //   };

  const updateField = (e_value: string, id: number) => {
    // console.log(responseState);
    // console.log(e_value);
    setResponseState({
      ...responseState,
      formFields: responseState.formFields.map((field) => {
        if (field.id !== id) {
          return field;
        } else {
          return {
            ...field,
            value: e_value,
          };
        }
      }),
    });
  };
  
  return responseState.formFields.length === 0 ? 
    emptyForm() :
  (
    <AppContainer>
      <Header title=""></Header>
      <p className="flex justify-center py-5 text-3xl">{responseState.title}</p>
      <p className="my-5">
        <i>Last modified on:</i> {responseState.last_modified}
      </p>
      <p>Question {question + 1}</p>
      <PreviewInput
        id={responseState.formFields[question].id}
        key={`question-${responseState.formFields[question].id}`}
        label={responseState.formFields[question].label}
        fieldType={responseState.formFields[question].fieldType}
        value={responseState.formFields[question].value}
        updateFieldCB={updateField}
      />
      <div className="flex justify-center">
        <div
          onClick={(_) => {
            gotoPreviousQuestion();
          }}
          className="btn m-2 cursor-pointer rounded-md bg-sky-500 p-2 text-white hover:bg-sky-700"
        >
          &lt; Previous
        </div>
        <div
          onClick={(_) => {
            gotoNextQuestion();
          }}
          className="btn m-2 cursor-pointer rounded-md bg-sky-500 p-2 text-white hover:bg-sky-700"
        >
          Next &gt;
        </div>
      </div>
      <div className="flex justify-center">
        <div
          onClick={(_) => {
            gotoFirstQuestion();
          }}
          className="btn m-2 cursor-pointer rounded-md bg-sky-500 p-2 text-white hover:bg-sky-700"
        >
          &lt;&lt; First
        </div>
        <div
          onClick={(_) => {
            gotoLastQuestion();
          }}
          className="btn m-2 cursor-pointer rounded-md bg-sky-500 p-2 text-white hover:bg-sky-700"
        >
          Last &gt;&gt;
        </div>
        <div
          onClick={(_) => {
            closePreview();
          }}
          className="btn m-2 cursor-pointer rounded-md bg-sky-500 p-2 text-white hover:bg-sky-700"
        >
          Close Preview
        </div>
      </div>
    </AppContainer>
  );
}
