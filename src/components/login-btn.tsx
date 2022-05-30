import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton(props: any) {
  let { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-5">
        <span className="text-sm text-gray-200">{session.user?.email}</span>
        <button {...props} onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }
  return (
    <button {...props} onClick={() => signIn()}>
      Sign in
    </button>
  );
}
