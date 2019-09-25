import {HashMap, List, Option} from 'standard-data-structures'

type ListKey = string | number

export class ListComponentState<S> {
  private constructor(
    private baseInit: () => S,
    private readonly keys: List<ListKey>,
    private readonly hashMap: HashMap<ListKey, S>
  ) {}

  static of<S>(baseInit: () => S): ListComponentState<S> {
    return new ListComponentState(baseInit, List.empty(), HashMap.of())
  }

  set(k: ListKey, value: S = this.baseInit()): ListComponentState<S> {
    const items = this.hashMap.has(k) ? this.keys : this.keys.prepend(k)
    return new ListComponentState(
      this.baseInit,
      items,
      this.hashMap.set(k, value)
    )
  }

  get(k: ListKey): Option<S> {
    return this.hashMap.get(k)
  }

  fold<T>(s: T, fn: (current: S, k: ListKey, acc: T) => T): T {
    return this.keys.fold(s, (key, acc) =>
      fn(this.hashMap.get(key).getOrElse(this.baseInit()), key, acc)
    )
  }

  has(k: ListKey): boolean {
    return this.hashMap.has(k)
  }

  get asArray(): Array<[ListKey, S]> {
    return this.fold(List.empty<[ListKey, S]>(), (S, L, A) => A.prepend([L, S]))
      .asArray
  }
}
