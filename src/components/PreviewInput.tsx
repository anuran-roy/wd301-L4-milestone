// import React, { useState } from "react";

export default function LabelledInput(props: {
  id: number;
  label: string;
  fieldType: string;
  value: string;
  updateFieldCB: (e: any, id: number) => any;
}) {
  return (
    <>
      <label>{props.label}:</label>
      <div className="flex">
        <input
          id={`${props.id}`}
          className="my-2 flex-1 rounded-lg border-2 border-gray-200 p-2"
          type={props.fieldType}
          autoComplete="true"
          value={props.value}
          onChange={(e: any) => {
            console.log(e.target.value);
            props.updateFieldCB(e.target.value, props.id);
          }}
        />
      </div>
    </>
  );
}
