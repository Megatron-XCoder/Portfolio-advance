"use client"

import { useState, useRef, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitContactForm } from "@/app/actions/contact"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

const initialState = {
    success: false,
    message: "",
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Sending...
                </>
            ) : (
                "Send Message"
            )}
        </Button>
    )
}

export function ContactForm() {
    const [state, formAction] = useFormState(submitContactForm, initialState)
    const formRef = useRef<HTMLFormElement>(null)
    const [showMessage, setShowMessage] = useState(false)

    useEffect(() => {
        if (state.message) {
            setShowMessage(true)

            if (state.success) {
                // Reset form on success
                formRef.current?.reset()

                // Scroll to top of the form
                const formElement = formRef.current
                if (formElement) {
                    formElement.scrollIntoView({ behavior: "smooth", block: "start" })
                }

                // Hide message after 5 seconds
                const timer = setTimeout(() => {
                    setShowMessage(false)
                }, 5000)

                return () => clearTimeout(timer)
            }
        }
    }, [state])

    return (
        <div className="terminal-window">
            <div className="terminal-header">
                <div className="terminal-button terminal-button-red"></div>
                <div className="terminal-button terminal-button-yellow"></div>
                <div className="terminal-button terminal-button-green"></div>
                <div className="terminal-title">contact_form.sh</div>
            </div>
            <div className="terminal-content">
                <p className="mb-4">
                    <span className="text-primary">$</span> ./send_message.sh
                </p>

                {showMessage && (
                    <div
                        className={`mb-4 p-3 rounded-md flex items-start gap-2 ${
                            state.success
                                ? "bg-primary/10 border border-primary/30"
                                : "bg-destructive/10 border border-destructive/30"
                        }`}
                    >
                        {state.success ? (
                            <CheckCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
                        ) : (
                            <AlertCircle size={18} className="text-destructive mt-0.5 flex-shrink-0" />
                        )}
                        <p>{state.message}</p>
                    </div>
                )}

                <form ref={formRef} action={formAction} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm mb-1">
                            <span className="text-primary">name:</span>
                        </label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            className="bg-background border-border"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm mb-1">
                            <span className="text-primary">email:</span>
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="bg-background border-border"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm mb-1">
                            <span className="text-primary">message:</span>
                        </label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Enter your message"
                            rows={4}
                            className="bg-background border-border"
                            required
                        />
                    </div>
                    <SubmitButton />
                </form>
            </div>
        </div>
    )
}
