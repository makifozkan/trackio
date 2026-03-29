import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';


export default function Page() {
  return (<div>
    <header className="bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <a className="block text-teal-600" href="#">
          <span className="sr-only">Home</span>
          <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35.7131 12.2464C35.3583 12.1898 35.3998 11.6667 35.759 11.6667H57.6041C58.0068 11.6667 58.3333 11.9932 58.3333 12.3959V34.241C58.3333 34.6002 57.8103 34.6418 57.7536 34.287L54.8851 16.3251C54.7856 15.7025 54.2975 15.2144 53.6749 15.115L35.7131 12.2464Z" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" />
            <path d="M9.46304 38.4964C9.10829 38.4397 9.14979 37.9167 9.50904 37.9167H31.3541C31.7567 37.9167 32.0832 38.2433 32.0832 38.6459V60.491C32.0832 60.8502 31.5603 60.8918 31.5036 60.537L28.635 42.5751C28.5356 41.9525 28.0475 41.4644 27.4249 41.365L9.46304 38.4964Z" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" />
            <path d="M22.5881 25.3714C22.2333 25.3147 22.2748 24.7917 22.634 24.7917H44.4791C44.8818 24.7917 45.2083 25.1183 45.2083 25.5209V47.366C45.2083 47.7252 44.6853 47.7668 44.6286 47.412L41.9267 30.4935C41.7278 29.2486 40.7515 28.2722 39.5065 28.0733L22.5881 25.3714Z" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>

        </a>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> About </a>
              </li>

              <li>
                <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Services </a>
              </li>

              <li>
                <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Projects </a>
              </li>

              <li>
                <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Blog </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link className="block bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700" href="/login">
                Login
              </Link>

              <a className="hidden bg-gray-100 px-5 py-2.5 text-sm font-medium text-blue-600 transition hover:text-blue-600/75 sm:block" href="#">
                Register
              </a>
            </div>

            <button className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
              <span className="sr-only">Toggle menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
    <section className="bg-white lg:grid lg:h-screen lg:place-content-center">
      <div className="mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="max-w-prose text-left">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Understand user flow and
            <strong className="text-blue-600"> increase </strong>
            conversions
          </h1>

          <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, nisi. Natus, provident
            accusamus impedit minima harum corporis iusto.
          </p>

          <div className="mt-4 flex gap-4 sm:mt-6">
            <a className="inline-block rounded border border-blue-600 bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-blue-700" href="#">
              Get Started
            </a>

            <a className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900" href="#">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
    <div className='mx-auto max-w-7xl p-6 pb-12'>
      <div className="space-y-4">
        <details className="group [&amp;_summary::-webkit-details-marker]:hidden" open={false}>
          <summary className="flex items-center justify-between gap-1.5 border border-gray-100 bg-gray-50 p-4 text-gray-900">
            <h2 className="text-lg font-medium">Lorem ipsum dolor sit amet consectetur adipisicing?</h2>

            <svg className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </summary>

          <p className="px-4 pt-4 text-gray-900">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa
            in, recusandae laboriosam neque aliquid libero nesciunt voluptate dicta quo officiis
            explicabo consequuntur distinctio corporis earum similique!
          </p>
        </details>

        <details className="group [&amp;_summary::-webkit-details-marker]:hidden">
          <summary className="flex items-center justify-between gap-1.5 border border-gray-100 bg-gray-50 p-4 text-gray-900">
            <h2 className="text-lg font-medium">Lorem ipsum dolor sit amet consectetur adipisicing?</h2>

            <svg className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </summary>

          <p className="px-4 pt-4 text-gray-900">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa
            in, recusandae laboriosam neque aliquid libero nesciunt voluptate dicta quo officiis
            explicabo consequuntur distinctio corporis earum similique!
          </p>
        </details>

        <details className="group [&amp;_summary::-webkit-details-marker]:hidden">
          <summary className="flex items-center justify-between gap-1.5 border border-gray-100 bg-gray-50 p-4 text-gray-900">
            <h2 className="text-lg font-medium">Lorem ipsum dolor sit amet consectetur adipisicing?</h2>

            <svg className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </summary>

          <p className="px-4 pt-4 text-gray-900">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic veritatis molestias culpa
            in, recusandae laboriosam neque aliquid libero nesciunt voluptate dicta quo officiis
            explicabo consequuntur distinctio corporis earum similique!
          </p>
        </details>
      </div>
    </div>

    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="text-teal-600">
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35.7131 12.2464C35.3583 12.1898 35.3998 11.6667 35.759 11.6667H57.6041C58.0068 11.6667 58.3333 11.9932 58.3333 12.3959V34.241C58.3333 34.6002 57.8103 34.6418 57.7536 34.287L54.8851 16.3251C54.7856 15.7025 54.2975 15.2144 53.6749 15.115L35.7131 12.2464Z" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <path d="M9.46304 38.4964C9.10829 38.4397 9.14979 37.9167 9.50904 37.9167H31.3541C31.7567 37.9167 32.0832 38.2433 32.0832 38.6459V60.491C32.0832 60.8502 31.5603 60.8918 31.5036 60.537L28.635 42.5751C28.5356 41.9525 28.0475 41.4644 27.4249 41.365L9.46304 38.4964Z" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <path d="M22.5881 25.3714C22.2333 25.3147 22.2748 24.7917 22.634 24.7917H44.4791C44.8818 24.7917 45.2083 25.1183 45.2083 25.5209V47.366C45.2083 47.7252 44.6853 47.7668 44.6286 47.412L41.9267 30.4935C41.7278 29.2486 40.7515 28.2722 39.5065 28.0733L22.5881 25.3714Z" fill="black" stroke="black" strokeWidth="2" strokeLinecap="round" />
            </svg>

          </div>

          <div className="mt-8 grid grid-cols-2 gap-8 lg:mt-0 lg:grid-cols-5 lg:gap-y-16">
            <div className="col-span-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Get the latest news!</h2>

                <p className="mt-4 text-gray-500">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse non cupiditate quae
                  nam molestias.
                </p>
              </div>
            </div>

            <div className="col-span-2 lg:col-span-3 lg:flex lg:items-end">
              <form className="w-full">
                <label htmlFor="UserEmail" className="sr-only"> Email </label>

                <div className="border border-gray-100 p-2 focus-within:ring-3 sm:flex sm:items-center sm:gap-4">
                  <input type="email" id="UserEmail" placeholder="john@rhcp.com" className="w-full border-none focus:border-transparent focus:ring-transparent sm:text-sm" />

                  <button className="mt-1 w-full bg-blue-500 px-6 py-3 text-sm font-bold tracking-wide text-white uppercase transition-none hover:bg-blue-600 sm:mt-0 sm:w-auto sm:shrink-0">
                    Sign Up
                  </button>
                </div>
              </form>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-medium text-gray-900">Services</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> 1on1 Coaching </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Company Review </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75">
                    Accounts Review
                  </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> HR Consulting </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75">
                    SEO Optimisation
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-medium text-gray-900">Company</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> About </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Meet the Team </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75">
                    Accounts Review
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-medium text-gray-900">Helpful Links</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Contact </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> FAQs </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Live Chat </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-medium text-gray-900">Legal</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Accessibility </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Returns Policy </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75"> Refund Policy </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75">
                    Hiring-3 Statistics
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="font-medium text-gray-900">Downloads</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75">
                    Marketing Calendar
                  </a>
                </li>

                <li>
                  <a href="#" className="text-gray-700 transition hover:opacity-75">
                    SEO Infographics
                  </a>
                </li>
              </ul>
            </div>

            <ul className="col-span-2 flex justify-start gap-6 lg:col-span-5 lg:justify-end">
              <li>
                <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75">
                  <span className="sr-only">Facebook</span>

                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </li>

              <li>
                <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75">
                  <span className="sr-only">Instagram</span>

                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </li>

              <li>
                <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75">
                  <span className="sr-only">Twitter</span>

                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </li>

              <li>
                <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75">
                  <span className="sr-only">GitHub</span>

                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </li>

              <li>
                <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75">
                  <span className="sr-only">Dribbble</span>

                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-8">
          <div className="sm:flex sm:justify-between">
            <p className="text-xs text-gray-500">© 2022. Company Name. All rights reserved.</p>

            <ul className="mt-8 flex flex-wrap justify-start gap-4 text-xs sm:mt-0 lg:justify-end">
              <li>
                <a href="#" className="text-gray-500 transition hover:opacity-75">
                  Terms &amp; Conditions
                </a>
              </li>

              <li>
                <a href="#" className="text-gray-500 transition hover:opacity-75"> Privacy Policy </a>
              </li>

              <li>
                <a href="#" className="text-gray-500 transition hover:opacity-75"> Cookies </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>

  );
}
