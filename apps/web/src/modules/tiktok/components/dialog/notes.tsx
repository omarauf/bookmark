import { withForm } from "@/components/form";
import { DEFAULT_POST } from "../../constants";

export const NoteForm = withForm({
  defaultValues: DEFAULT_POST,
  props: {},
  render: function Render({ form }) {
    return (
      <form.AppField name="note">
        {(field) => (
          <field.Textarea label="Notes" placeholder="Add your notes about this post..." />
        )}
      </form.AppField>
    );
  },
});
