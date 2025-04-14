import Link from "next/link"
import { Github, Twitter, Linkedin, Mail, Facebook, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Sanjeev Kumar Das. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="https://github.com/Megatron-XCoder" className="text-muted-foreground hover:text-primary transition-colors">
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="https://x.com/Official_San_Kd" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://www.linkedin.com/in/sanjeev-kd/" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="https://www.facebook.com/profile.php?id=100076465377831" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="https://www.instagram.com/sanjeev_kd_/" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="mailto:crisiscrush525@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={20} />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
