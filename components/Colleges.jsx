import Image from "next/image";

export default function Colleges() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-2xl poppins-semibold text-gray-900">
          Trusted by Pune&apos;s top colleges
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <Image
            alt="GPP College"
            src="/gpp.png"
            width={158}
            height={48}
            className="col-span-2 max-h-20 w-full object-contain lg:col-span-1"
          />
          <Image
            alt="PICT College"
            src="/pict.jpg"
            width={158}
            height={48}
            className="col-span-2 max-h-24 w-full object-contain lg:col-span-1"
          />
          {/* <Image
            alt="PCCOE College"
            src="http://www.pccoepune.com/images/pccoe-logo-new.webp"
            width={158}
            height={48}
            className="col-span-2 max-h-24 w-full object-contain lg:col-span-1"
          /> */}
        </div>
      </div>
    </div>
  );
}
