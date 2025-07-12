import { useState } from 'react';

const faqs = [
  {
    id: 1,
    question: "How do I take care of fresh flowers?",
    answer: "Keep flowers in a clean vase with fresh water. Change water every 2-3 days and trim stems at an angle. Keep away from direct sunlight and heat sources. Remove any wilted leaves or petals to prevent bacteria growth."
  },
  {
    id: 2,
    question: "How long do scented candles last?",
    answer: "Scented candles typically last 20-40 hours depending on size and quality. To maximize burn time, trim wick to 1/4 inch before lighting, burn for 2-3 hours at a time, and keep away from drafts. Always burn on a heat-resistant surface."
  },
  {
    id: 3,
    question: "What's the best way to store ceramic products?",
    answer: "Store ceramic items in a cool, dry place away from direct sunlight. Avoid stacking heavy items on top. Clean with mild soap and warm water, avoiding harsh chemicals. For decorative pieces, dust regularly with a soft cloth."
  },
  {
    id: 4,
    question: "How do I maintain wooden home decor?",
    answer: "Dust wooden items regularly with a soft, dry cloth. Avoid using water or harsh chemicals. For cleaning, use a slightly damp cloth with mild soap, then dry immediately. Apply furniture polish occasionally to maintain shine and protect the wood."
  },
  {
    id: 5,
    question: "What's the proper way to care for indoor plants?",
    answer: "Water plants when the top inch of soil feels dry. Provide adequate sunlight based on plant type. Use well-draining pots and quality potting soil. Fertilize during growing season and repot when roots outgrow the container."
  }
];

function FAQ() {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-lg">Everything you need to know about caring for your products</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-gray-500 transition-transform ${
                    openItem === faq.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {openItem === faq.id && (
                <div className="pb-6 px-6">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Still have questions? <span className="text-blue-600 hover:underline cursor-pointer">Contact our support team</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FAQ; 