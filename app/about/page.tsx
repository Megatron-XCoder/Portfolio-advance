"use client"

import { useState, useEffect, useRef } from "react"
import { Terminal } from "@/components/terminal"
import { Github, Twitter, Linkedin, Mail, Facebook, Instagram, Phone, Briefcase, GraduationCap, Star, Code, Zap, Award, ExternalLink } from "lucide-react"
import Link from "next/link"
import { EducationCard } from "@/components/education-card"
import { SkillProgress } from "@/components/skill-progress"
import { ContactForm } from "@/components/contact-form"
import { ResumeDownloadButton } from "@/components/resume-download-button"
import { SectionReveal } from "@/components/section-reveal"

// Animated counter hook
function useCounter(target: number, duration: number = 1500, start: boolean = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    const step = Math.ceil(target / (duration / 16))
    let curr = 0
    const timer = setInterval(() => {
      curr = Math.min(curr + step, target)
      setCount(curr)
      if (curr >= target) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, start])
  return count
}

function StatCard({ label, value, description, animate }: { label: string; value: number; description: string; animate: boolean }) {
  const count = useCounter(value, 1200, animate)
  return (
    <div className="bg-card/50 border border-border/60 rounded-xl p-5 hover:border-primary/50 hover:bg-card transition-all duration-300 group">
      <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">
        {animate ? count : 0}+
      </div>
      <div className="font-semibold mt-1 text-foreground">{label}</div>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
    </div>
  )
}

