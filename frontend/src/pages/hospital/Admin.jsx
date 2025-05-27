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
    <div className="flex flex-col w-full justify-center items-start gap-2 mt-5 mb-15">
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
