import { BlogPosts } from 'app/components/posts'

const bio1 = `I'm a full stack Javascript developer with a passion for creating efficient and scalable applications.`
const bio2 = `I specialize in building web applications using React, Next.js, and Node.js, and I'm always looking for problems to solve elegantly with those tools.\nI like collaborating to take ideas from inception through to completion.`
const bio3 = `In my free time I like to indulge in creative endeavours like playing guitar, songwriting, improv comedy, and dabbling in electrical engineering by creating custom led lights and guitar pedals/amps.`

const bio = [bio1, bio2, bio3]

export default function Page() {
  return (
    <section>
      <h1 className='mb-8 text-2xl font-semibold tracking-tighter'>
        AJ de Leon
      </h1>
      {bio.map((b) => (
        <p className='mb-4'>{b}</p>
      ))}
      <div className='my-8'>
        <BlogPosts />
      </div>
    </section>
  )
}
