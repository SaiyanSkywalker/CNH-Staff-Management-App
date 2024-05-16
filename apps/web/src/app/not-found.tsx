"use client";
import Link from "next/link";
const Page = () => {
  return (
    <>
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8">Not Found</h1>
        <Link className="font-semibold hover:text-cyan-600" href="/">
          Go to home page
        </Link>
      </div>
    </>
  );
};

export default Page;
