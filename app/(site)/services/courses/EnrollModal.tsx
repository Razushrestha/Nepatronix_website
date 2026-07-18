"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export interface EnrollCourse {
  name: string;
  price: string;
  priceUnit: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

export default function EnrollModal({
  course,
  onClose,
}: {
  course: EnrollCourse;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string): boolean =>
    /^(\+?\d{1,3}[-.\s]?)?\d{9,14}$/.test(phone.replace(/\s/g, ""));

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    else if (formData.fullName.trim().length < 2) errors.fullName = "Name must be at least 2 characters";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(formData.email)) errors.email = "Please enter a valid email address";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!validatePhone(formData.phone)) errors.phone = "Please enter a valid phone number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const enrollResponse = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          courseName: course.name,
          coursePrice: course.price,
        }),
      });

      const SERVICE_ID = "service_kjd43s2";
      const TEMPLATE_ID = "template_lew7hye";
      const PUBLIC_KEY = "Qn6NLMmkaLabSyyZR";
      emailjs.init(PUBLIC_KEY);

      const templateParams = {
        from_name: formData.fullName,
        from_email: formData.email,
        phone_number: formData.phone,
        message: `
Course Enrollment Request
-------------------------
Course: ${course.name}
Price: ${course.price} ${course.priceUnit}
Organization: ${formData.organization || "Not specified"}
Additional Message: ${formData.message || "None"}
        `,
        reply_to: formData.email,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

      // Success regardless of enroll API result (email notification sent)
      void enrollResponse;
      setSubmitStatus("success");
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error("Enrollment error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-xl font-bold text-slate-900">Enroll in Course</h3>
          <p className="text-slate-500 text-sm mt-1">{course.name}</p>
          <div className="mt-2 inline-block bg-[#C1121F]/10 text-[#C1121F] text-sm font-semibold px-3 py-1 rounded-full">
            {course.price} {course.priceUnit}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitStatus === "success" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900">Enrollment Request Sent!</h4>
              <p className="text-slate-500 text-sm mt-2">We&apos;ll contact you shortly with more details.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: undefined });
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg border ${formErrors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-[#C1121F] focus:ring-[#C1121F]/20"} focus:ring-2 outline-none transition-all text-slate-900`}
                  placeholder="Enter your full name"
                />
                {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg border ${formErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-[#C1121F] focus:ring-[#C1121F]/20"} focus:ring-2 outline-none transition-all text-slate-900`}
                  placeholder="your@email.com"
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg border ${formErrors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 focus:border-[#C1121F] focus:ring-[#C1121F]/20"} focus:ring-2 outline-none transition-all text-slate-900`}
                  placeholder="+977 98XXXXXXXX"
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">School/Organization</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#C1121F] focus:ring-2 focus:ring-[#C1121F]/20 outline-none transition-all text-slate-900"
                  placeholder="Your school or organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message (Optional)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#C1121F] focus:ring-2 focus:ring-[#C1121F]/20 outline-none transition-all text-slate-900 resize-none"
                  placeholder="Any specific requirements or questions?"
                />
              </div>

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  Something went wrong. Please try again or contact us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#C1121F] text-white font-semibold hover:bg-[#A30F19] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Enrollment Request"
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
