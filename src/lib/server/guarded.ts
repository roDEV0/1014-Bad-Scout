import { command, form, getRequestEvent, query } from "$app/server";
import type { StandardSchemaV1 } from "$lib/util/standardSchema";

import {
  error,
  redirect,
  type InvalidField,
  type RemoteCommand,
  type RemoteForm,
  type RemoteFormInput,
  type RemoteQueryFunction,
  type RequestEvent,
} from "@sveltejs/kit";

const LOGINPAGE = "/login";

function isStandardSchema(schema: unknown): schema is StandardSchemaV1 {
  return (
    typeof schema === "object" ||
    (typeof schema === "function" && schema !== null && "~standard" in schema)
  );
}

// -------------------------------------------------------------------------------------------------
// guardedQuery: Remote Query with auth guard
// -------------------------------------------------------------------------------------------------

export function guardedQuery<Schema extends StandardSchemaV1, Output>(
  schema: Schema,
  fn: (
    output: StandardSchemaV1.InferOutput<Schema>,
    auth: { user: NonNullable<App.Locals["user"]>; event: RequestEvent },
  ) => Promise<Output>,
): RemoteQueryFunction<StandardSchemaV1.InferInput<Schema>, Promise<Output>>;

export function guardedQuery<Output>(
  fn: (auth: {
    user: NonNullable<App.Locals["user"]>;
    event: RequestEvent;
  }) => Promise<Output>,
): RemoteQueryFunction<void, Promise<Output>>;

export function guardedQuery<Schema extends StandardSchemaV1, Output>(
  schemaOrFn:
    | Schema
    | ((auth: {
        user: NonNullable<App.Locals["user"]>;
        event: RequestEvent;
      }) => Promise<Output>),
  maybeFn?: (
    output: StandardSchemaV1.InferOutput<Schema>,
    auth: { user: NonNullable<App.Locals["user"]>; event: RequestEvent },
  ) => Promise<Output>,
) {
  // Handle the case with schema parameter (first overload)
  if (isStandardSchema(schemaOrFn) && typeof maybeFn === "function") {
    return query(schemaOrFn, (output) => {
      const event = getRequestEvent();
      if (!event.locals.user) redirect(302, LOGINPAGE);
      return maybeFn(output, { user: event.locals.user, event });
    });
  }

  // Handle the case where there's no schema parameter (second overload)
  if (
    typeof schemaOrFn === "function" &&
    !("~standard" in schemaOrFn) &&
    !maybeFn
  ) {
    return query(() => {
      const event = getRequestEvent();
      if (!event.locals.user) redirect(302, LOGINPAGE);
      return schemaOrFn({ user: event.locals.user, event });
    });
  }

  throw new Error("Invalid arguments");
}

export function adminQuery<Schema extends StandardSchemaV1, Output>(
  schema: Schema,
  fn: (
    output: StandardSchemaV1.InferOutput<Schema>,
    auth: { user: NonNullable<App.Locals["user"]>; event: RequestEvent },
  ) => Promise<Output>,
): RemoteQueryFunction<StandardSchemaV1.InferInput<Schema>, Promise<Output>>;

export function adminQuery<Output>(
  fn: (auth: {
    user: NonNullable<App.Locals["user"]>;
    event: RequestEvent;
  }) => Promise<Output>,
): RemoteQueryFunction<void, Promise<Output>>;

export function adminQuery<Schema extends StandardSchemaV1, Output>(
  schemaOrFn:
    | Schema
    | ((auth: {
        user: NonNullable<App.Locals["user"]>;
        event: RequestEvent;
      }) => Promise<Output>),
  maybeFn?: (
    output: StandardSchemaV1.InferOutput<Schema>,
    auth: { user: NonNullable<App.Locals["user"]>; event: RequestEvent },
  ) => Promise<Output>,
) {
  // Handle the case with schema parameter (first overload)
  if (isStandardSchema(schemaOrFn) && typeof maybeFn === "function") {
    return guardedQuery(schemaOrFn, (output, { event }) => {
      if (!event.locals.user?.admin) return error(403);
      return maybeFn(output, { user: event.locals.user, event });
    });
  }

  // Handle the case where there's no schema parameter (second overload)
  if (
    typeof schemaOrFn === "function" &&
    !("~standard" in schemaOrFn) &&
    !maybeFn
  ) {
    return guardedQuery(({ event }) => {
      if (!event.locals.user?.admin) return error(403);
      return schemaOrFn({ user: event.locals.user, event });
    });
  }

  throw new Error("Invalid arguments");
}

