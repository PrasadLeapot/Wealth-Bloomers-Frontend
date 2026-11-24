import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <h2>Wealth Bloomers</h2>
        <p>
          Learn commodity markets through an
          interactive prediction experience.
        </p>
      </div>

      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/about">About Us</Link>
        <Link href="/faq">FAQ</Link>
      </div>

      <p>
        © {new Date().getFullYear()} Wealth Bloomers.
        All rights reserved.
      </p>
    </footer>
  );
}
