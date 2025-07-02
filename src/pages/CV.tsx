import Header from "@/components/Header";
import { useCVData } from "@/hooks/useCVData";
import { Calendar, MapPin } from "lucide-react";
import {
  FaYoutube,
  FaGithub,
  FaSlideshare,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
} from "react-icons/fa";

const CV = () => {
  const { data: cvData, isLoading, error } = useCVData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center">
            <div className="text-lg text-gray-600">Loading CV...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !cvData) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center">
            <div className="text-lg text-red-600">Failed to load CV data</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            {cvData.personal.name}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {cvData.personal.description}
          </p>
        </div>

        {/* Contact Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b border-gray-200 pb-2">
            Contact Information
          </h2>
          <div className="flex gap-6 text-black">
            <a
              href={`mailto:${cvData.contact.email}`}
              className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
              title={`Email: ${cvData.contact.email}`}
            >
              <FaEnvelope className="w-5 h-5" />
              <span>{cvData.contact.email}</span>
            </a>
            <a
              href={cvData.contact.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
              title={`LinkedIn: ${cvData.contact.linkedin}`}
            >
              <FaLinkedin className="w-5 h-5" />
              <span>{cvData.contact.linkedin}</span>
            </a>
            <a
              href={`https://github.com/${cvData.contact.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
              title={`GitHub: ${cvData.contact.github}`}
            >
              <FaGithub className="w-5 h-5" />
              <span>{cvData.contact.github}</span>
            </a>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b border-gray-200 pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-relaxed">{cvData.summary}</p>
        </section>

        {/* Experience */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b border-gray-200 pb-2">
            Work Experience
          </h2>

          <div className="space-y-8">
            {cvData.experience.map((job, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <h3 className="text-xl font-bold text-black">
                    {job.company}
                  </h3>
                  <span className="text-gray-600 font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                </div>
                {job.positions &&
                  job.positions.map((position, index) => (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 ml-2">
                      <span className="font-bold">{position.title}</span>
                      <span className="text-gray-600 font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {position.period}
                      </span>
                    </div>
                  ))}
                <ul className="list-disc list-inside text-gray-800 space-y-2 ml-2">
                  {job.responsibilities.map((responsibility, idx) => (
                    <li key={idx}>{responsibility}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="font-bold">Tech: </span>
                  {job.skills &&
                    job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b border-gray-200 pb-2">
            Open Source Contributions
          </h2>

          <div className="space-y-8">
            {cvData.openSourceContributions.map((os, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <h3 className="text-xl font-bold text-black">{os.company}</h3>
                  <span className="text-gray-600 font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {os.location}
                  </span>
                </div>
                {os.positions &&
                  os.positions.map((position, index) => (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 ml-2">
                      <span className="font-bold">{position.title}</span>
                      <span className="text-gray-600 font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {position.period}
                      </span>
                    </div>
                  ))}
                <ul className="list-disc list-inside text-gray-800 space-y-2 ml-2">
                  {os.responsibilities.map((responsibility, idx) => (
                    <li key={idx}>{responsibility}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="font-bold">Tech: </span>
                  {os.skills &&
                    os.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 border-b border-gray-200 pb-2">
            Public Talks
          </h2>

          {cvData.talks.map((talk, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-6 mb-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                <h3 className="text-xl font-bold text-black">{talk.venue}</h3>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-gray-600 font-medium">
                    {talk.location}
                  </span>
                </span>
              </div>
              {talk.sessions.map((session, index) => (
                <div className="ml-3">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 mt-3">
                    <div className="flex items-center">
                      <p className="text-gray-700 font-medium">
                        {session.name}
                      </p>
                      {session.type && (
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium ml-1">
                          {session.type}
                        </span>
                      )}
                    </div>
                    {/* we want to render the date only for the first talk, and I'm too lazy to come up with a smarter solution. */}
                    {index == 0 && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-gray-600 font-medium">
                          {talk.date}
                        </span>
                      </span>
                    )}
                  </div>
                  {session.with && <div>With {session.with}</div>}
                  <div
                    className="text-gray-800 mb-3 mt-3"
                    dangerouslySetInnerHTML={{ __html: session.summary }}
                  />
                  <div className="flex gap-3 mt-2">
                    {session.links && (
                      <>
                        {session.links.youtube && (
                          <a
                            href={session.links.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaYoutube className="w-10 h-10 hover:text-gray-600 text-black cursor-pointer" />
                          </a>
                        )}
                        {session.links.github && (
                          <a
                            href={session.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaGithub className="w-10 h-10 hover:text-gray-600 text-black cursor-pointer" />
                          </a>
                        )}
                        {session.links.slides && (
                          <a
                            href={session.links.slides}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaSlideshare className="w-10 h-10 hover:text-gray-600 text-black cursor-pointer" />
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default CV;
