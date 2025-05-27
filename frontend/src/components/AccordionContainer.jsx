import React, { useState } from 'react';
import {ChevronDown,ChevronRight} from 'lucide-react'

const AccordionContainer = ({children, title}) => {
  const [isOpen,setIsopen]  = useState(false);
  return (
    <div className="flex flex-col min-w-xl w-full border-1 border-gray-500">
      <div onClick={()=> setIsopen(!isOpen)} className="flex w-full bg-amber-700  p-3 justify-start">{isOpen ? <ChevronDown size={24}/> : <ChevronRight size={24}/>}
      <div className="flex w-full text-gray-100 justify-center">{title}</div>
      </div>
      <div>
      {isOpen ? children : null}
      </div>  
    </div>
  )
}

export default AccordionContainer
