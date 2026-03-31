import { withForm } from "@/components/form";
import { formOpts } from "../utils/form-options";

export const NoteForm = withForm({
  ...formOpts,
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
