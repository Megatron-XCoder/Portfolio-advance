"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  User, Zap, Briefcase, GraduationCap, Phone, Save, Plus, Trash2, Loader2,
  ChevronDown, ChevronUp, Award, FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/* ─── Accordion Section ─── */
const Section = ({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: any; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Icon size={17} className="text-primary" />
          </div>
          <span className="font-semibold">{title}</span>
        </div>
        <div className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDown size={18} className="text-muted-foreground" />
        </div>
      </button>
      {open && <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-4">{children}</div>}
    </div>
  )
}

/* ─── Field Row ─── */
const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start">
    <label className="text-sm font-medium text-muted-foreground md:pt-2.5">{label}</label>
    <div className="md:col-span-3">{children}</div>
  </div>
)

/* ─── Textarea ─── */
const Textarea = ({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) => (
  <textarea
    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
    rows={rows}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />
)

export default function AdminAboutPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success("About page saved successfully!")
    } catch {
      toast.error("Failed to save changes.")
    } finally {
      setSaving(false)
    }
  }

  const set = (path: string, value: any) => {
    setData((prev: any) => {
      const parts = path.split(".")
      const updated = { ...prev }
      let cur: any = updated
      for (let i = 0; i < parts.length - 1; i++) {
        cur[parts[i]] = Array.isArray(cur[parts[i]]) ? [...cur[parts[i]]] : { ...cur[parts[i]] }
        cur = cur[parts[i]]
      }
      cur[parts[parts.length - 1]] = value
      return updated
    })
  }

  const updateArr = (arrPath: string, index: number, field: string, value: any) => {
    setData((prev: any) => {
      const parts = arrPath.split(".")
      const updated = { ...prev }
      let cur: any = updated
      for (const p of parts) cur = cur[p]
      cur[index] = { ...cur[index], [field]: value }
      return updated
    })
  }

  const addToArr = (arrPath: string, item: any) => {
    setData((prev: any) => {
      const parts = arrPath.split(".")
      const updated = { ...prev }
      let cur: any = updated
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]]
      cur[parts[parts.length - 1]] = [...(cur[parts[parts.length - 1]] || []), item]
      return updated
    })
  }

  const removeFromArr = (arrPath: string, index: number) => {
    setData((prev: any) => {
      const parts = arrPath.split(".")
      const updated = { ...prev }
      let cur: any = updated
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]]
      const arr = [...cur[parts[parts.length - 1]]]
      arr.splice(index, 1)
      cur[parts[parts.length - 1]] = arr
      return updated
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (!data) return <p className="text-destructive">Failed to load about data.</p>

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-8">
      {/* ─── Header with single save button ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-2 border-b border-border/30">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <User className="text-primary" size={24} />
            About Page Editor
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Edit all content displayed on the About page</p>
        </div>
        <Button onClick={save} disabled={saving} className="gap-2 h-10 px-5 shadow-sm shrink-0">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* ─── Intro & Bio ─── */}
      <Section title="Intro & Bio" icon={User} defaultOpen={true}>
        <FieldRow label="Terminal Intro">
          <Input value={data.introText || ""} onChange={(e) => set("introText", e.target.value)} placeholder="Initializing personal profile..." />
        </FieldRow>
        <FieldRow label="Bio Text">
          <Textarea value={data.bioText || ""} onChange={(v) => set("bioText", v)} placeholder="Software Engineer with..." />
        </FieldRow>
        <FieldRow label="About Body">
          <Textarea value={data.aboutBody || ""} onChange={(v) => set("aboutBody", v)} placeholder="As an innovative developer..." rows={4} />
        </FieldRow>
      </Section>

      {/* ─── Stats ─── */}
      <Section title="Stats" icon={Zap}>
        <div className="space-y-3">
          {(data.stats || []).map((s: any, i: number) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_80px_1fr_auto] gap-2 p-3 bg-secondary/30 rounded-lg border border-border/30 items-center">
              <Input placeholder="Label" value={s.label} onChange={(e) => updateArr("stats", i, "label", e.target.value)} />
              <Input type="number" placeholder="Value" value={s.value} onChange={(e) => updateArr("stats", i, "value", Number(e.target.value))} />
              <Input placeholder="Description" value={s.description} onChange={(e) => updateArr("stats", i, "description", e.target.value)} />
              <Button variant="ghost" size="icon" onClick={() => removeFromArr("stats", i)} className="text-destructive hover:text-destructive h-9 w-9">
                <Trash2 size={15} />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addToArr("stats", { label: "New Stat", value: 0, description: "" })} className="gap-2">
            <Plus size={14} /> Add Stat
          </Button>
        </div>
      </Section>

      {/* ─── Skills ─── */}
      <Section title="Skills" icon={Zap}>
        <div className="space-y-4">
          {(data.skills || []).map((group: any, gi: number) => (
            <div key={gi} className="border border-border/40 rounded-lg p-4 space-y-3 bg-secondary/20">
              <div className="flex items-center gap-2">
                <Input placeholder="Category name" value={group.category} onChange={(e) => updateArr("skills", gi, "category", e.target.value)} className="flex-1" />
                <Button variant="ghost" size="icon" onClick={() => removeFromArr("skills", gi)} className="text-destructive hover:text-destructive h-9 w-9 shrink-0">
                  <Trash2 size={15} />
                </Button>
              </div>
              {(group.items || []).map((skill: any, si: number) => (
                <div key={si} className="flex gap-2 items-center pl-3">
                  <div className="w-1 h-5 bg-primary/30 rounded-full shrink-0" />
                  <Input
                    placeholder="Skill name"
                    value={skill.name}
                    onChange={(e) => {
                      const items = [...group.items]
                      items[si] = { ...items[si], name: e.target.value }
                      updateArr("skills", gi, "items", items)
                    }}
                    className="flex-1"
                  />
                  <Input
                    type="number" min="0" max="100" placeholder="%"
                    value={skill.percentage}
                    onChange={(e) => {
                      const items = [...group.items]
                      items[si] = { ...items[si], percentage: Number(e.target.value) }
                      updateArr("skills", gi, "items", items)
                    }}
                    className="w-20"
                  />
                  <Button variant="ghost" size="icon" onClick={() => {
                    const items = [...group.items]
                    items.splice(si, 1)
                    updateArr("skills", gi, "items", items)
                  }} className="text-destructive hover:text-destructive h-8 w-8 shrink-0">
                    <Trash2 size={13} />
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="ml-3 gap-1.5 text-xs" onClick={() => {
                const items = [...(group.items || []), { name: "", percentage: 80 }]
                updateArr("skills", gi, "items", items)
              }}>
                <Plus size={13} /> Add Skill
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addToArr("skills", { category: "New Category", items: [] })} className="gap-2">
            <Plus size={14} /> Add Category
          </Button>
        </div>
      </Section>

      {/* ─── Experience ─── */}
      <Section title="Experience" icon={Briefcase}>
        <div className="space-y-4">
          {(data.experiences || []).map((exp: any, i: number) => (
            <div key={i} className="border border-border/40 rounded-lg p-4 space-y-3 bg-secondary/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input placeholder="Job Title" value={exp.title} onChange={(e) => updateArr("experiences", i, "title", e.target.value)} />
                <Input placeholder="Company" value={exp.company} onChange={(e) => updateArr("experiences", i, "company", e.target.value)} />
                <Input placeholder="Period (e.g. Jan 2023 – Dec 2023)" value={exp.period} onChange={(e) => updateArr("experiences", i, "period", e.target.value)} className="sm:col-span-2" />
              </div>
              <Textarea value={exp.description} onChange={(v) => updateArr("experiences", i, "description", v)} placeholder="Description" rows={2} />
              <Button variant="ghost" size="sm" onClick={() => removeFromArr("experiences", i)} className="text-destructive hover:text-destructive gap-1.5 text-xs">
                <Trash2 size={13} /> Remove
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addToArr("experiences", { title: "", company: "", period: "", description: "" })} className="gap-2">
            <Plus size={14} /> Add Experience
          </Button>
        </div>
      </Section>

      {/* ─── Education ─── */}
      <Section title="Education" icon={GraduationCap}>
        <div className="space-y-4">
          {(data.education || []).map((edu: any, i: number) => (
            <div key={i} className="border border-border/40 rounded-lg p-4 space-y-3 bg-secondary/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input placeholder="Institution" value={edu.institution} onChange={(e) => updateArr("education", i, "institution", e.target.value)} />
                <Input placeholder="Degree" value={edu.degree} onChange={(e) => updateArr("education", i, "degree", e.target.value)} />
                <Input placeholder="Field of Study" value={edu.field} onChange={(e) => updateArr("education", i, "field", e.target.value)} />
                <div className="flex gap-2">
                  <Input placeholder="Start" value={edu.startDate} onChange={(e) => updateArr("education", i, "startDate", e.target.value)} />
                  <Input placeholder="End" value={edu.endDate} onChange={(e) => updateArr("education", i, "endDate", e.target.value)} />
                </div>
              </div>
              <Textarea value={edu.description} onChange={(v) => updateArr("education", i, "description", v)} placeholder="Description" rows={2} />
              <Button variant="ghost" size="sm" onClick={() => removeFromArr("education", i)} className="text-destructive hover:text-destructive gap-1.5 text-xs">
                <Trash2 size={13} /> Remove
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addToArr("education", { institution: "", degree: "", field: "", startDate: "", endDate: "", description: "", achievements: [] })} className="gap-2">
            <Plus size={14} /> Add Education
          </Button>
        </div>
      </Section>

      {/* ─── Certifications ─── */}
      <Section title="Certifications" icon={Award}>
        <div className="space-y-3">
          {(data.certifications || []).map((cert: any, i: number) => (
            <div key={i} className="border border-border/40 rounded-lg p-4 bg-secondary/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <Input placeholder="Certification Name" value={cert.name} onChange={(e) => updateArr("certifications", i, "name", e.target.value)} />
                <Input placeholder="Issuing Organization" value={cert.issuer} onChange={(e) => updateArr("certifications", i, "issuer", e.target.value)} />
                <Input placeholder="Date (e.g. Jan 2024)" value={cert.date} onChange={(e) => updateArr("certifications", i, "date", e.target.value)} />
                <Input placeholder="Credential URL (optional)" value={cert.credentialUrl || ""} onChange={(e) => updateArr("certifications", i, "credentialUrl", e.target.value)} />
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFromArr("certifications", i)} className="text-destructive hover:text-destructive gap-1.5 text-xs">
                <Trash2 size={13} /> Remove
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addToArr("certifications", { name: "", issuer: "", date: "", credentialUrl: "" })} className="gap-2">
            <Plus size={14} /> Add Certification
          </Button>
        </div>
      </Section>

      {/* ─── Contact Info ─── */}
      <Section title="Contact Info" icon={Phone}>
        <FieldRow label="Location">
          <Input value={data.contact?.location || ""} onChange={(e) => set("contact.location", e.target.value)} placeholder="City, Country" />
        </FieldRow>
        <FieldRow label="Email">
          <Input value={data.contact?.email || ""} onChange={(e) => set("contact.email", e.target.value)} placeholder="you@example.com" />
        </FieldRow>
        <FieldRow label="Phone">
          <Input value={data.contact?.phone || ""} onChange={(e) => set("contact.phone", e.target.value)} placeholder="+1 (555) 000-0000" />
        </FieldRow>
        <FieldRow label="GitHub">
          <Input value={data.contact?.social?.github || ""} onChange={(e) => set("contact.social.github", e.target.value)} placeholder="https://github.com/..." />
        </FieldRow>
        <FieldRow label="Twitter / X">
          <Input value={data.contact?.social?.twitter || ""} onChange={(e) => set("contact.social.twitter", e.target.value)} placeholder="https://x.com/..." />
        </FieldRow>
        <FieldRow label="LinkedIn">
          <Input value={data.contact?.social?.linkedin || ""} onChange={(e) => set("contact.social.linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
        </FieldRow>
        <FieldRow label="Facebook">
          <Input value={data.contact?.social?.facebook || ""} onChange={(e) => set("contact.social.facebook", e.target.value)} placeholder="https://facebook.com/..." />
        </FieldRow>
        <FieldRow label="Instagram">
          <Input value={data.contact?.social?.instagram || ""} onChange={(e) => set("contact.social.instagram", e.target.value)} placeholder="https://instagram.com/..." />
        </FieldRow>
      </Section>
    </div>
  )
}
