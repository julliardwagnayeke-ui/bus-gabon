export default function PageLayout({ children, className = '', maxWidth = 'max-w-6xl' }) {
  return (
    <main className={`${maxWidth} mx-auto px-4 py-8 ${className}`}>
      {children}
    </main>
  );
}
