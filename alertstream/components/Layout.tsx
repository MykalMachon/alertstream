import type { FC } from "hono/jsx";

const Layout: FC = (props) => {
  return (
    <html>
      <head>
        <title>{props.title || 'AppStream'}</title>
      </head>
      <body>{props.children}</body>
    </html>
  )
}

export default Layout;