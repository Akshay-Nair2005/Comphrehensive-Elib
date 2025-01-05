import React from "react";

/* Don't forget to download the CSS file too 
OR remove the following line if you're already using Tailwind */

// import "./style.css";

export const NewDashboard = () => {
  return (
    <div id="webcrumbs">
      <div className="w-[1200px] min-h-[700px] bg-neutral-800 text-primary-50 rounded-lg shadow-lg p-6 flex flex-col gap-6">
        {" "}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-[40px] h-[40px] bg-neutral-50 rounded-full"></div>
            <h1 className="text-xl font-title">Library</h1>
            <nav className="flex gap-6 text-neutral-400">
              <a href="#" className="hover:text-primary-500">
                Books
              </a>
              <a href="#" className="hover:text-primary-500">
                Authors
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search here"
              className="px-4 py-2 rounded-md bg-neutral-900 text-primary-50"
            />
            <button className="w-[40px] h-[40px] bg-neutral-700 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-neutral-400">
                search
              </span>
            </button>
          </div>
        </header>
        <main className="flex flex-col gap-6">
          <section>
            <h2 className="text-lg font-title mb-4">Previous Reading</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-title mb-4">Subjects section</h2>
            <div className="grid grid-cols-5 gap-4">
              <div className="p-4 bg-neutral-700 rounded-md text-center">
                <p>Design</p>
                <p className="text-primary-500 font-bold">1.2k</p>
              </div>
              <div className="p-4 bg-neutral-700 rounded-md text-center">
                <p>Cooking</p>
                <p className="text-primary-500 font-bold">180</p>
              </div>
              <div className="p-4 bg-neutral-700 rounded-md text-center">
                <p>Arts</p>
                <p className="text-primary-500 font-bold">1.8k</p>
              </div>
              <div className="p-4 bg-neutral-700 rounded-md text-center">
                <p>Science</p>
                <p className="text-primary-500 font-bold">230</p>
              </div>
              <div className="p-4 bg-neutral-700 rounded-md text-center">
                <p>Others</p>
                <p className="text-primary-500 font-bold">900</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-title mb-4">Popular books</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-title mb-4">Writers and Authors</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-title mb-4">New books</h2>
            <div className="grid grid-cols-6 gap-4">
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
