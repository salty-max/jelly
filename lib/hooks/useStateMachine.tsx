import React from 'react';

// 🤯 https://fettblog.eu/typescript-union-to-intersection/
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
  x: infer R,
) => any
  ? R
  : never;

type Machine<S> = Record<string, Record<string, S>>;
type MachineState<T> = keyof T;
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>;

export function useStateMachine<M>(
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
