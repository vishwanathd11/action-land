import {ComponentNext} from '@action-land/component'
import {action, Action, Nil} from '@action-land/core'
import {Smitten} from '@action-land/smitten'
import {Action2} from '@action-land/core/src/action'

declare function $<T>(a: T): T extends ComponentNext<infer P> ? P : never

// $ExpectType { count: number; }
$(ComponentNext.lift({count: 0})).iState

// $ExpectType { iState: { count: number; }; oView: void; }
$(ComponentNext.lift({count: 0}))

// $ExpectType Action<number, "inc">
$(
  ComponentNext.lift({count: 0}).matchR('inc', (e: number, s) => ({
    count: s.count + 1
  }))
).iActions

// $ExpectType { count: number; action: string; }
$(
  ComponentNext.lift({count: 0}).matchR('inc', (e, s) => ({
    count: s.count + 1,
    action: 'inc'
  }))
).oState

// $ExpectType Action<{ b: number; } & { a: string; }, "inc">
$(
  ComponentNext.lift({count: 0})
    .matchR('inc', (e: {a: string}, s) => s)
    .matchR('inc', (e: {b: number}, s) => s)
).iActions

// $ExpectType Action<{ b: number; } & { a: string; }, "inc">
$(
  ComponentNext.lift({count: 0})
    .matchC('inc', (e: {a: string}, s) => Nil())
    .matchC('inc', (e: {b: number}, s) => Nil())
).iActions

// $ExpectType Action<{ url: string; }, "HTTP"> | Action<{ data: string; }, "Write">
$(
  ComponentNext.lift({count: 0})
    .matchC('inc', (e, s) => action('HTTP', {url: 'abc.com'}))
    .matchC('dec', (e, s) => action('Write', {data: 'abc'}))
).oActions

// $ExpectType Action<{ b: number; } & { a: string; }, "inc">
$(
  ComponentNext.lift({count: 0})
    .matchC('inc', (a: {a: string}, s) => Nil())
    .matchC('inc', (a: {b: number}, s) => Nil())
).iActions

// $ExpectType { node: never; children: { child1: never; child2: never; }; }
$(
  ComponentNext.lift({count: 0}).install({
    child1: ComponentNext.lift({i: true}),
    child2: ComponentNext.lift({i: 'Hi'})
  })
).oState

// $ExpectType { node: { count: number; }; children: { child1: { i: boolean; }; child2: { i: string; }; }; }
$(
  ComponentNext.lift({count: 0}).install({
    child1: ComponentNext.lift({i: true}),
    child2: ComponentNext.lift({i: 'Hi'})
  })
).iState

// $ExpectType Action<unknown, "X"> | Action<Action<unknown, "A">, "childA"> | Action<Action<unknown, "B">, "childB">
$(
  ComponentNext.lift({count: 0})
    .matchR('X', (e, s) => s)
    .install({
      childA: ComponentNext.lift({i: true}).matchR('A', (e, s) => s),
      childB: ComponentNext.lift({i: true}).matchR('B', (e, s) => s)
    })
).iActions

// $ExpectType { childA: ComponentNext<{ iState: number; oView: void; }>; }
$(
  ComponentNext.lift(0).install({
    childA: ComponentNext.lift(10)
  })
).iChildren

// $ExpectType Action<null, "X"> | Action<Action<null, "A">, "childA">
$(
  ComponentNext.lift({count: 0})
    .matchC('X', (e, s) => action('X', null))
    .install({
      childA: ComponentNext.lift({i: true}).matchC('A', (e, s) =>
        action('A', null)
      )
    })
).oActions

// $ExpectType string
$(ComponentNext.lift({count: 0}).render(() => 'Hello')).oView

// $ExpectType { s: { count: number; }; p: boolean; }
$(ComponentNext.lift({count: 0}).render((_, p: boolean) => ({s: _.state, p})))
  .oView

