import React from 'react'
//icon:Icon: added like this for treating passed property as a component, here Icon
//pointer-events-none: User cannot select
const TextArea = ({icon:Icon,...props}) => {
  return (
    <div className="relative mb-6  w-full flex">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
        <Icon className="size-5  text-blue-500"/>
      </div>
      <textarea
      {...props}
      className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-400 
       text-white placeholder-gray-400 transition duration-200"
      >
        {props.value}
      </textarea>
    </div>
  )
}

export default TextArea
