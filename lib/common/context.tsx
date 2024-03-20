/**
 * This file provides utilities for creating and managing React Contexts with enhanced capabilities,
 * including context scoping and composition. It allows for the definition of contexts that are
 * isolated to specific parts of an application or library, enabling more modular and maintainable
 * state management patterns. The utilities support default context values, mandatory contexts within
 * specific components, and the composition of multiple contexts into a single scope. This approach
 * is particularly useful in complex applications or libraries where different parts of the application
 * might need to share state in a controlled manner.
 */
import React from 'react';

/**
 * Creates a React context with an optional default value and a provider that only re-renders
 * when its value changes. It also provides a hook for consuming the context that enforces
 * its presence within the component tree.
 *
 * @template ContextValueType - The type of the value stored in the context.
 * @param {string} rootComponentName - The name of the root component that provides this context, used in error messages.
 * @param {ContextValueType} [defaultContext] - The default value for the context.
 * @returns {[React.Provider<ContextValueType>, () => ContextValueType]} A tuple containing the Context Provider component and a hook for consuming the context.
 */
const createContext = <ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType,
) => {
  const Context = React.createContext<ContextValueType | undefined>(
    defaultContext,
  );

  function Provider(props: ContextValueType & { children: React.ReactNode }) {
    const { children, ...context } = props;
    // Only re-memoize when prop values change
    const value = React.useMemo(
      () => context,
      Object.values(context),
    ) as ContextValueType;

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContext(consumerName: string) {
    const context = React.useContext(Context);

    if (context) return context;
    if (defaultContext !== undefined) return defaultContext;

    // If a defaultContext wasn't specified, it's a required context.
    throw new Error(
      `\`${consumerName}\` must be used within \`${rootComponentName}\` `,
    );
  }

  Provider.displayName = `${rootComponentName}Provider`;
  return [Provider, useContext] as const;
};

type Scope<C = any> = Record<string, React.Context<C>[]> | undefined;
type ScopeHook = (scope: Scope) => Record<string, Scope>;
interface CreateScope {
  scopeName: string;
  (): ScopeHook;
}

/**
 * Composes multiple context scopes into a single scope. This function is used to merge the
 * contexts from different scopes into a unified context scope that can be used throughout
 * an application or library.
 *
 * @param {...CreateScope[]} scopes - An array of createScope functions representing the individual context scopes to be composed.
 * @returns {CreateScope} A createScope function representing the composed context scope.
 */
const composeContextScopes = (...scopes: CreateScope[]) => {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;

  const createScope: CreateScope = () => {
    const scopeHooks = scopes.map((createScope) => ({
      useScope: createScope(),
      scopeName: createScope.scopeName,
    }));

    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce(
        (nextScopes, { useScope, scopeName }) => {
          const scopeProps = useScope(overrideScopes);
          const currentScope = scopeProps[`__scope${scopeName}`];
          return { ...nextScopes, ...currentScope };
        },
        {},
      );

      return React.useMemo(
        () => ({ [`__scope${baseScope.scopeName}`]: nextScopes }),
        [nextScopes],
      );
    };
  };

  createScope.scopeName = baseScope.scopeName;
  return createScope;
};

/**
 * Creates a scope for contexts, allowing for the creation and composition of multiple contexts
 * under a single namespace. This utility is particularly useful for complex component libraries
 * or applications where you need to isolate state management to specific parts of the application
 * without creating global dependencies.
 *
 * @param {string} scopeName - The name of the scope, used as a namespace for the contexts.
 * @param {CreateScope[]} [createContextScopeDeps] - An array of dependent context scopes to be composed with this scope.
 * @returns {[Function, Function]} A tuple containing a createContext function tailored for this scope and a function to compose multiple context scopes.
 */
const createContextScope = (
  scopeName: string,
  createContextScopeDeps: CreateScope[] = [],
) => {
  let defaultContexts: any[] = [];

  function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType,
  ) {
    const BaseContext = React.createContext<ContextValueType | undefined>(
      defaultContext,
    );
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];

    function Provider(
      props: ContextValueType & {
        scope: Scope<ContextValueType>;
        children: React.ReactNode;
      },
    ) {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName][index] ?? BaseContext;
      // Only re-memoize when prop values change
      const value = React.useMemo(
        () => context,
        Object.values(context),
      ) as ContextValueType;

      return <Context.Provider value={value}>{children}</Context.Provider>;
    }

    function useContext(
      consumerName: string,
      scope: Scope<ContextValueType | undefined>,
    ) {
      const Context = scope?.[scopeName]?.[index] ?? BaseContext;
      const context = React.useContext(Context);

      if (context) return context;
      if (defaultContext !== undefined) return defaultContext;

      // If a defaultContext wasn't specified, it's a required context.
      throw new Error(
        `\`${consumerName}\` must be used within \`${rootComponentName}\` `,
      );
    }

    Provider.displayName = `${rootComponentName}Provider`;
    return [Provider, useContext] as const;
  }

  const createScope: CreateScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) =>
      React.createContext(defaultContext),
    );

    return function useScope(scope: Scope) {
      const contexts = scope?.[scopeName] ?? scopeContexts;
      return React.useMemo(
        () => ({
          [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts },
        }),
        [scope, contexts],
      );
    };
  };

  createScope.scopeName = scopeName;
  return [
    createContext,
    composeContextScopes(createScope, ...createContextScopeDeps),
  ] as const;
};

export { createContext, createContextScope };
export type { CreateScope, Scope };
