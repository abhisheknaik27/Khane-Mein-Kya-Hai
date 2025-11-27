import { ErrorView } from "@/components/views/ErrorView";

export default function NotFound() {
  return (
    <ErrorView
      title="404 - Wrong Kitchen!"
      message="Hey Chef, looks like you landed on the wrong page. We couldn't find the recipe you were looking for."
    />
  );
}
