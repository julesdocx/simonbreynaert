export default function Footer() {
  return (
    <footer className="py-6 px-4 text-center text-xs text-muted-foreground">
      <p>© Simon Breynaert, 2025.</p>
      <p>All rights reserved.</p>
      <p className="mt-2">
        Designed &amp; developed with ❤️ by{' '}
        <a 
          href="https://julesdocx.be" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors underline"
        >
          Jules Docx
        </a>
        .
      </p>
    </footer>
  )
}