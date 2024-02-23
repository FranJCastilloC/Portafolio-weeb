

import { ToastContainer } from 'react-toastify'
import '../public/main.scss'




export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Slab:wght@300;400;500;600;700;800;900&display=swap"/>

      </head>
      <body className='' >
        <ToastContainer
          position='top-right'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover

        />
          {children}
        
        
        </body>
    </html>
  )
}
