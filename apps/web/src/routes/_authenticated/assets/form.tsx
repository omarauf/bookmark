import { createFileRoute } from "@tanstack/react-router";
import {
  Box,
  Boxes,
  CalendarDays,
  CheckCircle2,
  Files,
  Fingerprint,
  Palette,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Tags,
  Type,
  Upload,
  UserCircle2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppForm } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Main } from "@/layout/main";
import { options } from "./-components/options";
import { defaultValues, formSchema } from "./-components/schema";

export const Route = createFileRoute("/_authenticated/assets/form")({
  component: RouteComponent,
});

function RouteComponent() {
  const [experienceOptions, setExperienceOptions] = useState([
    "Junior",
    "Mid-Level",
    "Senior",
    "Lead",
    "Principal",
    "Staff",
  ]);

  const form = useAppForm({
    defaultValues: defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Form submitted successfully!");
      console.log(value);
    },
  });

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  const handleAddExperience = async (value: string) => {
    setExperienceOptions((prev) => [...prev, value]);
    toast.success(`Added "${value}" to experience levels`);
  };

  return (
    <Main
      className="relative flex h-full flex-col p-0"
      style={{ fontFamily: "var(--font-sans-manrope), system-ui, sans-serif" }}
    >
      <ScrollArea className="min-h-0 p-6 pb-0">
        {/* Hero Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-foreground text-background">
              <Boxes className="h-5 w-5" />
            </div>
            <span
              className="font-bold text-[11px] text-muted-foreground uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-mono-jetbrains), monospace" }}
            >
              Component Reference
            </span>
          </div>
          <h1 className="font-extrabold text-5xl text-foreground leading-[0.95] tracking-tight">
            Form Builder
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground leading-relaxed">
            A complete showcase of every form field component available in the design system. Each
            input demonstrates real data binding, validation, and interaction patterns.
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-8 pb-16">
          {/* Section: Identity */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <UserCircle2 className="h-4 w-4 text-foreground/60" />
              <h2
                className="font-bold text-foreground/60 text-xs uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-mono-jetbrains), monospace" }}
              >
                Identity
              </h2>
              <div className="h-px flex-1 bg-foreground/10" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Type className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Basic Information</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                  <form.AppField name="fullName">
                    {(field) => <field.Input label="Full Name" placeholder="Alex Mercer" />}
                  </form.AppField>

                  <form.AppField name="age">
                    {(field) => <field.Number label="Age" placeholder="28" min={0} max={120} />}
                  </form.AppField>

                  <form.AppField name="password">
                    {(field) => (
                      <field.Password label="Password" placeholder="Minimum 8 characters" />
                    )}
                  </form.AppField>

                  <form.AppField name="favoriteColor">
                    {(field) => <field.Color label="Favorite Color" />}
                  </form.AppField>

                  <div className="md:col-span-2">
                    <form.AppField name="bio">
                      {(field) => (
                        <field.Textarea
                          label="Bio"
                          placeholder="Full-stack developer with a passion for distributed systems..."
                        />
                      )}
                    </form.AppField>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Authentication</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  <form.AppField name="role">
                    {(field) => (
                      <field.Select label="Role" placeholder="Select role" options={options.role} />
                    )}
                  </form.AppField>

                  <form.AppField name="gender">
                    {(field) => <field.Radio label="Gender" options={options.gender} />}
                  </form.AppField>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section: Preferences */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <Settings2 className="h-4 w-4 text-foreground/60" />
              <h2
                className="font-bold text-foreground/60 text-xs uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-mono-jetbrains), monospace" }}
              >
                Preferences
              </h2>
              <div className="h-px flex-1 bg-foreground/10" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Interests & Skills</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <form.AppField name="interests">
                    {(field) => (
                      <field.MultiSelect
                        label="Interests"
                        placeholder="Select interests"
                        options={options.interest}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="skills">
                    {(field) => (
                      <field.CheckboxGroup
                        label="Skills"
                        options={options.skill}
                        orientation="horizontal"
                      />
                    )}
                  </form.AppField>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <form.AppField name="plan">
                    {(field) => <field.Tabs label="Subscription Plan" options={options.plan} />}
                  </form.AppField>

                  <form.AppField name="viewMode">
                    {(field) => <field.ToggleGroup label="View Mode" options={options.viewMode} />}
                  </form.AppField>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section: Temporal */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-foreground/60" />
              <h2
                className="font-bold text-foreground/60 text-xs uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-mono-jetbrains), monospace" }}
              >
                Temporal
              </h2>
              <div className="h-px flex-1 bg-foreground/10" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Start Date</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form.AppField name="startDate">
                    {(field) => <field.Date label="Start Date" placeholder="Pick a date" />}
                  </form.AppField>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Availability</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form.AppField name="availability">
                    {(field) => <field.DateRange label="Date Range" placeholder="Pick a range" />}
                  </form.AppField>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Budget Allocation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form.AppField name="budget">
                    {(field) => <field.SliderRange label="Budget Range" />}
                  </form.AppField>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section: Media */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <Upload className="h-4 w-4 text-foreground/60" />
              <h2
                className="font-bold text-foreground/60 text-xs uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-mono-jetbrains), monospace" }}
              >
                Media
              </h2>
              <div className="h-px flex-1 bg-foreground/10" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Profile Avatar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form.AppField name="avatar">
                    {(field) => <field.Image label="Upload Image" />}
                  </form.AppField>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Files className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Document</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form.AppField name="document">
                    {(field) => <field.File label="Upload Document" />}
                  </form.AppField>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section: Advanced */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <Box className="h-4 w-4 text-foreground/60" />
              <h2
                className="font-bold text-foreground/60 text-xs uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-mono-jetbrains), monospace" }}
              >
                Advanced
              </h2>
              <div className="h-px flex-1 bg-foreground/10" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Category Hierarchy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form.AppField name="categories">
                    {(field) => (
                      <field.TreeSelector label="Categories" options={options.category} />
                    )}
                  </form.AppField>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Experience Levels</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form.AppField name="experienceLevel">
                    {(field) => (
                      <field.Autocomplete
                        label="Experience Level"
                        placeholder="Search or type to add new..."
                        options={experienceOptions}
                        onAdd={handleAddExperience}
                      />
                    )}
                  </form.AppField>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section: Toggles */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-foreground/60" />
              <h2
                className="font-bold text-foreground/60 text-xs uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-mono-jetbrains), monospace" }}
              >
                Toggles
              </h2>
              <div className="h-px flex-1 bg-foreground/10" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">Communications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <form.AppField name="subscribe">
                      {(field) => (
                        <field.Checkbox
                          label="Subscribe to weekly newsletter"
                          legend="Newsletter"
                        />
                      )}
                    </form.AppField>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-foreground/40" />
                    <span className="font-semibold text-sm">System</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <form.AppField name="notifications">
                      {(field) => <field.Switch label="Enable push notifications" />}
                    </form.AppField>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section: Tags */}
          <section className="">
            <div className="mb-5 flex items-center gap-3">
              <Tags className="h-4 w-4 text-foreground/60" />
              <h2
                className="font-bold text-foreground/60 text-xs uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-mono-jetbrains), monospace" }}
              >
                Tagging
              </h2>
              <div className="h-px flex-1 bg-foreground/10" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-4 w-4 text-foreground/40" />
                  <span className="font-semibold text-sm">Status Tags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form.AppField name="tags">
                  {(field) => <field.ButtonGroup label="Quick Tags" options={options.tag} />}
                </form.AppField>
              </CardContent>
            </Card>
          </section>

          {/* Submit */}
          <div className="absolute bottom-0 left-0 z-10 w-full rounded-b-2xl border-border border-t-2 bg-background/80 px-6 py-4 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <div className="text-muted-foreground text-sm">
                <span
                  className="font-bold text-foreground"
                  style={{ fontFamily: "var(--font-mono-jetbrains), monospace" }}
                >
                  21
                </span>{" "}
                fields configured
              </div>
              <form.AppForm>
                <form.SubmitButton className="h-11 px-10 font-bold text-base uppercase tracking-wider">
                  Submit Form
                </form.SubmitButton>
              </form.AppForm>
            </div>
          </div>
        </form>
      </ScrollArea>
    </Main>
  );
}
