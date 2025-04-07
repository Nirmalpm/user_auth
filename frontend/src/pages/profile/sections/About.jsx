import React from 'react'
import RevealOnScroll from '../../../components/RevealOnScroll';

const About = () => {
    const frontendSkills =["React","TailwindCSS", "Javascript","CSS"];
    const backendSkills = ["Node.js","SpringBoot","Struts2","Oracle","MongoDB","PostgreSQL"]
  return (
    
    <section id="about"
    className="min-h-screen flex items-center justify-center py-20">
    <RevealOnScroll>
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">About Me</h2>
        <div className="rounded-xl p-8 border-white/10 border hover:-translate-y-1 transition-all">
            <p className="text-gray-300 mb-6">Passionate developer with expertise in building scalable web applications and creating innovative solutions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className='rounded-xl p-6 hover:-translate-y-1 transition-all'>
                    <h3 className="text-xl font-bold mb-4">Frontend</h3>
                    <div className="flex flex-wrap gap-2">
                        {frontendSkills.map((tech,key)=>(
                            <span className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full 
                            text-sm hover:bg-blue-500/20 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] 
                            transition " key={key}>{tech}</span>
                        ))}
                    </div>
                </div>
                <div className='rounded-xl p-6 hover:-translate-y-1 transition-all'>
                    <h3 className="text-xl font-bold mb-4">Backend</h3>
                    <div className="flex flex-wrap gap-2">
                        {backendSkills.map((tech,key)=>(
                            <span className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full 
                            text-sm hover:bg-blue-500/20 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] 
                            transition " key={key}>{tech}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div>
                            <div className="rounded-xl p-6 border-white/10 border hover:-translate-y-1 transition-all">
                                <h3 className="text-xl font-bold mb-4">📚Education</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-2">
                                    <li>
                                        <strong>Master of Computer Applications</strong> - Bharathiar University (1998)
                                    </li>
                                    <li>
                                        <strong>BSc Physics</strong> - Pondicherry University (1995)
                                    </li>
                                </ul>
                            </div>
                            <div className="rounded-xl p-6 border-white/10 border hover:-translate-y-1 transition-all">
                                <h3 className="text-xl font-bold mb-4">📜Certifications</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-2">
                                    <li>
                                        <strong>Master’s program - Artificial Intelligence Engineer :  </strong> - Simplilearn
                                    </li>
                                    <li>
                                        <strong>Certified Sun Certified Enterprise Architect (SCEA certified )</strong> -2007
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="rounded-xl p-6 border-white/10 border hover:-translate-y-1 transition-all">
                            <h3 className="text-xl font-bold mb-4">💼 Work Experience</h3>
                            <div className="space-y-4 text-gray-300">
                                <div>
                                    <h4 className="font-semibold">Consulting software engineer at ThoughtInks pvt. Ltd, Bangalore (2022- Present)</h4>
                                    <p>Currently associated with ThoughtInks as a consulting software engineer. 
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">ADM at Bamboorose Pvt. Ltd, Bangalore (2008- 2018)</h4>
                                    <p>Application Development Manager, Bamboorose – Oversaw the full SDLC of PLM module of TradeStone application(Bamboorose).  
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Professional Access Software Development Pvt. Ltd, Bangalore (2006- 2008)</h4>
                                    <p>Worked as Team Lead .  
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Sonata Software Pvt. Ltd, Bangalore (2001- 2006)</h4>
                                    <p>Software Engineer at Sonata Software.  
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Tata Consultancy Services, Mumbai (2000- 2001)</h4>
                                    <p>Software Programmer at TCS.  
                                    </p>
                                </div>
                            </div>
                        </div>
        </div>
      </div>
      </RevealOnScroll>
    </section>
    
  )
}   

export default About
