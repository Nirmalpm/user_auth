import { PDFViewer } from '@react-pdf/renderer'
import React from 'react'
import ProfilePDF from '../../components/ProfilePDF'
import { NavLink } from 'react-router'

const ViewResumePDF = () => {
  return (
    <div className="w-full flex h-200 flex-col justify-center items-center text=center">
    <NavLink to="/portfolio">
    <h1 className="text-amber-600 font-semibold">GO BACK</h1>
    </NavLink>
    <PDFViewer className="w-full flex h-200">
        <ProfilePDF />
    </PDFViewer>
    </div>
  )
}

export default ViewResumePDF
