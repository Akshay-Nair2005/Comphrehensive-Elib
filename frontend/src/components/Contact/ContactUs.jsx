import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "../../components/Book/Experience";
import { UI } from "../../components/Book/UI";

const api = import.meta.env.VITE_APIKEY_CONTACT;

const onSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  formData.append("access_key", api);

  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  }).then((res) => res.json());

  if (res.success) {
    console.log("Success", res);
    alert("Your message has been submitted successfully!");
  }
};

const ContactUs = () => {
  return (
    <div className="contact-us p-3 pb-8 text-button flex justify-between max-w-screen-xl mx-auto space-x-8 max-sm:block text-color">
      {/* Form Section */}
      <div className="w-full sm:w-1/2">
        <h1 className="text-3xl font-bold mb-4 text-color">Contact Us</h1>
        <p className="text-lg mb-6 text-color">
          If you have any questions, feel free to reach out to us!
        </p>
        <form className="contact-form space-y-4 mt-10" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="block text-lg mb-2 text-color">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full sm:w-[80%] p-2 border border-gray-300 rounded text-color"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="block text-lg mb-2 text-color">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full sm:w-[80%] p-2 border border-gray-300 rounded text-color"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message" className="block text-lg mb-2 text-color">
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              required
              className="w-full sm:w-[80%] p-2 border border-gray-300 rounded text-color"
            ></textarea>
          </div>
          <button
            type="submit"
            className=" w-full sm:w-[80%] bg-button text-button py-2 px-16 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="w-full sm:w-1/2 flex flex-col items-center justify-center">
        {/* Full-screen container for 3D Canvas */}
        <UI />
        <div style={{ width: "120%", height: "120%" }}>
          <Canvas shadows camera={{ position: [-0.5, 1, 4], fov: 45 }}>
            <group position-y={0}>
              <Suspense fallback={null}>
                <Experience />
              </Suspense>
            </group>
          </Canvas>
        </div>
      </div>
      {/* 3D Canvas Section */}
    </div>
  );
};

export default ContactUs;