// $ExpectType { inc: (e: number) => unknown; }
$(
  ComponentNext.lift(0)
    .matchR('inc', (e: number, s) => s + e)
    .render((_, p: boolean) => _.actions)
).oView

// $ExpectType {}
$(ComponentNext.lift(0).render((_, p: boolean) => _.actions)).oView

// $ExpectType { childA: (p: Date) => string[]; }
$(
  ComponentNext.lift(0)
    .install({
      childA: ComponentNext.lift(10).render((_, p: Date) => ['DONE'])
    })
    .render((_, p: boolean) => _.children)
).oView

// $ExpectType { childA: () => string[]; }
$(
  ComponentNext.lift(0)
    .install({
      childA: ComponentNext.lift(10).render(() => ['DONE'])
    })
    .render((_, p: boolean) => _.children)
).oView

// $ExpectType (e: string) => unknown
$(
  ComponentNext.lift(0)
    .matchR('inc', (e: string, s) => s)
    .matchR('dec', (e: number, s) => s)
    .render((_, p: boolean) => _.actions.inc)
).oView

// $ExpectType { color: string; count: number; }
$(ComponentNext.lift({count: 10}).configure(s => ({...s, color: 'red'}))).iState

// $ExpectType ComponentNext<{ iState: number; oState: number; oView: string[]; iProps: Date; }>
ComponentNext.from(
  {
    init: (a: string, b: number) => 10,
    update: (a: Action<unknown>, b: number) => b,
    command: (a: Action<unknown>, b: number) => Nil(),
    view: (e: Smitten, m: number, s: Date) => {
      return ['Hello']
    }
  },
  'hello',
  10
)

// $ExpectType ComponentNext<{ iState: undefined; oView: void; }>
ComponentNext.empty

// $ExpectType { b: string; a: string; } | { c: string; a: string; }
$(
  ComponentNext.lift({a: ''})
    .matchR('action1', (value, state) => ({...state, b: ''}))
    .matchR('action2', (value, state) => ({...state, c: ''}))
).oState

// $ExpectType { a: string; } | { b: string; a: string; } | { c: string; a: string; }
$(
  ComponentNext.lift({a: ''})
    .matchR('action1', (value, state) => ({...state, b: ''}))
    .matchR('action2', (value, state) => ({...state, c: ''}))
    .render(_ => _.state)
).oView

// $ExpectType { a: string; }
$(ComponentNext.lift({a: ''}).render(_ => _.state)).oView

// $ExpectType Action<Action<Action<unknown, "a">, "gc1"> | Action<number, "c1">, "child1"> | Action<never, "child2">
$(
  ComponentNext.lift({count: 0})
    .install({
      child1: ComponentNext.lift({i: true})
        .install({gc1: ComponentNext.empty.matchR('a', (a, s) => s)})
        .matchR('c1', (a: number, s) => s),
      child2: ComponentNext.lift({i: 'Hi'})
    })
    .matchR('child1', (a, s) => {
      return s
    })
).iActions

// $ExpectType Action<Action<Action<unknown, "a">, "gc1"> | Action<number, "c1">, "child1"> | Action<never, "child2">
$(
  ComponentNext.lift({count: 0})
    .install({
      child1: ComponentNext.lift({i: true})
        .install({gc1: ComponentNext.empty.matchR('a', (a, s) => s)})
        .matchC('c1', (a: number, s) => Nil()),
      child2: ComponentNext.lift({i: 'Hi'})
    })
    .matchC('child1', (a, s) => Nil())
).iActions

$(
  Action2.of(Action2.of(Action2.of(10, 't3'), 't2'), 't1').fold(
    {
      t1: {
        t2: {
          t3: (val, state) => ({count: state.count + val})
        }
      }
    },
    {count: 10}
  )
)

$(
  Action2.of(Action2.of(Action2.of(Action2.of(10, 't4'), 't3'), 't2'), 't1').fold(
    {
      t2: (val, state) =>
        val.fold({
          t4: (val, state) => ({count: state.count + val})
        }, state)
    },
    {count: 10}
  )
)
