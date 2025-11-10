"use client"
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalSchema } from "../../lib/schema";
import { Link, useNavigate, useParams } from "react-router-dom";
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
// import { useAuth } from "@clerk/clerk-react";
import { useEntries } from "@/context/EntriesContext";
import { toast } from "react-hot-toast";


const NewEntry = ({isEditMode = false}) => {
  const {id} = useParams();
  const {addEntry, entries, updateEntry, fetchEntries,isDisabled, setIsDisabled} = useEntries()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue, 
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      imageUrl: "",
    },
  });

  const isLoading = false;

  // watch mood -> compute moodPrompt
  const selectedMoodId = watch("mood");
  const moodPrompt = selectedMoodId ? MOODS[selectedMoodId]?.prompt ?? "" : "";

  useEffect(() => {
  if (!isEditMode || entries.length === 0) return;
  const existing = entries.find((e) => e.id === id);
  if (!existing) return;

  // if existing.mood might be object or string, prefer .id when available
  const moodId =  Object.values(MOODS).find(
      (m) =>
        m.id === existing.mood ||
        String(m.label).toLowerCase() === String(existing.mood).toLowerCase()
    )?.id ?? (existing.mood ?? "");

  reset({
    title: existing.title || "",
    content: existing.content || "",
    mood: moodId,
    imageUrl: existing.imageUrl || "",
  });

  setValue("mood", moodId);

  // console.log("existing.mood:", existing.mood);
  // console.log("moodId set:", moodId, " -> RHF getValues('mood'):", getValues("mood"));
}, [isEditMode, id, entries, reset, setValue, getValues]);

  const onSubmit = async (data) => {
    // setIsLoading(true);
    setIsDisabled(true);
    try{
      const payload = {
        title: data.title,
        mood: data.mood,
        content: data.content,
        imageUrl: null
      };

      if (isEditMode) {
        await updateEntry(id, payload);
        toast.success("Entry updated!");
        await fetchEntries();
        navigate("/archives");
      } else {
        await addEntry(payload);
        toast.success("Entry created!");
        await fetchEntries();
        navigate("/archives");
      } 
      
      
      reset({
        title: "",
        content: "",
        mood: "",
        imageUrl:"",
      });
      
    }
    catch(error){
      console.log(error.message);
    }
    finally {
    setIsDisabled(false); // re-enable after completion
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
          <label className="text-medium font-medium text-black dark:text-white">Title:</label>
          <Input
            {...register("title")}
            placeholder="Give your entry a title..."
            className={`px-5 md:text-md text-black dark:text-white ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-medium font-medium text-black dark:text-white">How are you feeling?</label>

          <Controller
          key={selectedMoodId || "mood-controller"} 
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
                        <span className="flex items-center gap-2 text-black dark:text-white">
                          {mood.emoji} {mood.label}
                        </span>
                      </SelectItem>
                    ))}
                    {selectedMoodId && !Object.values(MOODS).some(m => m.id === selectedMoodId) && (
        <SelectItem key="__fallback__" value={selectedMoodId}>
            {String(selectedMoodId)}
        </SelectItem>
  )}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.mood && <p className="text-red-500 text-sm">{errors.mood.message}</p>}
        </div>

        {/* Editor area: use Controller for `content` so `field` is available */}
        <div className="text-black flex items-start mr-30 bg-orange-100 dark:bg-zinc-900 shadow-xl rounded-2xl p-4 dark:text-white">
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
            
            <Button variant='journal' type='submit' disabled={isDisabled} className='w-30'>{isEditMode ? "Update" : "Save"}</Button>
            {/* <Button variant='secondary'>Add to collection</Button> */}
            
        </div>
      </form>
    </div>
  );
};

export default NewEntry;
