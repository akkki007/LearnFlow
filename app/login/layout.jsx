import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
                <Toaster richColors position="top-center" />
            </body>
        </html>
    );
}
