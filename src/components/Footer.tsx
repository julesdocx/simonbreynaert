export default function Footer() {
  return (
    <footer className="py-6 text-xs text-muted-foreground border-t border-gray-200">
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