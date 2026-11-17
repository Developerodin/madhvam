"use client";

import { FormEvent, useState } from "react";

const BROCHURE_PDF_URL = "/assets/documents/Madhavam-Online-Brochure.pdf";
const BROCHURE_DOWNLOAD_NAME = "Madhavam Online_Brochure.pdf";

function triggerBrochureDownload() {
  const link = document.createElement("a");
  link.href = BROCHURE_PDF_URL;
  link.download = BROCHURE_DOWNLOAD_NAME;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function BrochureForm() {
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

    // Open blank tab during the user gesture so mobile browsers allow it after await.
    const pdfTab = window.open("about:blank", "_blank");

    setSubmitting(true);
    try {
      const res = await fetch("/api/public/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          message: message.trim(),
          company: "", // honeypot
        }),
      });
      let data: { error?: string; ok?: boolean; id?: string } = {};
      try {
        data = (await res.json()) as typeof data;
      } catch {
        /* non-JSON error body */
      }
      if (!res.ok) {
        if (pdfTab) pdfTab.close();
        setFormError(
          data.error ||
            `Could not send your details (${res.status}). Is MongoDB running?`,
        );
        return;
      }
      triggerBrochureDownload();
      if (pdfTab) {
        pdfTab.location.href = BROCHURE_PDF_URL;
      } else {
        window.open(BROCHURE_PDF_URL, "_blank", "noopener,noreferrer");
      }
      setSuccess(true);
    } catch {
      if (pdfTab) pdfTab.close();
      setFormError(
        "Could not send your details. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="form-success" id="brochureSuccess" role="status">
        <p>
          Thank you. We have your details for Madhavam. Your brochure download
          should start automatically.
        </p>
        <p>
          <a
            href={BROCHURE_PDF_URL}
            download={BROCHURE_DOWNLOAD_NAME}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download the brochure
          </a>
        </p>
      </div>
    );
  }

  return (
    <form
      className={`enquiry reveal is-in${validated ? " was-validated" : ""}`}
      id="brochureForm"
      noValidate
      onSubmit={onSubmit}
    >
      <div className="field">
        <label htmlFor="brochureFullName">Full name</label>
        <input
          className="form-control"
          id="brochureFullName"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="invalid">Please enter your full name.</p>
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label htmlFor="brochureCompany">Company</label>
        <input
          id="brochureCompany"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <div className="field">
        <label htmlFor="brochurePhone">Phone</label>
        <input
          className="form-control"
          id="brochurePhone"
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
        <label htmlFor="brochureEmail">
          Email address <span>(optional)</span>
        </label>
        <input
          className="form-control"
          id="brochureEmail"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="invalid">Please enter a valid email address.</p>
      </div>
      <div className="field" id="brochureMessageWrap" hidden={!messageReady}>
        <label htmlFor="brochureMessage">
          Message <span>(optional)</span>
        </label>
        <textarea
          className="form-control"
          id="brochureMessage"
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
