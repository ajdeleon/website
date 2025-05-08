import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        AJ de Leon
      </h1>
      <p className="mb-4">
        {`I'm a full stack Javascript developer with a passion for creating efficient and scalable applications. I specialize in building web applications using React, Next.js, and Node.js, and I'm always looking for problems to solve elegantly with those tools.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
