"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import { Plus, X } from "lucide-react"
import { actions, errorMessage } from "@/lib/demo/store"
import { cn } from "@/lib/utils"
import { CATEGORIES } from "./goal-meta"

const schema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(80),
  description: z.string().trim().min(20, "Describe the goal in at least 20 characters").max(600),
  category: z.enum(["Hackathon", "Study", "Project", "Research", "Club", "Event"]),
  skills: z.string().trim().min(1, "Add at least one skill"),
  slots: z.coerce.number<number>().int().min(2, "At least 2 members").max(20, "At most 20 members"),
  deadline: z.string().refine((v) => !!v && new Date(v).getTime() > Date.now(), "Choose a future date"),
})

type Values = z.infer<typeof schema>

const input = (bad: boolean) =>
  cn(
    "w-full rounded-xl border bg-secondary/50 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20",
    bad ? "border-destructive/60" : "border-border/60",
  )

export function CreateGoalDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const defaultDeadline = new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { category: "Project", slots: 4, deadline: defaultDeadline },
  })

  const onSubmit = (v: Values) => {
    setSubmitError(null)
    try {
      const goal = actions.createGoal({
        ...v,
        skills: Array.from(new Set(v.skills.split(",").map((s) => s.trim()).filter(Boolean))).slice(0, 8),
        deadline: new Date(v.deadline).toISOString(),
      })
      toast.success("Goal created. Your team room is ready.")
      reset()
      onOpenChange(false)
      router.push(`/goals/${goal.id}`)
    } catch (e) {
      setSubmitError(errorMessage(e))
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-popover p-6 text-popover-foreground shadow-2xl data-[state=open]:animate-in data-[state=open]:zoom-in-95">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold">Create a goal</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                Describe what you want to achieve and the skills you need. Students with matching skills will find it.
              </Dialog.Description>
            </div>
            <Dialog.Close aria-label="Close" className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
              <X className="size-4" aria-hidden />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            {submitError ? <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{submitError}</p> : null}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="goal-title" className="text-sm font-medium">Title</label>
              <input id="goal-title" placeholder="e.g. Build a campus events app" className={input(!!errors.title)} {...register("title")} />
              {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="goal-desc" className="text-sm font-medium">Description</label>
              <textarea id="goal-desc" rows={3} placeholder="What will the team build or learn?" className={input(!!errors.description)} {...register("description")} />
              {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="goal-cat" className="text-sm font-medium">Category</label>
                <select id="goal-cat" className={input(false)} {...register("category")}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="goal-slots" className="text-sm font-medium">Team size</label>
                <input id="goal-slots" type="number" min={2} max={20} className={input(!!errors.slots)} {...register("slots")} />
                {errors.slots ? <p className="text-xs text-destructive">{errors.slots.message}</p> : null}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="goal-skills" className="text-sm font-medium">Skills needed</label>
              <input id="goal-skills" placeholder="React, Python, Figma" className={input(!!errors.skills)} {...register("skills")} />
              <p className="text-xs text-muted-foreground">Separate with commas.</p>
              {errors.skills ? <p className="text-xs text-destructive">{errors.skills.message}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="goal-deadline" className="text-sm font-medium">Deadline</label>
              <input id="goal-deadline" type="date" className={input(!!errors.deadline)} {...register("deadline")} />
              {errors.deadline ? <p className="text-xs text-destructive">{errors.deadline.message}</p> : null}
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Dialog.Close className="h-10 rounded-xl border border-border/60 px-4 text-sm font-medium hover:bg-secondary">Cancel</Dialog.Close>
              <button type="submit" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Plus className="size-4" aria-hidden />
                Create goal
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