// -------------------------------------------------------------------------------------------------
// guardedForm: Remote Form with auth guard
// -------------------------------------------------------------------------------------------------

export function guardedForm<
  Schema extends StandardSchemaV1<RemoteFormInput, Record<string, unknown>>,
  Output,
>(
  schema: Schema,
  fn: (
    output: StandardSchemaV1.InferOutput<Schema>,
    auth: {
      user: NonNullable<App.Locals["user"]>;
      event: RequestEvent;
    },
  ) => Promise<Output>,
): RemoteForm<StandardSchemaV1.InferInput<Schema>, Output>;

export function guardedForm<Input extends RemoteFormInput, Output>(
  schema: "unchecked",
  fn: (
    output: Input,
    auth: {
      user: NonNullable<App.Locals["user"]>;
      event: RequestEvent;
    },
  ) => Promise<Output>,
): RemoteForm<Input, Output>;

export function guardedForm<Output>(
  fn: (auth: {
    user: NonNullable<App.Locals["user"]>;
    event: RequestEvent;
  }) => Promise<Output>,
): RemoteForm<void, Output>;

export function guardedForm<
  Schema extends StandardSchemaV1<RemoteFormInput, Record<string, unknown>>,
  Input extends RemoteFormInput,
  Output,
>(
  schemaOrFn:
    | "unchecked"
    | Schema
    | ((auth: {
        user: NonNullable<App.Locals["user"]>;
        event: RequestEvent;
      }) => Promise<Output>),
  maybeFn?:
    | ((
        output: StandardSchemaV1.InferOutput<Schema>,
        auth: {
          user: NonNullable<App.Locals["user"]>;
          event: RequestEvent;
        },
      ) => Promise<Output>)
    | ((
        input: Input,
        auth: {
          user: NonNullable<App.Locals["user"]>;
          event: RequestEvent;
        },
      ) => Promise<Output>),
) {
  // Handle the case with schema parameter (first overload)
  if (isStandardSchema(schemaOrFn) && typeof maybeFn === "function") {
    const fn = maybeFn as (
      output: StandardSchemaV1.InferOutput<Schema>,
      auth: {
        user: NonNullable<App.Locals["user"]>;
        event: RequestEvent;
        issue: InvalidField<StandardSchemaV1.InferInput<Schema>>;
      },
    ) => Promise<Output>;
    return form(schemaOrFn, async (output, issue) => {
      const event = getRequestEvent();
      if (!event.locals.user) redirect(302, LOGINPAGE);
      return await fn(output, {
        issue,
        user: event.locals.user,
        event,
      });
    });
  }

  // Handle the case with unchecked schema parameter (second overload)
  if (typeof schemaOrFn === "string" && typeof maybeFn === "function") {
    const fn = maybeFn as (
      input: Input,
      auth: {
        user: NonNullable<App.Locals["user"]>;
        event: RequestEvent;
        issue: InvalidField<Input>;
      },
    ) => Promise<Output>;
    return form(schemaOrFn, async (input: Input, issue) => {
      const event = getRequestEvent();
      if (!event.locals.user) redirect(302, LOGINPAGE);
      return await fn(input, { issue, user: event.locals.user, event });
    });
  }

  // Handle the case where there's no schema parameter (third overload)
  if (
    typeof schemaOrFn === "function" &&
    !("~standard" in schemaOrFn) &&
    !maybeFn
  ) {
    return form(async () => {
      const event = getRequestEvent();
      if (!event.locals.user) redirect(302, LOGINPAGE);
      return await schemaOrFn({
        user: event.locals.user,
        event,
      });
    });
  }

  throw new Error("InvalidField arguments");
}

