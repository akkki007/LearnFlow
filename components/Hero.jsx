function Hero() {
  return (
    <div className="xl:flex my-10 xl:flex-row flex flex-col">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        ></div>
        <div className="mx-auto -my-20 max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full poppins-regular  px-3 py-1 text-md/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Announcing our next round of funding.{" "}
              <a href="#" className="poppins-semibold text-green-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-balance text-5xl poppins-semibold tracking-tight text-gray-900 sm:text-6xl">
              Creating a learner community.
            </h1>
            <p className="mt-8 text-pretty text-lg poppins-medium text-gray-500 sm:text-xl/8">
              Our platform bridges dedicated learners with expert educators,
              creating a space where ideas thrive, skills develop, and
              innovation flourishes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm poppins-semibold text-white shadow-sm hover:scale-110 transition-all hover:transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a href="#" className="text-sm/6 poppins-semibold text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        ></div>
      </div>
      <div className="w-[80%] -mt-5 mx-auto xl:w-[40vw] xl:mt-[15vw]">
        <video
          src="/bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto rounded-xl"
        ></video>
      </div>
    </div>
  );
}

export default Hero;
