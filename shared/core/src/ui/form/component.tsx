import { useFormContext } from "./context";

function SubmitButton(props: any & { label: string }) {
  const form = useFormContext();

  return (
    <form.AppForm>
      <form.SubscribeButton {...props} />
    </form.AppForm>
  );
}

export { SubmitButton };
