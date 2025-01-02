import React from 'react';

const ContactUs = () => {
    return (
        <div className="contact-us  p-8 text-button flex w-[99vw] justify-evenly max-sm:block">
            <div className='w-[50%] '>
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg mb-6">If you have any questions, feel free to reach out to us!</p>
            <form className="contact-form space-y-4 mt-10">
                <div className="form-group">
                    <label htmlFor="name" className="block text-lg mb-2">Name:</label>
                    <input type="text" id="name" name="name" required className="w-[80%] p-2 border border-gray-300 rounded" />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="block text-lg mb-2">Email:</label>
                    <input type="email" id="email" name="email" required className="w-[80%] p-2 border border-gray-300 rounded" />
                </div>
                <div className="form-group">
                    <label htmlFor="message" className="block text-lg mb-2">Message:</label>
                    <textarea id="message" name="message" required className="w-[80%] p-2 border border-gray-300 rounded text-black"></textarea>
                </div>
                <button type="submit" className="bg-button text-button py-2 px-[36.5%] rounded-lg">Submit</button>
            </form>
            </div>
            <div className='w-[50%] flex justify-center items-center'>
                <img src="/images/novelsync1.png" alt="image" className='h-[90%]' />
            </div>
        </div>
    );
};

export default ContactUs;
