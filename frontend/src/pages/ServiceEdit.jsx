// // import { useState, useEffect } from "react";
// // import { fetchService, updateServiceAPI } from "../api/services";
// // import { useParams, useNavigate } from "react-router-dom";

// // export default function ServiceEdit({ token }) {
// //   const { id } = useParams();
// //   const [form, setForm] = useState({});
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const load = async () => {
// //       const res = await fetchService(id);
// //       setForm(res.data);
// //     };
// //     load();
// //   }, [id]);

// //   const handleChange = (e) => {
// //     const { name, value, files } = e.target;
// //     if (files) setForm({ ...form, [name]: files[0] });
// //     else setForm({ ...form, [name]: value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const data = new FormData();
// //     Object.keys(form).forEach((key) => data.append(key, form[key]));
// //     await updateServiceAPI(id, data, token);
// //     navigate("/services");
// //   };

// //   if (!form.serviceName) return <p>Loading...</p>;

// //   return (
// //     <div className="p-4 max-w-md mx-auto">
// //       <h2 className="text-2xl font-bold mb-4">Edit Service</h2>
// //       <form onSubmit={handleSubmit} className="flex flex-col gap-2">
// //         <input type="text" name="providerName" value={form.providerName} onChange={handleChange} className="border p-2 rounded" required />
// //         <input type="text" name="serviceName" value={form.serviceName} onChange={handleChange} className="border p-2 rounded" required />
// //         <input type="number" name="servicePrice" value={form.servicePrice} onChange={handleChange} className="border p-2 rounded" required />
// //         <input type="text" name="serviceType" value={form.serviceType} onChange={handleChange} className="border p-2 rounded" required />
// //         <textarea name="serviceDetail" value={form.serviceDetail} onChange={handleChange} className="border p-2 rounded" required />
// //         <input type="text" name="providerContact" value={form.providerContact} onChange={handleChange} className="border p-2 rounded" required />
// //         <input type="text" name="location" value={form.location} onChange={handleChange} className="border p-2 rounded" required />
// //         <input type="file" name="servicePicture" onChange={handleChange} className="border p-2 rounded" />
// //         <button type="submit" className="bg-green-500 text-white p-2 rounded mt-2">Update</button>
// //       </form>
// //     </div>
// //   );
// // }

// import { useState, useEffect } from "react";
// import { fetchService, updateServiceAPI } from "../api/services";
// import { useParams, useNavigate } from "react-router-dom";

// export default function ServiceEdit({ token }) {
//   const { id } = useParams();
//   const [form, setForm] = useState({
//     providerName: "",
//     serviceName: "",
//     servicePrice: "",
//     serviceType: "",
//     serviceDetail: "",
//     providerContact: "",
//     location: "",
//     servicePicture: null,
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetchService(id);
//         // Only take the fields you want to edit
//         const data = res.data;
//         setForm({
//           providerName: data.providerName || "",
//           serviceName: data.serviceName || "",
//           servicePrice: data.servicePrice || "",
//           serviceType: data.serviceType || "",
//           serviceDetail: data.serviceDetail || "",
//           providerContact: data.providerContact || "",
//           location: data.location || "",
//           servicePicture: null, // keep file null initially
//         });
//       } catch (err) {
//         console.error("Failed to load service:", err);
//       }
//     };
//     load();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files && files[0]) setForm({ ...form, [name]: files[0] });
//     else setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = new FormData();
//       data.append("providerName", form.providerName);
//       data.append("serviceName", form.serviceName);
//       data.append("servicePrice", Number(form.servicePrice)); // convert to number
//       data.append("serviceType", form.serviceType);
//       data.append("serviceDetail", form.serviceDetail);
//       data.append("providerContact", form.providerContact);
//       data.append("location", form.location);
//       if (form.servicePicture instanceof File) {
//         data.append("servicePicture", form.servicePicture);
//       }

//       await updateServiceAPI(id, data, token);
//       navigate("/services");
//     } catch (err) {
//       console.error("Failed to update service:", err);
//     }
//   };

//   if (!form.serviceName) return <p>Loading...</p>;

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Edit Service</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-2">
//         <input
//           type="text"
//           name="providerName"
//           value={form.providerName}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           name="serviceName"
//           value={form.serviceName}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="number"
//           name="servicePrice"
//           value={form.servicePrice}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           name="serviceType"
//           value={form.serviceType}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <textarea
//           name="serviceDetail"
//           value={form.serviceDetail}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           name="providerContact"
//           value={form.providerContact}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           name="location"
//           value={form.location}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="file"
//           name="servicePicture"
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />
//         <button
//           type="submit"
//           className="bg-green-500 text-white p-2 rounded mt-2"
//         >
//           Update
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { fetchService, updateServiceAPI } from "../api/services";
import { getBackendUrl } from "../api/client";
import { useParams, useNavigate } from "react-router-dom";

export default function ServiceEdit({ token }) {
  const { id } = useParams();
  const [form, setForm] = useState({
    providerName: "",
    serviceName: "",
    servicePrice: "",
    serviceType: "",
    serviceDetail: "",
    providerContact: "",
    location: "",
    servicePicture: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchService(id);
        const data = res.data;
        setForm({
          providerName: data.providerName || "",
          serviceName: data.serviceName || "",
          servicePrice: data.servicePrice || "",
          serviceType: data.serviceType || "",
          serviceDetail: data.serviceDetail || "",
          providerContact: data.providerContact || "",
          location: data.location || "",
          servicePicture: null,
        });

        // Set preview if image exists
        if (data.servicePicture) {
          setPreview(`${getBackendUrl()}${data.servicePicture}`);
        }
      } catch (err) {
        console.error("Failed to load service:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setForm({ ...form, [name]: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [name]: value });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.providerName.trim()) newErrors.providerName = "Provider name is required";
    if (!form.serviceName.trim()) newErrors.serviceName = "Service name is required";
    if (!form.servicePrice || form.servicePrice <= 0) newErrors.servicePrice = "Valid price is required";
    if (!form.serviceType.trim()) newErrors.serviceType = "Service type is required";
    if (!form.serviceDetail.trim()) newErrors.serviceDetail = "Service details are required";
    if (!form.providerContact.trim()) newErrors.providerContact = "Contact information is required";
    if (!form.location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("providerName", form.providerName);
      data.append("serviceName", form.serviceName);
      data.append("servicePrice", Number(form.servicePrice));
      data.append("serviceType", form.serviceType);
      data.append("serviceDetail", form.serviceDetail);
      data.append("providerContact", form.providerContact);
      data.append("location", form.location);
      if (form.servicePicture instanceof File) {
        data.append("servicePicture", form.servicePicture);
      }

      await updateServiceAPI(id, data, token);
      navigate("/services");
    } catch (err) {
      console.error("Failed to update service:", err);
      alert("Failed to update service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Edit Service</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  {preview ? (
                    <img className="h-24 w-24 object-cover rounded-lg border" src={preview} alt="Preview" />
                  ) : (
                    <div className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="block">
                  <span className="sr-only">Choose service image</span>
                  <input
                    type="file"
                    name="servicePicture"
                    onChange={handleChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
              </div>
            </div>

            {/* Provider Name */}
            <div>
              <label htmlFor="providerName" className="block text-sm font-medium text-gray-700 mb-2">
                Provider Name
              </label>
              <input
                type="text"
                id="providerName"
                name="providerName"
                value={form.providerName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.providerName ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter provider name"
              />
              {errors.providerName && <p className="mt-1 text-sm text-red-600">{errors.providerName}</p>}
            </div>

            {/* Service Name */}
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                value={form.serviceName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.serviceName ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter service name"
              />
              {errors.serviceName && <p className="mt-1 text-sm text-red-600">{errors.serviceName}</p>}
            </div>

            {/* Service Price */}
            <div>
              <label htmlFor="servicePrice" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="servicePrice"
                  name="servicePrice"
                  value={form.servicePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.servicePrice ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="0.00"
                />
              </div>
              {errors.servicePrice && <p className="mt-1 text-sm text-red-600">{errors.servicePrice}</p>}
            </div>

            {/* Service Type */}
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <input
                type="text"
                id="serviceType"
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.serviceType ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="e.g., Cleaning, Repair, Consultation"
              />
              {errors.serviceType && <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>}
            </div>

            {/* Service Detail */}
            <div>
              <label htmlFor="serviceDetail" className="block text-sm font-medium text-gray-700 mb-2">
                Service Details
              </label>
              <textarea
                id="serviceDetail"
                name="serviceDetail"
                value={form.serviceDetail}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.serviceDetail ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Describe your service in detail..."
              />
              {errors.serviceDetail && <p className="mt-1 text-sm text-red-600">{errors.serviceDetail}</p>}
            </div>

            {/* Provider Contact */}
            <div>
              <label htmlFor="providerContact" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Information
              </label>
              <input
                type="text"
                id="providerContact"
                name="providerContact"
                value={form.providerContact}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.providerContact ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Phone number or email"
              />
              {errors.providerContact && <p className="mt-1 text-sm text-red-600">{errors.providerContact}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Where is this service available?"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/services")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Service"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}