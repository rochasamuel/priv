import { BellIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="shrink-0 border-b">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <img
          className="h-8 w-auto"
          src="https://privatus.vip/assets/img/splash/logo.png"
          alt="Your Company"
        />
        <div className="flex items-center gap-x-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-300">
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your profile</span>
          </a>
        </div>
      </div>
    </header>
  )
}