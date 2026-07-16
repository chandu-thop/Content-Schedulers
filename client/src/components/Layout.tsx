
import { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { MenuIcon } from 'lucide-react';


   const pageTitles:Record<string,string>={
        '/dashboard': 'Dashboard',
        '/account': ' Social Account',
        '/scheduler': 'Post Scheduler',
        '/aicomposer': 'AI Composer'
        
    }

export default function Layout() {

    const loction=useLocation();

    const title=pageTitles[loction.pathname] || 'SocialAI';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 
    return (
        <div className='flex h-screen bg-slate-50'>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

            <div className='flex-1 flex flex-col overflow-hidden'>
                <header className='h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-8 gap-4'>
                    <button className='md:hidden p-2-ml-2 text-slate-500' onClick={()=> setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <MenuIcon/>
                    </button>
                    <div>
                        <h1 className='text-lg font-semibold text-slate-900'>{title}</h1>
                        <p className='text-sm text-slate-400 hidden sm:block'>Manage and automate your social presence</p>
                    </div>

                </header>
                <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-12">
                  <Outlet />
                </main>
            </div>




        </div>
    )
}

