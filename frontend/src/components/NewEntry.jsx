import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import {journalSchema} from '../lib/schema'
import { Link } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import { useForm } from 'react-hook-form'
import { Suspense } from 'react';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOODS } from '@/lib/moods';
import { Controller } from 'react-hook-form';

const NewEntry = () => {
  const {register, handleSubmit,control, formState:{errors}} = useForm({
    resolver:zodResolver(journalSchema),
    defaultValues:{
      title:"",
      content:"",
      mood:"",
    },
  })
  const isLoading = false;
  return (
    <div className='mx-50'>
      <div className='container py-4'>
        <Link to="/dashboard" className="text-md text-orange-600 hover:text-orange-700 cursor-pointer">
         ← Back to Dashboard
        </Link>
      </div>

      <form className='space-y-2 mx-auto'>
        <h1 className='text-5xl md:text-6xl gradient-title'>What's on your mind?</h1>
        {isLoading && <BarLoader color='orange' width={"100%"}/>}

        <div className='space-y-2'>
          <label className='text-medium font-medium'>Title:</label>
          <Input {...register("title")}
          placeholder="Give your entry a title..."
          className={`px-5 md:text-md ${errors.title? "border-red-500" : ""}`}/>
          {errors.title && (
            <p className='text-red-500 text-sm'>{errors.title.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='text-medium font-medium'>How are you feeling?</label>
          <Controller
          name='mood'
          control={control}
           render={({field})=>{
            return (
          <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className={errors.mood? "border-red-500" : ""}>
          <SelectValue placeholder="Select a mood..." />
          </SelectTrigger>
          <SelectContent>
            {Object.values(MOODS).map((mood)=>{
              return ( 
              <SelectItem  key={mood.id} value={mood.id}>
                <span className='flex items-center gap-2'>
                  {mood.emoji} {mood.label}
                </span>
              </SelectItem>
              );
            })}
          </SelectContent>
          </Select>
            )
           }}
          />
          {errors.mood && (
            <p className='text-red-500 text-sm'>{errors.mood.message}</p>
          )}
        </div>

      </form>
    </div>
  )
}

export default NewEntry
