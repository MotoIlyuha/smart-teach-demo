import {EditorContentProps} from "@tiptap/react";
import {createContext, ReactNode} from "react";

interface EditorProviderProps {
  editor: EditorContentProps['editor']
}

export const EditorContext = createContext<EditorProviderProps>({
  editor: null,
})

export const EditorProvider = ({children, editor}: {children: ReactNode, editor: EditorContentProps['editor']}) => {

  return (
    <EditorContext.Provider value={{editor}}>
      {children}
    </EditorContext.Provider>
  )
}