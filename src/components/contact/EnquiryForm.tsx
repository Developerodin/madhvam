"use client";

import { FormEvent, useState } from "react";

export function EnquiryForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [validated, setValidated] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [phoneValidity, setPhoneValidity] = useState("");

  const messageReady =
    name.trim().length > 1 && phone.replace(/\D/g, "").length >= 10;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const form = event.currentTarget;
    const digits = phone.replace(/\D/g, "");
    const nextValidity =
      digits.length < 10 ? "Enter a phone number with at least 10 digits." : "";
    setPhoneValidity(nextValidity);

    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement;
    phoneInput.setCustomValidity(nextValidity);

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/public/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });
      let data: { error?: string; ok?: boolean; id?: string } = {};
      try {
        data = (await res.json()) as typeof data;
      } catch {
        /* non-JSON error body */
      }
      if (!res.ok) {
        setFormError(
          data.error ||
            `Could not send enquiry (${res.status}). Is MongoDB running?`,
        );
        return;
      }
      setSuccess(true);
    } catch {
      setFormError("Could not send enquiry. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <p className="form-success" id="enquirySuccess" role="status">
        Thank you. We have your enquiry for Madhavam and will respond within one
        working day.
      </p>
    );
  }

  return (
    <form
      className={`enquiry reveal is-in${validated ? " was-validated" : ""}`}
      id="enquiryForm"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input
          className="form-control"
          id="fullName"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="invalid">Please enter your full name.</p>
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input
          className="form-control"
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setPhoneValidity("");
            e.target.setCustomValidity("");
          }}
        />
        <p className="invalid">
          {phoneValidity || "Please enter a phone number."}
        </p>
      </div>
      <div className="field">
        <label htmlFor="email">
          Email address <span>(optional)</span>
        </label>
        <input
          className="form-control"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="invalid">Please enter a valid email address.</p>
      </div>
      <div className="field" id="messageWrap" hidden={!messageReady}>
        <label htmlFor="message">
          Message <span>(optional)</span>
        </label>
        <textarea
          className="form-control"
          id="message"
          name="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {formError ? (
        <p className="invalid" role="alert" style={{ display: "block" }}>
          {formError}
        </p>
      ) : null}
      <button className="btn btn-solid" type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Enquire Now"}
      </button>
    </form>
  );
}
