import {useContext} from "react";
import {EditorContext} from "../../widgets/TipTap/EditorProvider.tsx";

export const useEditor = () => {
  return useContext(EditorContext);
}