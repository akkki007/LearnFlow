"use client";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

const faqData = [
  {
    question: "What is React?",
    answer:
      "React is a popular JavaScript library for building user interfaces, particularly single-page applications. It's used for handling the view layer in web and mobile apps.",
  },
  {
    question: "What is Tailwind CSS?",
    answer:
      "Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without ever leaving your HTML. It provides low-level utility classes that let you build completely custom designs.",
  },
  {
    question: "How do I install React?",
    answer:
      "You can create a new React project using Create React App. Run 'npx create-react-app my-app' in your terminal, replace 'my-app' with your project name.",
  },
  {
    question: "Is Tailwind CSS difficult to learn?",
    answer:
      "While Tailwind has a learning curve, many developers find it intuitive once they get used to it. Its utility-first approach allows for rapid development and easy customization.",
  },
  {
    question: "Can I use React with Tailwind CSS?",
    answer:
      "Yes, React and Tailwind CSS work great together! You can easily integrate Tailwind CSS into your React project for styling your components.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen -mt-10 flex items-center justify-center  p-4 sm:p-8">
      <div className="w-full max-w-3xl bg-white rounded-md shadow-xl overflow-hidden">
        <div className=" p-8">
          <h2 className="text-3xl poppins-bold text-center bg-gradient-to-r from-green-300 via-green-500 to-green-700 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="p-6 cursor-pointer"
              onClick={() => toggleQuestion(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg poppins-medium text-gray-900">
                  {item.question}
                </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 text-green-500 transition-transform duration-200 ${
                    activeIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </div>
              <div
                className={`mt-3 text-gray-600 poppins-regular transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
