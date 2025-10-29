import type { HandleValidationError } from "@sveltejs/kit";

export const handleValidationError: HandleValidationError = ({
  event,
  issues,
}) => {
	console.log(event)
  return {
    message: "Nice try, hacker!",
  };
};