export default function AboutPage() {
  const [introComplete, setIntroComplete] = useState(false)
  const [bioComplete, setBioComplete] = useState(false)
  const [aboutData, setAboutData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/about")
        if (res.ok) setAboutData(await res.json())
      } catch (e) {
        console.error("Failed to fetch about data", e)
      } finally {
        setLoading(false)
      }
    }
    fetchAbout()
  }, [])

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsVisible(true); obs.disconnect() }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [bioComplete])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const d = aboutData || {}
  const experiences = d.experiences || []
  const education = d.education || []
  const skills = d.skills || []
  const stats = d.stats || []
  const certifications = d.certifications || []
  const contact = d.contact || {}
  const social = contact.social || {}

  return (
    <div className="space-y-20">
      {/* ── Terminal Intro ── */}
      <section>
        <Terminal
          text={d.introText || "Initializing personal profile... Access granted. Loading bio data..."}
          typingSpeed={10}
          className="max-w-3xl mx-auto"
          onComplete={() => setIntroComplete(true)}
        />
        {introComplete && (
          <Terminal
            text={d.bioText || "Software Engineer with excellent problem-solving skills and ability to perform well in a team."}
            typingSpeed={8}
            className="max-w-3xl mx-auto mt-4"
            showPrompt={false}
            onComplete={() => setBioComplete(true)}
          />
        )}
      </section>

      {bioComplete && (
        <>
          {/* ── About Me ── */}
          <SectionReveal direction="up">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code size={18} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold">About Me</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

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
                  <p className="mb-6 leading-relaxed text-foreground/90">
                    {d.aboutBody || "Developer passionate about clean code and creative solutions."}
                  </p>

                  {/* Stats Grid */}
                  <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {stats.map((s: any, i: number) => (
                      <StatCard key={i} label={s.label} value={s.value} description={s.description} animate={statsVisible} />
                    ))}
                  </div>

                  <div className="mt-8">
                    <ResumeDownloadButton />
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>

          {/* ── Skills ── */}
          <SectionReveal direction="up" delay={100}>
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap size={18} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Skills</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {skills.map((skillGroup: any, index: number) => (
                  <SectionReveal key={index} direction="up" delay={index * 100}>
                    <div className="bg-card/50 border border-border/60 rounded-xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                      <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary inline-block group-hover:scale-150 transition-transform" />
                        {skillGroup.category}
                      </h3>
                      <div className="space-y-3">
                        {skillGroup.items.map((skill: any, skillIndex: number) => (
                          <SkillProgress key={skillIndex} name={skill.name} percentage={skill.percentage} />
                        ))}
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </section>
          </SectionReveal>

          {/* ── Experience ── */}
          <SectionReveal direction="up" delay={100}>
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase size={18} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Experience Timeline</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

              <div className="relative pl-6 space-y-6 border-l-2 border-primary/20">
                {experiences.map((exp: any, index: number) => (
                  <SectionReveal key={index} direction="left" delay={index * 120}>
                    <div className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[2.15rem] top-5 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/30" />
                      <div className="terminal-window hover:border-primary/30 transition-colors duration-300">
                        <div className="terminal-header">
                          <div className="terminal-button terminal-button-red"></div>
                          <div className="terminal-button terminal-button-yellow"></div>
                          <div className="terminal-button terminal-button-green"></div>
                          <div className="terminal-title">{exp.company}.sh</div>
                        </div>
                        <div className="terminal-content">
                          <p className="mb-2">
                            <span className="text-primary">$</span> cat job_details.txt
                          </p>
                          <div className="space-y-1.5 text-sm">
                            <p><span className="text-primary font-medium">title:</span> {exp.title}</p>
                            <p><span className="text-primary font-medium">period:</span> <span className="text-muted-foreground">{exp.period}</span></p>
                            <p className="mt-2 leading-relaxed text-foreground/85">{exp.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </section>
          </SectionReveal>

          {/* ── Education ── */}
          <SectionReveal direction="up" delay={100}>
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap size={18} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Education</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>
              <div className="space-y-6">
                {education.map((edu: any, index: number) => (
                  <SectionReveal key={index} direction="right" delay={index * 120}>
                    <EducationCard {...edu} />
                  </SectionReveal>
                ))}
              </div>
            </section>
          </SectionReveal>

          {/* ── Certifications ── */}
          {certifications.length > 0 && (
            <SectionReveal direction="up" delay={100}>
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award size={18} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Certifications</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {certifications.map((cert: any, index: number) => (
                    <SectionReveal key={index} direction="up" delay={index * 80}>
                      <div className="group relative rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-6 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">
                        {/* Glow effect */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Award size={22} className="text-primary" />
                        </div>

                        {/* Content */}
                        <h3 className="text-base font-bold text-foreground mb-1 leading-tight">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{cert.issuer}</p>
                        {cert.date && (
                          <p className="text-xs text-muted-foreground/70 mb-4">{cert.date}</p>
                        )}

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Credential Link */}
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors mt-2"
                          >
                            <ExternalLink size={12} /> View Credential
                          </a>
                        )}
                      </div>
                    </SectionReveal>
                  ))}
                </div>
              </section>
            </SectionReveal>
          )}

          {/* ── Contact ── */}
          <SectionReveal direction="up" delay={100}>
            <section id="contact">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail size={18} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Contact</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

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
                        <p className="mb-1 text-primary font-medium">location:</p>
                        <p>{contact.location || "Chandigarh, India"}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-primary font-medium">email:</p>
                        <Link
                          href={`mailto:${contact.email || "crisiscrush525@gmail.com"}`}
                          className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                          <Mail size={16} />
                          {contact.email || "crisiscrush525@gmail.com"}
                        </Link>
                      </div>
                      <div>
                        <p className="mb-1 text-primary font-medium">phone:</p>
                        <Link
                          href={`tel:${(contact.phone || "").replace(/\s/g, "")}`}
                          className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                          <Phone size={16} />
                          {contact.phone || "+91 70180 21841"}
                        </Link>
                      </div>
                      <div className="pt-4">
                        <p className="mb-3 text-primary font-medium">social:</p>
                        <div className="flex space-x-4">
                          {social.github && (
                            <Link href={social.github} className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                              <Github size={20} />
                            </Link>
                          )}
                          {social.twitter && (
                            <Link href={social.twitter} className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                              <Twitter size={20} />
                            </Link>
                          )}
                          {social.linkedin && (
                            <Link href={social.linkedin} className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                              <Linkedin size={20} />
                            </Link>
                          )}
                          {social.facebook && (
                            <Link href={social.facebook} className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                              <Facebook size={20} />
                            </Link>
                          )}
                          {social.instagram && (
                            <Link href={social.instagram} className="hover:text-primary transition-colors" target="_blank" rel="noreferrer">
                              <Instagram size={20} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>
        </>
      )}
    </div>
  )
}
