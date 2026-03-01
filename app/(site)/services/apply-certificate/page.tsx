"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';

const ApplyForCertificationPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    trainingHours: '1.5',
    trainingDays: '1',
    email: '',
    contactNumber: '',
    courseType: 'paid',
  });
  const [studentImage, setStudentImage] = useState<File | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStudentImage(e.target.files[0]);
    }
  };

  const handleScreenshotChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentScreenshot(e.target.files[0]);
    }
  };

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    setSubmitMessage(''); // Clear any previous messages
    // Simple validation before proceeding
    if (!formData.fullName) {
      setSubmitMessage('Please enter your full name.');
      return;
    }
    if (!formData.email) {
      setSubmitMessage('Please enter your email address.');
      return;
    }
    if (!formData.contactNumber) {
      setSubmitMessage('Please enter your contact number.');
      return;
    }
    if (!studentImage) {
      setSubmitMessage('Please upload your student image.');
      return;
    }
    if (formData.courseType === 'paid') {
      setStep(2);
    } else {
      // If course is free, submit directly
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitMessage(''); // Clear any previous messages
    if (!studentImage) {
      setSubmitMessage('Please upload a student image.');
      return;
    }
    if (formData.courseType === 'paid' && !paymentScreenshot) {
      setSubmitMessage('Please upload a payment screenshot.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert images to base64
      const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };

      const profileImageBase64 = await toBase64(studentImage);
      let paymentScreenshotBase64 = null;
      if (paymentScreenshot) {
        paymentScreenshotBase64 = await toBase64(paymentScreenshot);
      }

      // Submit to API endpoint with base64 images
      const response = await fetch('/api/apply-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          contactNumber: formData.contactNumber,
          courseType: formData.courseType,
          trainingHours: formData.trainingHours,
          trainingDays: formData.trainingDays,
          courseName: `${formData.trainingHours} hours / ${formData.trainingDays} days Professional Course`,
          profileImage: profileImageBase64,
          paymentScreenshot: paymentScreenshotBase64,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage('✅ Application submitted successfully! Check your email for confirmation.');
        setStep(1);
        // Reset is handled below
        setFormData({
          fullName: '',
          trainingHours: '1.5',
          trainingDays: '1',
          email: '',
          contactNumber: '',
          courseType: 'paid',
        });
        setStudentImage(null);
        setPaymentScreenshot(null);
      } else {
        setSubmitMessage(`❌ Error: ${data.error || 'Failed to submit application'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('❌ An error occurred. Please try again. Check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-[#020617]">
        {/* Background Effects */}
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-[#C1121F] blur-[120px] pointer-events-none opacity-20" />
        <div className="absolute top-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-blue-500 blur-[100px] pointer-events-none opacity-20" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#C1121F]/10 px-4 py-2 text-sm font-medium text-[#C1121F] ring-1 ring-inset ring-[#C1121F]/30 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1121F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C1121F]"></span>
              </span>
              Professional Certification Program
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Apply for <span className="text-[#C1121F]">Certification</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Get your professional certificate recognized by industry leaders. Complete the form below to validate your skills and enhance your career prospects.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white border border-white/20">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Industry Recognized
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white border border-white/20">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quick Processing
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white border border-white/20">
                <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified Credentials
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto max-w-2xl">
        {/* Step Indicator */}
        {formData.courseType === 'paid' && (
          <div className="mb-6 max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-0">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-sm ${
                  step === 1 
                    ? 'bg-[#C1121F] text-white ring-4 ring-[#C1121F]/20' 
                    : 'bg-green-500 text-white'
                }`}>
                  {step > 1 ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : '1'}
                </div>
                <span className={`ml-2 font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap ${
                  step === 1 ? 'text-gray-800' : 'text-green-600'
                }`}>
                  Application Details
                </span>
              </div>

              {/* Connector Line */}
              <div className={`w-12 sm:w-16 md:w-24 lg:w-32 h-1 mx-2 sm:mx-3 md:mx-4 rounded flex-shrink-0 ${
                step === 2 ? 'bg-[#C1121F]' : 'bg-gray-300'
              }`}></div>

              {/* Step 2 */}
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-sm ${
                  step === 2 
                    ? 'bg-[#C1121F] text-white ring-4 ring-[#C1121F]/20' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`ml-2 font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap ${
                  step === 2 ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  Payment
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
        {step === 1 && (
          <form onSubmit={handleNextStep}>
            {/* Form Fields from Step 1 */}
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wide">Full Name *</label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="courseType" className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wide">Course Type *</label>
              <select
                name="courseType"
                id="courseType"
                value={formData.courseType}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="paid">Paid</option>
                <option value="free">Free</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="trainingHours" className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wide">Training Hours *</label>
              <select
                name="trainingHours"
                id="trainingHours"
                value={formData.trainingHours}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="1.5">1.5 hours</option>
                <option value="3">3 hours</option>
                <option value="30">30 hours</option>
                <option value="35">35 hours</option>
                <option value="40">40 hours</option>
                <option value="60">60 hours</option>
              </select>
              {(formData.trainingHours === '1.5' || formData.trainingHours === '3') && (
                <div className="mt-2 p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-semibold">
                    📌 Certificate charge is NPR: 300/- only
                  </p>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="trainingDays" className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wide">Training Days *</label>
              <select
                name="trainingDays"
                id="trainingDays"
                value={formData.trainingDays}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="1">1 day</option>
                <option value="7">7 days</option>
                <option value="10">10 days</option>
                <option value="45">45 days</option>
                <option value="60">60 days</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="studentImage" className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wide">Student Image *</label>
              <div className="relative">
                <label
                  htmlFor="studentImage"
                  className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-2.5 px-3 flex items-center justify-between w-full hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-500">
                      {studentImage ? studentImage.name : 'Choose a file'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
                    Browse
                  </span>
                </label>
                <input
                  type="file"
                  name="studentImage"
                  id="studentImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wide">Email Address *</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contactNumber" className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wide">Contact Number *</label>
              <input
                type="text"
                name="contactNumber"
                id="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="98XXXXXXXX"
                required
              />
            </div>
            <div className="text-center mt-6">
              <button
                type="submit"
                className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-10 text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                disabled={isSubmitting}
              >
                {formData.courseType === 'paid' ? 'Proceed to Payment →' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && formData.courseType === 'paid' && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Payment Details</h2>
            
            {/* Payment Information Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100 shadow-sm">
              <div className="flex flex-col items-center">
                {/* QR Code Section */}
                <div className="bg-white p-3 rounded-lg shadow-md mb-4">
                  <Image 
                    src="/BankQR.png" 
                    alt="Nepatronix Payment QR Code" 
                    width={180} 
                    height={180}
                    className="rounded-lg"
                  />
                </div>
                
                {/* Bank Details */}
                <div className="w-full max-w-md bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h3 className="text-base font-bold text-gray-800 mb-3 text-center border-b pb-2">Bank Account Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Bank Name</p>
                        <p className="font-semibold text-gray-800">Laxmi Sunrise Bank Pvt.Ltd</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Account Name</p>
                        <p className="font-semibold text-gray-800">Nepatronix Engineering Solution Pvt.Ltd</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Account Number</p>
                        <p className="font-semibold text-gray-800 text-base tracking-wider">0061186057701001</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <p className="text-xs text-yellow-800">
                    💡 Please complete the payment and upload the screenshot below
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="paymentScreenshot" className="block text-gray-700 font-semibold mb-2 text-xs uppercase tracking-wide">Upload Payment Screenshot *</label>
                <div className="relative">
                  <label
                    htmlFor="paymentScreenshot"
                    className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-2.5 px-3 flex items-center justify-between w-full hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className={`block font-medium text-sm ${paymentScreenshot ? 'text-green-600' : 'text-gray-600'}`}>
                          {paymentScreenshot ? paymentScreenshot.name : 'Choose payment screenshot'}
                        </span>
                        {!paymentScreenshot && (
                          <span className="text-xs text-gray-400">PNG, JPG or JPEG (Max 5MB)</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
                      Browse
                    </span>
                  </label>
                  <input
                    type="file"
                    name="paymentScreenshot"
                    id="paymentScreenshot"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-gray-600 font-semibold text-sm py-2.5 px-5 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white font-semibold text-sm py-2.5 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  disabled={isSubmitting || !paymentScreenshot}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        )}

        {submitMessage && (
          <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
            submitMessage.includes('success') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {submitMessage}
          </div>
        )}
        </div>
      </div>
      </section>
    </div>
  );
};

export default ApplyForCertificationPage;
