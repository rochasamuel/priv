"use client"
import { useSession } from "next-auth/react"

export default function Subscriptions() {
  const { data: session, status } = useSession()
  console.log(session);
  return (
    <>
      Subscriptions
      {session && (<pre className="whitespace-normal">{JSON.stringify(session.user)}</pre>)}
    </>
  )
}
