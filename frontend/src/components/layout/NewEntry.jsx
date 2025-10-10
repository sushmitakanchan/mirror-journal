"use client"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalSchema } from "../../lib/schema";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOODS } from "@/lib/moods";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/clerk-react";
import { createEntryApi } from "@/lib/createEntryApi";


const { getToken } = useAuth();
const NewEntry = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
    },
  });

  const isLoading = false;

  // watch mood -> compute moodPrompt
  const selectedMoodId = watch("mood");
  const moodPrompt = selectedMoodId ? MOODS[selectedMoodId]?.prompt ?? "" : "";

  const onSubmit = async (data) => {
    // setIsLoading(true);
    try{
      const payload = {
        title: data.title,
        mood: data.mood,
        content: data.content,
        imageUrl: null
      };
      const created = await createEntryApi(payload, getToken);
      console.log("Entry created", created);
      
    }
    catch(error){
      console.log(error);
    }
  };

  return (
    <div className="mx-50">
      <div className="container py-4">
        <Link to="/dashboard" className="text-md text-orange-600 hover:text-orange-700 cursor-pointer">
          ← Back to Dashboard
        </Link>
      </div>

      <form className="space-y-2 mx-auto text-black" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-5xl md:text-6xl gradient-title">What's on your mind?</h1>
        {isLoading && <BarLoader color="orange" width={"100%"} />}

        <div className="space-y-2">
          <label className="text-medium font-medium">Title:</label>
          <Input
            {...register("title")}
            placeholder="Give your entry a title..."
            className={`px-5 md:text-md ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-medium font-medium">How are you feeling?</label>

          <Controller
            name="mood"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.mood ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a mood..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MOODS).map((mood) => (
                      <SelectItem key={mood.id} value={mood.id}>
                        <span className="flex items-center gap-2">
                          {mood.emoji} {mood.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.mood && <p className="text-red-500 text-sm">{errors.mood.message}</p>}
        </div>

        {/* Editor area: use Controller for `content` so `field` is available */}
        <div className="text-black flex items-start mr-30 bg-orange-100 shadow-xl rounded-2xl p-4">
          <Controller
            name="content"
            control={control}
            defaultValue=""
            render={({ field }) => {
              return (
                <SimpleEditor
                  value={field.value} // controlled value
                  onChange={(html) => field.onChange(html)} // update RHF
                  moodPrompt={moodPrompt} // inject prompt when editor empty
                />
              );
            }}
          />
        </div>

        <div className="space-y-2 flex gap-2">
            
            <Button variant='journal' className='w-30'>Save</Button>
            <Button variant='secondary'>Add to collection</Button>
            
        </div>
      </form>
    </div>
  );
};

export default NewEntry;
