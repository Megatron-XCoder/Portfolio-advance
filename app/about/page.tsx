"use client"

import { useState } from "react"
import { Terminal } from "@/components/terminal"
import { Github, Twitter, Linkedin, Mail, Facebook, Instagram, Phone } from "lucide-react"
import Link from "next/link"
import { EducationCard } from "@/components/education-card"
import { SkillProgress } from "@/components/skill-progress"
import { ContactForm } from "@/components/contact-form"

export default function AboutPage() {
  const [introComplete, setIntroComplete] = useState(false)
  const [bioComplete, setBioComplete] = useState(false)

  const experiences = [
    {
      title: "Data Analyst",
      company: "Eclerx Services Limited",
      period: "Dec 2022 - Aug 2023",
      description:
          "Assisted in ensuring customer satisfaction, troubleshooting technical issues, and effectively dealing with client support.",
    },
    {
      title: "Graphic Designer",
      company: "Fotografiks Pvt. Limited",
      period: "Aug 2022 - Oct 2022",
      description:
          "Assisted in various projects for posters, logos, iconography, package designs, and illustrations according to client demands.",
    },
  ]

  const education = [
    {
      institution: "Chandigarh University",
      degree: "Masters",
      field: "Computer Applications - Cloud Computing & DevOps",
      startDate: "2023",
      endDate: "2025",
      description: "Pursuing Master's degree with a focus on advanced topics and practical applications.",
      achievements: [
        "Focusing on cloud computing and DevOps practices",
        "Gaining in-depth knowledge to tackle complex challenges in the tech industry",
      ],
    },
    {
      institution: "Kurukshetra University",
      degree: "Bachelor of Commerce",
      field: "B.Com",
      startDate: "2019",
      endDate: "2022",
      description: "Graduated with a solid foundation in Accountancy, Economics, and Tax Filing.",
      achievements: ["Laid the groundwork for career in software development and technology"],
    },
  ]

  const skills = [
    {
      category: "Frontend",
      items: [
        { name: "HTML, JSX, ReactJS", percentage: 90 },
        { name: "CSS (Bootstrap, Tailwind, ShadCN, Material UI)", percentage: 90 },
      ],
    },
    {
      category: "Programming",
      items: [
        { name: "Programming Languages (JavaScript, JAVA, Kotlin)", percentage: 85 },
        { name: "MERN Stack (MongoDB, Express, ReactJS, NodeJS)", percentage: 85 },
      ],
    },
    {
      category: "Cloud & Design",
      items: [
        { name: "Cloud Services (AWS, Azure, Netlify, Vercel)", percentage: 90 },
        { name: "Graphic Designing (Figma, AdobeXD, Photoshop, Illustrator)", percentage: 100 },
      ],
    },
  ]

  return (
      <div className="space-y-16">
        <section>
          <Terminal
              text="I nitializing personal profile... Access granted. Loading bio data..."
              typingSpeed={30}
              className="max-w-3xl mx-auto"
              onComplete={() => setIntroComplete(true)}
          />

          {introComplete && (
              <Terminal
                  text="S oftware Engineer with excellent problem-solving skills and ability to perform well in a team. Good knowledge of Java, JavaScript, Kotlin, Linux, Agile Methodology, Cloud Computing Technologies, and SDLC models. Passionate about DevOps with exceptional qualities."
                  typingSpeed={20}
                  className="max-w-3xl mx-auto mt-4"
                  showPrompt={false}
                  onComplete={() => setBioComplete(true)}
              />
          )}
        </section>

        {bioComplete && (
            <>
              <section>
                <h2 className="text-2xl font-bold mb-6">About Me</h2>
                <div className="terminal-window">
                  <div className="terminal-header">
                    <div className="terminal-button terminal-button-red"></div>
                    <div className="terminal-button terminal-button-yellow"></div>
                    <div className="terminal-button terminal-button-green"></div>
                    <div className="terminal-title">about.sh</div>
                  </div>
                  <div className="terminal-content">
                    <p className="mb-4">
                      <span className="text-primary">$</span> cat about_me.txt
                    </p>
                    <p className="mb-4">
                      As an innovative developer, with strong expertise in{" "}
                      <span className="text-primary">
                    Java, JavaScript, MERN Stack, Kotlin, Linux, Agile Methodology, Cloud Computing Technologies, and
                    SDLC models
                  </span>
                      , I bring a well-rounded skill set to every project. Passionate about DevOps, I leverage my
                      exceptional qualities to ensure seamless integration and continuous delivery. Let's work together to
                      transform your ideas.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-primary">$</span>
                          <span className="font-bold">Happy Clients: 12</span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          We are proud to have collaborated with a diverse range of clients.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-primary">$</span>
                          <span className="font-bold">Projects: 8</span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          Each project highlights my commitment to delivering top-notch solutions.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-primary">$</span>
                          <span className="font-bold">Years of Experience: 1</span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          In multiple technologies, with a passion for continuous learning.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-primary">$</span>
                          <span className="font-bold">Awards: 3</span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          Achieved Training Champ position at Eclerx Services Limited.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">Skills</h2>
                <div className="terminal-window">
                  <div className="terminal-header">
                    <div className="terminal-button terminal-button-red"></div>
                    <div className="terminal-button terminal-button-yellow"></div>
                    <div className="terminal-button terminal-button-green"></div>
                    <div className="terminal-title">skills.sh</div>
                  </div>
                  <div className="terminal-content">
                    <p className="mb-4">
                      <span className="text-primary">$</span> cat /proc/skills
                    </p>
                    <p className="mb-6">
                      A versatile skill set spanning Java, JavaScript, Kotlin, MERN Stack, Linux, Agile Methodology, Cloud
                      Computing, SDLC models, and DevOps practices. Dedicated to continuous improvement and delivering
                      innovative solutions.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {skills.map((skillGroup, index) => (
                          <div key={index} className="space-y-4">
                            <h3 className="text-primary font-bold">{skillGroup.category}</h3>
                            {skillGroup.items.map((skill, skillIndex) => (
                                <SkillProgress key={skillIndex} name={skill.name} percentage={skill.percentage} />
                            ))}
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">Experience Timeline</h2>
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                      <div key={index} className="terminal-window">
                        <div className="terminal-header">
                          <div className="terminal-button terminal-button-red"></div>
                          <div className="terminal-button terminal-button-yellow"></div>
                          <div className="terminal-button terminal-button-green"></div>
                          <div className="terminal-title">{exp.company}.sh</div>
                        </div>
                        <div className="terminal-content">
                          <p className="mb-1">
                            <span className="text-primary">$</span> cat job_details.txt
                          </p>
                          <div className="mb-2">
                            <p>
                              <span className="text-primary">title:</span> {exp.title}
                            </p>
                            <p>
                              <span className="text-primary">period:</span> {exp.period}
                            </p>
                            <p>
                              <span className="text-primary">description:</span> {exp.description}
                            </p>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6">Education</h2>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                      <EducationCard key={index} {...edu} />
                  ))}
                </div>
              </section>

              <section id="contact">
                <h2 className="text-2xl font-bold mb-6">Contact</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <ContactForm />

                  <div className="terminal-window">
                    <div className="terminal-header">
                      <div className="terminal-button terminal-button-red"></div>
                      <div className="terminal-button terminal-button-yellow"></div>
                      <div className="terminal-button terminal-button-green"></div>
                      <div className="terminal-title">network_connections.sh</div>
                    </div>
                    <div className="terminal-content">
                      <p className="mb-4">
                        <span className="text-primary">$</span> ifconfig
                      </p>
                      <div className="space-y-4">
                        <div>
                          <p className="mb-1 text-primary">location:</p>
                          <p className="flex items-center gap-2">Chandigarh, India</p>
                        </div>
                        <div>
                          <p className="mb-1 text-primary">email:</p>
                          <Link
                              href="mailto:crisiscrush525@gmail.com"
                              className="flex items-center gap-2 hover:text-primary transition-colors"
                          >
                            <Mail size={16} />
                            crisiscrush525@gmail.com
                          </Link>
                        </div>
                        <div>
                          <p className="mb-1 text-primary">phone:</p>
                          <Link
                              href="tel:+917018021841"
                              className="flex items-center gap-2 hover:text-primary transition-colors"
                          >
                            <Phone size={16} />
                            +91 70180 21841
                          </Link>
                        </div>
                        <div className="pt-4">
                          <p className="mb-2 text-primary">social:</p>
                          <div className="flex space-x-4">
                            <Link
                                href="https://github.com"
                                className="hover:text-primary transition-colors"
                                target="_blank"
                            >
                              <Github size={20} />
                            </Link>
                            <Link
                                href="https://twitter.com"
                                className="hover:text-primary transition-colors"
                                target="_blank"
                            >
                              <Twitter size={20} />
                            </Link>
                            <Link
                                href="https://linkedin.com"
                                className="hover:text-primary transition-colors"
                                target="_blank"
                            >
                              <Linkedin size={20} />
                            </Link>
                            <Link
                                href="https://facebook.com"
                                className="hover:text-primary transition-colors"
                                target="_blank"
                            >
                              <Facebook size={20} />
                            </Link>
                            <Link
                                href="https://instagram.com"
                                className="hover:text-primary transition-colors"
                                target="_blank"
                            >
                              <Instagram size={20} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
        )}
      </div>
  )
}
