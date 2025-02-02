import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const pictures = [
  "pic1",
  "pic2",
  "pic3",
  "pic4",
  "pic5",
  "pic6",
  "pic6",
  "pic6",
  "pic6",
  "pic6",
  "pic11",
  "pic12",
  "pic13",
  "pic14",
  "pic15",
  "pic16",
];

export const pageAtom = atom(0);

export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];

for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);

  return (
    <>
      <main className="h-screen pointer-events-none select-none z-10 absolute w-full inset-0 flex flex-col justify-between">
        {/* Page Navigation */}
        {/* <div className="w-full flex justify-center items-center overflow-auto pointer-events-auto p-10">
          <div className="flex items-center gap-4 flex-wrap justify-center max-w-full ml-20">
            {pages.map((_, index) => (
              <button
                key={index}
                className={`border-transparent hover:border-[#F87871] transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${
                  index === page
                    ? "bg-button text-white"
                    : "bg-[#093D6F] text-white"
                }`}
                onClick={() => setPage(index)}
              >
                {index === 0 ? "Cover" : `Page ${index}`}
              </button>
            ))}
            <button
              className={`border-transparent border-1 hover:border-[#F87871] transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${
                page === pages.length
                  ? "bg-button text-black"
                  : "bg-[#093D6F] text-white"
              }`}
              onClick={() => setPage(pages.length)}
            >
              Back Cover
            </button>
          </div>
        </div> */}
      </main>
    </>
  );
};
