import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import clientPromise from "@/lib/mongodb"

const defaultAboutData = {
  introText: "Initializing personal profile... Access granted. Loading bio data...",
  bioText:
    "Software Engineer with excellent problem-solving skills and ability to perform well in a team. Good knowledge of Java, JavaScript, Kotlin, Linux, Agile Methodology, Cloud Computing Technologies, and SDLC models. Passionate about DevOps with exceptional qualities.",
  aboutBody:
    "As an innovative developer, with strong expertise in Java, JavaScript, MERN Stack, Kotlin, Linux, Agile Methodology, Cloud Computing Technologies, and SDLC models, I bring a well-rounded skill set to every project. Passionate about DevOps, I leverage my exceptional qualities to ensure seamless integration and continuous delivery.",
  stats: [
    { label: "Happy Clients", value: 12, description: "We are proud to have collaborated with a diverse range of clients." },
    { label: "Projects", value: 8, description: "Each project highlights my commitment to delivering top-notch solutions." },
    { label: "Years of Experience", value: 1, description: "In multiple technologies, with a passion for continuous learning." },
    { label: "Awards", value: 3, description: "Achieved Training Champ position at Eclerx Services Limited." },
  ],
  skills: [
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
  ],
  experiences: [
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
  ],
  education: [
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
  ],
  certifications: [
    {
      name: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2024",
      credentialUrl: "",
    },
    {
      name: "Docker Certified Associate",
      issuer: "Docker Inc.",
      date: "2024",
      credentialUrl: "",
    },
    {
      name: "Kubernetes Administrator (CKA)",
      issuer: "CNCF",
      date: "2023",
      credentialUrl: "",
    },
  ],
  contact: {
    location: "Chandigarh, India",
    email: "crisiscrush525@gmail.com",
    phone: "+91 70180 21841",
    social: {
      github: "https://github.com/Megatron-XCoder",
      twitter: "https://x.com/Official_San_Kd",
      linkedin: "https://www.linkedin.com/in/sanjeev-kd/",
      facebook: "https://www.facebook.com/profile.php?id=100076465377831",
      instagram: "https://www.instagram.com/sanjeev_kd_/",
    },
  },
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const profile = await db.collection("about_profile").findOne({})

    if (!profile) {
      return NextResponse.json(defaultAboutData)
    }

    const { _id, ...data } = profile
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching about data:", error)
    return NextResponse.json(defaultAboutData)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()
    const data = await request.json()

    // Upsert: find the single profile document, replace it
    await db.collection("about_profile").updateOne(
      {},
      { $set: { ...data, updatedAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating about data:", error)
    return NextResponse.json({ error: "Failed to update about data" }, { status: 500 })
  }
}
