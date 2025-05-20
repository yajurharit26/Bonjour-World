"use client"

import { useState } from "react"
import { useInView } from "react-intersection-observer"
import "./Contact.css"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [imageRef, imageInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setResult("Sending....")

    const formDataToSend = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value)
    })

    formDataToSend.append("access_key", "c6860d40-b312-4bc0-b8df-06aa6e30b30a")

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (data.success) {
        setResult("Message sent successfully!")
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        })
      } else {
        setResult("Something went wrong. Please try again.")
        console.error("Error", data)
      }
    } catch (error) {
      setResult("An error occurred. Please try again later.")
      console.error("Error", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-section">
      <div className="contact-container">
        <div className={`contact-form-container ${formInView ? "slide-in" : ""}`} ref={formRef}>
          <h2>Get In Touch</h2>
          <p>Have questions about language exchange? Send us a message!</p>

          <form onSubmit={onSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Query</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                rows="4"
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-button" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>

            {result && <div className="form-result">{result}</div>}
          </form>
        </div>

        <div className={`contact-image-container ${imageInView ? "slide-in" : ""}`} ref={imageRef}>
          <div className="contact-image">
            <div className="image-overlay">
              <h3>Connect With Us</h3>
              <p>Join our global community of language enthusiasts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
