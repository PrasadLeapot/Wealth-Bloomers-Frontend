import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link href="/" className="logo">
        <Image
          src="/logo.png"
          alt="Wealth Bloomers Logo"
          width={180}
          height={60}
          className="logo-img"
          priority
        />
      </Link>

      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/faq">FAQ</Link>
      </nav>
    </header>
  );
}