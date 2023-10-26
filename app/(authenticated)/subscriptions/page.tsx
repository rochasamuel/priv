"use client"
import { useSession } from "next-auth/react"

export default function Subscriptions() {
  const { data: session, status } = useSession()
  return (
    <>
      Subscriptions
      {session && (<pre>{JSON.stringify(session)}</pre>)}
    </>
  )
}
