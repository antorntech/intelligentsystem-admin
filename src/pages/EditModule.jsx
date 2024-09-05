import React from "react";
import { useParams } from "react-router-dom";

const EditModule = () => {
  const { id } = useParams();
  return <div>EditModule {id}</div>;
};

export default EditModule;
