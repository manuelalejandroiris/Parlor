import React from "react";
import { useState } from "react";
import {} from "../../http/api";
import { useHistory } from "react-router-dom";

// 1 Creamos el contexto y exportamos para usar en el hook
export const resultsContext = React.createContext();
const resultsContextProvider = resultsContext.Provider;
