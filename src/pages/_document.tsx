import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Fonts */}
        <link rel="stylesheet" href="https://use.typekit.net/nrs2vdl.css" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        
        {/* SEO */}
        <meta name="description" content="Belgian visual artist and spatial designer working across photography, video, scenography and digital research. Based in Brussels." />
        <meta name="author" content="Simon Breynaert" />
        <meta name="keywords" content="photography, visual artist, spatial designer, architecture, Brussels, Belgium" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Simon Breynaert" />
        <meta property="og:title" content="Simon Breynaert | Visual Artist & Spatial Designer" />
        <meta property="og:description" content="Belgian visual artist and spatial designer working across photography, video, scenography and digital research. Based in Brussels." />
        <meta property="og:image" content="https://simonbreynaert.com/og-image.jpg" />
        <meta property="og:url" content="https://simonbreynaert.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Simon Breynaert | Visual Artist & Spatial Designer" />
        <meta name="twitter:description" content="Belgian visual artist and spatial designer working across photography, video, scenography and digital research. Based in Brussels." />
        <meta name="twitter:image" content="https://simonbreynaert.com/og-image.jpg" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#ffffff" />
        <title>Simon Breynaert | Visual Artist & Spatial Designer</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}