// -------------------------------------------------------------------------------------------------
// guardedCommand: Remote Command with auth guard
// -------------------------------------------------------------------------------------------------

export function guardedCommand<Schema extends StandardSchemaV1, Output>(
  schema: Schema,
  fn: (
    output: StandardSchemaV1.InferOutput<Schema>,
    auth: { user: NonNullable<App.Locals["user"]>; event: RequestEvent },
  ) => Promise<Output>,
): RemoteCommand<
  StandardSchemaV1.InferInput<Schema>,
  Promise<Output | { redirect: string }>
>;

export function guardedCommand<Input, Output>(
  fn: (
    input: Input,
    auth: { user: NonNullable<App.Locals["user"]>; event: RequestEvent },
  ) => Promise<Output>,
): RemoteCommand<Input, Promise<Output | { redirect: string }>>;

export function guardedCommand<Schema extends StandardSchemaV1, Input, Output>(
  schemaOrFn:
    | Schema
    | ((
        input: Input,
        auth: {
          user: NonNullable<App.Locals["user"]>;
          event: RequestEvent;
        },
      ) => Promise<Output>),
  maybeFn?: (
    output: StandardSchemaV1.InferOutput<Schema>,
    auth: { user: NonNullable<App.Locals["user"]>; event: RequestEvent },
  ) => Promise<Output>,
) {
  // Handle the case with schema parameter (first overload)
  if (isStandardSchema(schemaOrFn) && typeof maybeFn === "function") {
    return command(schemaOrFn, async (output) => {
      const event = getRequestEvent();
      if (!event.locals.user) return { redirect: LOGINPAGE };
      return await maybeFn(output, { user: event.locals.user, event });
    });
  }

  // Handle the case where there's no schema parameter (second overload)
  if (
    typeof schemaOrFn === "function" &&
    !("~standard" in schemaOrFn) &&
    !maybeFn
  ) {
    return command("unchecked", async (input: Input) => {
      const event = getRequestEvent();
      if (!event.locals.user) return { redirect: LOGINPAGE };
      return await schemaOrFn(input, { user: event.locals.user, event });
    });
  }

  throw new Error("InvalidField arguments");
}

export function adminCommand<Schema extends StandardSchemaV1, Output>(
  schema: Schema,
  fn: (
    output: StandardSchemaV1.InferOutput<Schema>,
    auth: { user: NonNullable<App.Locals["user"]>; event: RequestEvent },
  ) => Promise<Output>,
): RemoteCommand<
  StandardSchemaV1.InferInput<Schema>,
  Promise<Output | { redirect: string }>
>;

export function adminCommand<Input, Output>(
  fn: (
    input: Input,
    auth: { user: NonNullable<App.Locals["user"]>; event: RequestEvent },
  ) => Promise<Output>,
): RemoteCommand<Input, Promise<Output | { redirect: string }>>;

export function adminCommand<Schema extends StandardSchemaV1, Input, Output>(
  schemaOrFn:
    | Schema
    | ((
        input: Input,
        auth: {
          user: NonNullable<App.Locals["user"]>;
          event: RequestEvent;
        },
      ) => Promise<Output>),
  maybeFn?: (
    output: StandardSchemaV1.InferOutput<Schema>,
    auth: { user: NonNullable<App.Locals["user"]>; event: RequestEvent },
  ) => Promise<Output>,
) {
  // Handle the case with schema parameter (first overload)
  if (isStandardSchema(schemaOrFn) && typeof maybeFn === "function") {
    return guardedCommand(schemaOrFn, async (output, { event }) => {
      if (!event.locals.user?.admin) return {};
      return await maybeFn(output, { user: event.locals.user, event });
    });
  }

  // Handle the case where there's no schema parameter (second overload)
  if (
    typeof schemaOrFn === "function" &&
    !("~standard" in schemaOrFn) &&
    !maybeFn
  ) {
    return guardedCommand(async (input: Input, { event }) => {
      if (!event.locals.user?.admin) return {};
      return await schemaOrFn(input, { user: event.locals.user, event });
    });
  }

  throw new Error("InvalidField arguments");
}
