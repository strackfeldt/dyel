import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { TextInput } from "../../components/text-input";
import { trpc } from "../../utils/trpc";

export default function Add() {
  let { replace } = useRouter();
  let { mutate } = trpc.useMutation("create-exercise");
  let { register, handleSubmit } = useForm<{ name: string }>();

  let onSubmit = handleSubmit((data) => {
    mutate(
      {
        name: data.name,
      },
      {
        onSuccess() {
          replace("/exercises");
        },
      }
    );
  });

  return (
    <main>
      <div className="p-4 max-w-2xl mx-auto">
        <form onSubmit={onSubmit}>
          <TextInput
            label="Name"
            placeholder="Name"
            type="text"
            {...register("name", { required: true })}
          />

          <button
            type="submit"
            className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
          >
            Add
          </button>
        </form>
      </div>
    </main>
  );
}
