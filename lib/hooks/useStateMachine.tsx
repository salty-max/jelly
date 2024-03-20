import React from 'react';

/**
 * Converts a union type to an intersection type. This type utility is particularly useful
 * for turning disparate types into a single type that guarantees the presence of all
 * members defined across the union types.
 *
 * @template T - The union type to be converted into an intersection type.
 * @example
 * type UnionExample = { name: string } | { age: number };
 * type IntersectionExample = UnionToIntersection<UnionExample>;
 * // Result: { name: string } & { age: number }
 *
 * 🤯 https://fettblog.eu/typescript-union-to-intersection/
 */
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
  x: infer R,
) => any
  ? R
  : never;

type Machine<S> = Record<string, Record<string, S>>;
type MachineState<T> = keyof T;
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>;

/**
 * A hook that implements a finite state machine (FSM) within a React component. This hook
 * provides a simple and declarative way to manage complex component states and transitions
 * in a type-safe manner. It uses React's `useReducer` hook internally to handle state transitions.
 *
 * @template M - The type of the state machine configuration object, defining the states and transitions.
 * @param {MachineState<M>} initialState - The initial state of the machine.
 * @param {M & Machine<MachineState<M>>} machine - The state machine configuration object, defining possible states and transitions.
 * @returns {[MachineState<M>, React.Dispatch<MachineEvent<M>>]} A tuple containing the current state and a dispatch function to trigger state transitions.
 * @example
 * const [state, dispatch] = useStateMachine('idle', {
 *   idle: { START: 'running' },
 *   running: { STOP: 'idle' },
 * });
 * // state: 'idle'
 * // dispatch('START')
 * // state: 'running'
 */
function useStateMachine<M>(
  initialState: MachineState<M>,
  machine: M & Machine<MachineState<M>>,
) {
  return React.useReducer(
    (state: MachineState<M>, event: MachineEvent<M>): MachineState<M> => {
      const nextState = (machine[state] as any)[event];
      return nextState ?? state;
    },
    initialState,
  );
}

export { useStateMachine };
