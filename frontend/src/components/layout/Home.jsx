import React from 'react'
import { Airplay, Book, Calendar, Lock, Sparkles } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import {Card,CardContent} from "@/components/ui/card"
import { LibraryBig } from 'lucide-react';
import { FileText, BarChart2 } from 'lucide-react';
import DailyPrompt from "@/components/layout/DailyPrompt";


const Home = () => {
  const features = [
  {
    icon: Book,
    title: "Digital Journal Entries",
    description:
      "Express yourself with a powerful editor supporting markdown, formatting, and more.",
  },
  {
    icon: Sparkles,
    title: "Daily Inspiration",
    description:
      "Get inspired with daily prompts and mood-based imagery to spark your creativity.",
  },
  {
    icon: Airplay,
    title: "AI Reflection",
    description:
      "Write freely, see your thoughts mirrored by AI, and gain insights you might have missed.",
  },
    {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your thoughts are safe with enterprise-grade security and privacy features.",
  },
];
  return (
  <div className='relative container mx-auto px-4 pt-16 pb-16'>
  <div className='max w-6xl mx-auto text-center space-y-8'>
    <h1 className='text-5xl md:text-7xl lg:text-8xl mb-6 gradient-title'>Step into your mind. <span className='block whitespace-nowrap'>Leave your thoughts here.</span></h1>
    <p className='text-lg md:text-xl text-orange-800 dark:text-[#f0dfce] mb-8'>
      Capture your journey, let AI reflect your patterns, and uncover the story inside you.
    </p>
    <div className='relative'>
      <div className='absolute inset-0 bg-gradient-to-t from-orange-50 via-transparent to-transparent pointer-events-none z-10 dark:from-[#261b18] dark:via-transparent dark:to-transparent'/>
      <div className='bg-white dark:bg-[#1d1411] rounded-2xl p-4 max-full mx-auto'>
        <div className='border-b border-orange-100 dark:border-[#4b3329] pb-4 mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Calendar className='h-5 w-5 text-orange-600 dark:text-[#e0b38f]'/>
            <span className='text-orange-900 dark:text-[#f3e5d6] font-medium'>
                Today's entry
            </span>
          </div>
          <div className='flex gap-2'>
            <div className='h-3 w-3 rounded-full bg-orange-200 dark:bg-[#3a2820]'/>
            <div className='h-3 w-3 rounded-full bg-orange-300 dark:bg-[#4b3329]'/>
            <div className='h-3 w-3 rounded-full bg-orange-400 dark:bg-[#c9764d]'/>
          </div>
        </div>

        <div className='space-y-4 p-4'>
          <h3 className='text-xl font-semibold text-orange-900 dark:text-[#efad82]'><DailyPrompt /></h3>
          <div className="h-4 bg-orange-100 dark:bg-[#3a2820] rounded w-3/4"/>
          <div className="h-4 bg-orange-100 dark:bg-[#3a2820] rounded w-full"/>
          <div className="h-4 bg-orange-100 dark:bg-[#3a2820] rounded w-2/3"/>
        </div>
      </div>
    </div>

    <div className='flex justify-center gap-4'>
      <Link to="/newEntry">
        <Button variant="journal" className="px-8 py-6 rounded-full items-center gap-2 dark:text-[#f3e5d6]">
          Log Journal Entries
          <LibraryBig className='h-2 w-2'/>
        </Button>
      </Link>
      <Link to="/archives">
        <Button variant="outline" className="px-14 py-6 rounded-full border-orange-600 text-orange-600 hover:bg-orange-100 dark:border-[#c9764d] dark:text-[#e0b38f] dark:hover:bg-[#2a1d19]">
          Archives
        </Button>
      </Link>
    </div>
  </div>
  <section id='features' className='mt-24 grid md:grid-cols-3 lg:grid-cols-4 gap-8'>
    {features.map((feature)=>(
      <Card key={feature.title} className='shadow-lg dark:bg-[#1d1411] dark:border-[#4b3329]'>
        <CardContent className='p-3'>
          <div className='h-10 w-10 bg-orange-100 dark:bg-[#2a1d19] rounded-full flex items-center justify-center mb-4'>
            <feature.icon className='h-6 w-6 text-orange-600 dark:text-[#e0b38f]'/>
          </div>
          <h3 className='font-semibold text-xl text-orange-900 dark:text-[#f3e5d6] mb-1'>{feature.title}</h3>
          <p className='text-orange-700 dark:text-[#dcc8b8]'>{feature.description}</p>
        </CardContent>
      </Card>
    ))}
  </section>
  <div className='space-y-24 mt-24'>
    <div className='grid md:grid-cols-2 gap-12'>
      <div className='space-y-6'>
        <div className='h-12 w-12 bg-orange-200 dark:bg-[#4b3329] rounded-full flex items-center justify-center'>
          <FileText className='h-6 w-6 text-orange-600 dark:text-[#e0b38f]' />
        </div>
        <h3 className='text-2xl font-bold text-orange-900 dark:text-[#f3e5d6]'>Rich Journal Editor</h3>
        <p className='text-lg text-orange-700 dark:text-[#dcc8b8]'>Express yourself fully with our powerful editor featuring:</p>
        <ul className='space-y-3'>
          <li className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-orange-400 dark:bg-[#c9764d]'/>
            <span className='dark:text-[#dcc8b8]'>Write your thoughts or record quick voice notes with ease.</span>
          </li>
          <li className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-orange-400 dark:bg-[#c9764d]'/>
            <span className='dark:text-[#dcc8b8]'>Add photos, videos, or files to enrich your daily entries.</span>
          </li>
        </ul>
      </div>
      <div className='space-y-4 bg-white dark:bg-[#1d1411] rounded-2xl shadow-xl p-6 border border-orange-100 dark:border-[#4b3329]'>
        <div className='flex gap-2 mb-6'>
          <div className='h-3 w-3 rounded bg-orange-200 dark:bg-[#3a2820]'/>
          <div className='h-3 w-3 rounded bg-orange-300 dark:bg-[#4b3329]'/>
          <div className='h-3 w-3 rounded bg-orange-400 dark:bg-[#c9764d]'/>
        </div>
        <div className='h-4 bg-orange-50 dark:bg-[#3a2820] rounded w-3/4' />
        <div className='h-4 bg-orange-50 dark:bg-[#3a2820] rounded w-full' />
        <div className='h-4 bg-orange-50 dark:bg-[#3a2820] rounded w-2/3' />
        <div className='h-4 bg-orange-50 dark:bg-[#3a2820] rounded w-1/3' />
      </div>
    </div>
    <div className='grid md:grid-cols-2 gap-12'>
      <div className='space-y-4 bg-white dark:bg-[#1d1411] rounded-2xl shadow-xl p-6 border border-orange-100 dark:border-[#4b3329]'>
        <div className='h-40 bg-gradient-to-t from-orange-100 to-orange-50 dark:from-[#2e1f1a] dark:to-[#1d1411] rounded-lg'></div>
        <div className='flex justify-between'>
            <div className='h-4 w-16 bg-orange-100 dark:bg-[#3a2820] rounded' />
            <div className='h-4 w-16 bg-orange-100 dark:bg-[#3a2820] rounded' />
            <div className='h-4 w-16 bg-orange-100 dark:bg-[#3a2820] rounded' />
        </div>
      </div>
      <div className='space-y-6'>
        <div className='h-12 w-12 bg-orange-200 dark:bg-[#4b3329] rounded-full flex items-center justify-center'>
          <BarChart2 className='h-6 w-6 text-orange-600 dark:text-[#e0b38f]' />
        </div>
        <h3 className='text-2xl font-bold text-orange-900 dark:text-[#f3e5d6]'>Mood Analytics</h3>
        <p className='text-lg text-orange-700 dark:text-[#dcc8b8]'>Track your emotional journey with powerful analytics:</p>
        <ul className='space-y-3'>
          <li className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-orange-400 dark:bg-[#c9764d]'/>
            <span className='dark:text-[#dcc8b8]'>Visual mood trends</span>
          </li>
          <li className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-orange-400 dark:bg-[#c9764d]'/>
            <span className='dark:text-[#dcc8b8]'>Pattern recognition.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

  )
}

export default Home
