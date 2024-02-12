import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <h2 className="text-3xl font-bold tracking-tight">Welcome</h2>
      <p>
        If you haven&apos;t yet, add a project and environment to save your API keys. These are stored in local storage and won&apos;t leave your browser.
      </p>
      <p>
        Then head over to the <Link href={"/item"}>Item Query</Link> page to start browsing.
      </p>
    </div>
  );
}
