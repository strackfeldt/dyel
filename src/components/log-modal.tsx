/* This example requires Tailwind CSS v2.0+ */
import { Dialog, Transition } from "@headlessui/react";
import { forwardRef, Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function BaseTextInput({ label, ...props }: TextInputProps, ref: any) {
  return (
    <div className="my-2">
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          ref={ref}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...props}
        />
      </div>
    </div>
  );
}

let TextInput = forwardRef(BaseTextInput);

interface LogModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  exerciseId: number;
}

export default function LogModal({ open, setOpen, exerciseId }: LogModalProps) {
  let cancelButtonRef = useRef(null);

  let { register, handleSubmit } = useForm<{
    reps: number;
    weight: number;
  }>();
  let { invalidateQueries } = trpc.useContext();
  let { mutate } = trpc.useMutation(["log-exercise"], {
    onSuccess: () => {
      setOpen(false);
      invalidateQueries(["exercise-by-id", { id: exerciseId }]);
    },
  });

  let onSubmit = handleSubmit((data) => {
    console.log(data);

    mutate({
      reps: Number(data.reps),
      weight: Number(data.weight),
      exercise: exerciseId,
    });
  });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-lg sm:p-6">
                <form onSubmit={onSubmit}>
                  <div>
                    <div className="text-center">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Log Exercise
                      </Dialog.Title>
                    </div>

                    <TextInput
                      label="Reps"
                      type="number"
                      {...register("reps")}
                    />
                    <TextInput
                      label="Weight"
                      type="number"
                      {...register("weight")}
                    />
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
