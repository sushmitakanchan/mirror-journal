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
    <p className='text-lg md:text-xl text-orange-800 dark:text-yellow-200 mb-8'>
      Capture your journey, let AI reflect your patterns, and uncover the story inside you.
    </p>
    <div className='relative'>
      <div className='absolute inset-0 bg-gradient-to-t from-orange-50 via-transparent to-transparent pointer-events-none z-10 dark:from-neutral-700 dark:via-transparent dark:to-transparent'/>
      <div className='bg-white dark:bg-zinc-900 rounded-2xl p-4 max-full mx-auto'>
        <div className='border-b border-orange-100 dark:border-zinc-800 pb-4 mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Calendar className='h-5 w-5 text-orange-600 dark:text-amber-300'/>
            <span className='text-orange-900 dark:text-amber-100 font-medium'>
                Today's entry
            </span>
          </div>
          <div className='flex gap-2'>
            <div className='h-3 w-3 rounded-full bg-orange-200 dark:bg-yellow-200'/>
            <div className='h-3 w-3 rounded-full bg-orange-300 dark:bg-yellow-300'/>
            <div className='h-3 w-3 rounded-full bg-orange-400 dark:bg-yellow-400'/>
          </div>
        </div>

        <div className='space-y-4 p-4'>
          <h3 className='text-xl font-semibold text-orange-900 dark:text-yellow-600'><DailyPrompt /></h3>
          <div className="h-4 bg-orange-100 dark:bg-zinc-800 rounded w-3/4"/>
          <div className="h-4 bg-orange-100 dark:bg-zinc-800 rounded w-full"/>
          <div className="h-4 bg-orange-100 dark:bg-zinc-800 rounded w-2/3"/>
        </div>
      </div>
    </div>

    <div className='flex justify-center gap-4'>
      <Link to="/newEntry">
        <Button variant="journal" className="px-8 py-6 rounded-full items-center gap-2 dark:text-yellow-100">
          Log Journal Entries
          <LibraryBig className='h-2 w-2'/>
        </Button>
      </Link>
      <Link to="/archives">
        <Button variant="outline" className="px-14 py-6 rounded-full border-orange-600 text-orange-600 hover:bg-orange-100 dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-zinc-800">
          Archives
        </Button>
      </Link>
    </div>
  </div>
  <section id='features' className='mt-24 grid md:grid-cols-3 lg:grid-cols-4 gap-8'>
    {features.map((feature)=>(
      <Card key={feature.title} className='shadow-lg dark:bg-zinc-900'>
        <CardContent className='p-3'>
          <div className='h-10 w-10 bg-orange-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4'>
            <feature.icon className='h-6 w-6 text-orange-600 dark:text-yellow-300'/>
          </div>
          <h3 className='font-semibold text-xl text-orange-900 dark:text-yellow-200 mb-1'>{feature.title}</h3>
          <p className='text-orange-700 dark:text-white'>{feature.description}</p>
        </CardContent>
      </Card>
    ))}
  </section>
  <div className='space-y-24 mt-24'>
    <div className='grid md:grid-cols-2 gap-12'>
      <div className='space-y-6'>
        <div className='h-12 w-12 bg-orange-200 dark:bg-yellow-800 rounded-full flex items-center justify-center'>
          <FileText className='h-6 w-6 text-orange-600 dark:text-yellow-200' />
        </div>
        <h3 className='text-2xl font-bold text-orange-900 dark:text-yellow-100'>Rich Journal Editor</h3>
        <p className='text-lg text-orange-700 dark:text-yellow-200'>Express yourself fully with our powerful editor featuring:</p>
        <ul className='space-y-3'>
          <li className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-orange-400 dark:bg-yellow-500'/>
            <span>Write your thoughts or record quick voice notes with ease.</span>
          </li>
          <li className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-orange-400 dark:bg-yellow-500'/>
            <span>Add photos, videos, or files to enrich your daily entries.</span>
          </li>
        </ul>
      </div>
      <div className='space-y-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-orange-100 dark:border-zinc-800'>
        <div className='flex gap-2 mb-6'>
          <div className='h-3 w-3 rounded bg-orange-200 dark:bg-zinc-700'/>
          <div className='h-3 w-3 rounded bg-orange-300 dark:bg-zinc-600'/>
          <div className='h-3 w-3 rounded bg-orange-400 dark:bg-yellow-600'/>
        </div>
        <div className='h-4 bg-orange-50 dark:bg-zinc-800 rounded w-3/4' />
        <div className='h-4 bg-orange-50 dark:bg-zinc-800 rounded w-full' />
        <div className='h-4 bg-orange-50 dark:bg-zinc-800 rounded w-2/3' />
        <div className='h-4 bg-orange-50 dark:bg-zinc-800 rounded w-1/3' />
      </div>
    </div>
    <div className='grid md:grid-cols-2 gap-12'>
      <div className='space-y-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 border border-orange-100 dark:border-zinc-800'>
        <div className='h-40 bg-gradient-to-t from-orange-100 to-orange-50 dark:from-zinc-800 dark:to-zinc-900 rounded-lg'></div>
        <div className='flex justify-between'>
            <div className='h-4 w-16 bg-orange-100 dark:bg-zinc-800 rounded' />
            <div className='h-4 w-16 bg-orange-100 dark:bg-zinc-800 rounded' />
            <div className='h-4 w-16 bg-orange-100 dark:bg-zinc-800 rounded' />
        </div>
      </div>
      <div className='space-y-6'>
        <div className='h-12 w-12 bg-orange-200 dark:bg-yellow-800 rounded-full flex items-center justify-center'>
          <BarChart2 className='h-6 w-6 text-orange-600 dark:text-yellow-200' />
        </div>
        <h3 className='text-2xl font-bold text-orange-900 dark:text-yellow-100'>Mood Analytics</h3>
        <p className='text-lg text-orange-700 dark:text-yellow-200'>Track your emotional journey with powerful analytics:</p>
        <ul className='space-y-3'>
          <li className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-orange-400 dark:bg-yellow-500'/>
            <span>Visual mood trends</span>
          </li>
          <li className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-orange-400 dark:bg-yellow-500'/>
            <span>Pattern recognition.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

  )
}

export default Home
