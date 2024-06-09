import { Button } from "./ui/button";

const MswError = () => {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-2xl font-bold tracking-tight">
          Something went wrong please try again.
        </p>
        <p className="text-sm">
          If you&apos;re using Chrome and have been idle for a while, this is
          probably happening due to the mock MSW Backend
        </p>
        <p className="text-sm">
          You can find more detail{" "}
          <a
            className="underline cursor-pointer"
            href="https://github.com/mswjs/msw/issues/2115"
            target="_blank"
          >
            here
          </a>
        </p>
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>
      </div>
    </div>
  );
};
MswError.displayName = "MswError";

export { MswError };
