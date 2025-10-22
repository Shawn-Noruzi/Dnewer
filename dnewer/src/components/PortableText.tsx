'use client'
import { PortableText, PortableTextComponents } from '@portabletext/react'

const components: PortableTextComponents = {
  block: {
    h1: ({children}) => <h1 className="text-3xl font-bold my-4">{children}</h1>,
    h2: ({children}) => <h2 className="text-2xl font-semibold my-3">{children}</h2>,
    normal: ({children}) => <p className="my-3">{children}</p>,
  },
  marks: {
    link: ({children, value}) => <a href={value?.href} rel="noopener" className="underline">{children}</a>
  }
}

export default function PT({ value }: { value: any }) {
  return <PortableText value={value} components={components} />
}
