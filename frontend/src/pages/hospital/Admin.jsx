import React from 'react'
import Department from './forms/Department'
import Doctor from './forms/Doctor'
import AccordionContainer from '../../components/AccordionContainer'
import WardMaster from './forms/WardMaster'
import PharmacyMaster from './forms/PharmacyMaster'
import TestMaster from './forms/TestMaster'
import CanteenMaster from './forms/CanteenMaster'

const Admin = () => {
  return (
    <div className="flex w-7xl flex-col bg-blue-900  h-[630px] justify-center items-center gap-2 m-1 p-10 overflow-y-auto">
      <AccordionContainer title="Department"><Department/></AccordionContainer>
      <AccordionContainer title="Doctors"><Doctor/></AccordionContainer>
      <AccordionContainer title="Wards"><WardMaster/></AccordionContainer>
      <AccordionContainer title="Pharmacy"><PharmacyMaster/></AccordionContainer>
      <AccordionContainer title="Tests"><TestMaster/></AccordionContainer>
      <AccordionContainer title="Canteen"><CanteenMaster/></AccordionContainer>
    </div>
  )
}

export default Admin
