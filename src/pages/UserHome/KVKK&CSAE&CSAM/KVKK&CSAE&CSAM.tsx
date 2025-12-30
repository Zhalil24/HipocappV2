import { TEXTS } from "@/Utilities/constants/terms_constants";
import { Info } from "lucide-react";
import { useState } from "react";

const KVKKCSAECSAM: React.FC = () => {
  const [lang, setLang] = useState<"en" | "tr">("en");
  const t = TEXTS[lang];

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-[#e0f2fe] via-white to-[#f0f9ff] py-16 px-4 mt-[60px] md:mt-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
              {t.title}
            </h1>
          </div>

          {/* Language Switch */}
          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-md text-sm font-semibold ${
                lang === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("tr")}
              className={`px-3 py-1 rounded-md text-sm font-semibold ${
                lang === "tr"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              TR
            </button>
          </div>
        </div>

        {/* Content */}
        <section className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-line">
          {t.content}
        </section>
      </div>
    </div>
  );
};

export default KVKKCSAECSAM;
