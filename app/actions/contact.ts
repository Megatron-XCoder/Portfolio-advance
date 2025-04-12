"use server"

import { z } from "zod"
import nodemailer from "nodemailer"

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
})

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    // Validate form data
    const validatedFields = contactFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    })

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "crisiscrush525@gmail.com", // Your email
        pass: process.env.EMAIL_PASSWORD, // This should be an app password for Gmail
      },
    })

    // Email content
    const mailOptions = {
      from: `"Portfolio Contact" <crisiscrush525@gmail.com>`,
      to: "crisiscrush525@gmail.com",
      subject: `New Contact from ${validatedFields.name}`,
      text: `
Name: ${validatedFields.name}
Email: ${validatedFields.email}
Message: ${validatedFields.message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
  <h2 style="color: #00ff8c;">New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${validatedFields.name}</p>
  <p><strong>Email:</strong> ${validatedFields.email}</p>
  <p><strong>Message:</strong></p>
  <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${validatedFields.message.replace(/\n/g, "<br>")}</p>
</div>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    // For SMS, you would need a Twilio account and credentials
    // This would be implemented here if you had Twilio set up

    return {
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    }
  } catch (error) {
    console.error("Contact form error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Failed to send message. Please try again." }
  }
}
