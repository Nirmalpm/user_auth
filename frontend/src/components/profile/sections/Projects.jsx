import React from 'react'
import RevealOnScroll from '../../RevealOnScroll'

const Projects = () => {
  return (
   
    <section id="projects" 
    className="min-h-screen flex items-center justify-center py-20"
    >
    <RevealOnScroll>
      <div  className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text 
         text-transparent text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PROJECT 1 */}
            <div className="p-6 rounded-xl border border-white/10 hover:-translate-y-1 
            hover:border-blue-500/30 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition-all">
                <h3 className="text-xl font-bold mb-2 ">Purchase Order Builder - Enhancements With S5 inegration for Knitwell Group</h3>
                <p className="text-gray-400 mb-4"> Enhanced the Purchase Order (PO) building capabilities of Bamboorose application. The primary objective 
                    was to streamline and automate the PO creation process, ensuring greater efficiency 
                    and accuracy. </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {["IBM ODM","Java"].map((tech,key)=>(
                        <span className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full 
                        text-sm hover:bg-blue-500/20 hover:shadow-[0_2px_8px_rgba(59,130,246,0.1)] 
                        transition-all " key={key}>{tech}</span>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    <a href="" className="text-blue-400 hover:text-blue-300 transition-colors my-4">View Project ➡️</a>
                </div>
            </div>
             {/* PROJECT 2 */}
            <div className="p-6 rounded-xl border border-white/10 hover:-translate-y-1 
            hover:border-blue-500/30 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition-all">
                <h3 className="text-xl font-bold mb-2 ">Bamboo Rose Marketplace Tools Application</h3>
                <p className="text-gray-400 mb-4"> Involved in the development of administration module with Reactjs 
                    js libraries. This module of the product mainly used for admin activities like User Registration, 
                    User Access Control, Company Registration etc. </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {["React Js","Springboot", "Oracle"].map((tech,key)=>(
                        <span className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full 
                        text-sm hover:bg-blue-500/20 hover:shadow-[0_2px_8px_rgba(59,130,246,0.1)] 
                        transition-all " key={key}>{tech}</span>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    <a href="" className="text-blue-400 hover:text-blue-300 transition-colors my-4">View Project ➡️</a>
                </div>
            </div>
             {/* PROJECT 3 */}
             <div className="p-6 rounded-xl border border-white/10 hover:-translate-y-1 
            hover:border-blue-500/30 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition-all">
                <h3 className="text-xl font-bold mb-2 ">Bamboo Rose Marketplace</h3>
                <p className="text-gray-400 mb-4"> Worked as Application Architect for this project with responsibilities 
                    of functional design development, Project architecture, Module design and development including front 
                    end development for the marketplace application of this product. </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {["Struts 2","Java", "Javascript","JQuery","Oracle"].map((tech,key)=>(
                        <span className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full 
                        text-sm hover:bg-blue-500/20 hover:shadow-[0_2px_8px_rgba(59,130,246,0.1)] 
                        transition-all " key={key}>{tech}</span>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    <a href="" className="text-blue-400 hover:text-blue-300 transition-colors my-4">View Project ➡️</a>
                </div>
            </div>
            {/* PROJECT 4 */}
            <div className="p-6 rounded-xl border border-white/10 hover:-translate-y-1 
            hover:border-blue-500/30 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition-all">
                <h3 className="text-xl font-bold mb-2 ">Bamboo Rose Product Lifecycle Management (PLM) System</h3>
                <p className="text-gray-400 mb-4"> Worked as Module Lead in this Web project with responsibilities of designing and 
                    developing new UI Framework for the PLM module. </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {["Struts 2","Java", "JSP","JQuery","Oracle"].map((tech,key)=>(
                        <span className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full 
                        text-sm hover:bg-blue-500/20 hover:shadow-[0_2px_8px_rgba(59,130,246,0.1)] 
                        transition-all " key={key}>{tech}</span>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    <a href="" className="text-blue-400 hover:text-blue-300 transition-colors my-4">View Project ➡️</a>
                </div>
            </div>

        </div>
      </div>
      </RevealOnScroll>
    </section>
   
  )
}

export default Projects
