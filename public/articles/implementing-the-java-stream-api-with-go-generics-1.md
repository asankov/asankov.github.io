---
title: "Implementing the Java Stream API with Go Generics: Part 1"
linkTitle: "Implementing the Java Stream API with Go Generics: Part 1"
date: 2022-12-22
description: The Java Stream API is a flexible API that allows you to use functional programming to manipulate data. Since Go 1.18 when generics were introduced to the language it is much easier to do something similar in Go. This port follows my experience implementing the Stream API in Go with generics.
categories:
  - Go
aliases:
  - /go-generics-stream-1
---

A long time ago in a galaxy far, far away...
Okay, it was in the same galaxy, but a long time ago I used to be a Java developer.

That is before I moved to working with Go full-time when I joined Docker in 2019.

In my Java days, one of my favourite Java APIs was the Stream API.
This is a set of APIs that allow you to work with data structures such as lists in a way that resembles functional programming.

For example, this code creates a new `Stream` with values of 1 to 5.
It then maps the values by multiplying each one by `2` and, in the end, calls the `System.out.println` method for each of the values.

Running this code will print the values `2, 4, 6, 8, 10` to the screen.

```java
Stream.of(1, 2, 3, 4, 5)
    .map(i -> i * 2)
    .forEach(System.out::println)
```

This style of programming is loved by many (me included) for multiple reasons:

- it allows modifying data in an easy, human-readable manner
- it hides complex operations behind a simple API.
  We can easily change the implementation without changing the code
  (for example, by calling the `parallel` method of the `Stream` object that converts the stream to a parallel one)
- it utilizes functional-programming patterns (like immutability and pure functions)

Implementing such an API was not impossible in [Go before 1.18](https://go.dev/blog/intro-generics), but because of the lack of generics, it would have meant that we needed to implement this API each time for each different type.
Not ideal.

Generics solve this problem, and it is precisely in use cases like this that their benefit is visible.

So I decided that I am going to re-implement this API in Go.

## Defining the interface

Before starting the implementation, I first had to define the interface.

To do that, I copied the `Stream` interface from [here](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html) and used it as a baseline.

Most of the rewriting of the interface from Java to Go was straightforward, but not everything.

Of course, the Java and Go languages have some differences between them.
That meant that I had to make some minor changes to the interface for it to be usable in Go.

These are the changes:

### Function names capitalization

The most obvious one is that I had to capitalize all method names (`forEach` → `ForEach`, etc.).
That is because, in Go, all public identifiers start with a capital letter.
Defining a private interface method makes no sense; hence I needed this change.

### No function overloads in Go

Another change I had to make was renaming methods with the same name.
In the Java interface, there are methods like `sorted`, `collect`and `reduce` that have overloads based on the type and number of arguments they are invoked with.

Go does not support function overloads, so I had to define these methods with different names.
Full list of these name changes:

- `reduce(BinaryOperator<T> accumulator)` → `Reduce`
- `reduce(T identity, BinaryOperator<T> accumulator)` → `ReduceWithIdentity`
- `reduce(U identity, BiFunction<U,? super T,U> accumulator, BinaryOperator<U> combiner)`-> `ReduceWithIdentityAndCombiner`
- `sorted()` → `Sorted`
- `sorted(Comparator<? super T> comparator)` → `SortedWithComparator`
- `collect(Supplier<R> supplier, BiConsumer<R,? super T> accumulator, BiConsumer<R,R> combiner)` → `Collect`
- `collect(Collector<? super T,A,R> collector)` → `CollectWithCollector`

I have also decided to omit some methods from the Go interface.
For example, in Java, we have `(flat)mapToInt` and `(flat)mapToLong`, which return `IntStream/Int` and `LongStream/Long`.
I have decided to keep only `(flat)mapToInt` which returns a stream of `int64` (or just an `int64`).
Go does not have a type like `long`; instead, we use `int64`; hence the second method is not really needed.
(I could have made `MapToInt(...) int32` and `MapToLong(...) int64`, but I think that is not needed unless you care that much about memory usage.

Another difference is that the Java interface defines two `toArray` methods.
One that receives no arguments and returns an `Object[]` (hence erasing the original generic type), and one that receives an array generator and returns an array of the same type (hence saving the original generic type).
That is because Java generics are just compile-type checks, and all generic information is erased at runtime.
This is not the case in Go, and we do not need to receive an array generator to be able to preserve the original generic type.
So I have only defined one `ToArray` method that receives no arguments and returns a `T[]` (where `T` is the original generic type, hence preserving the original generic type).

### Methods that cannot be part of the interface

Due to a limitation in the Go implementation of generics, some of the methods that are part of the Java `Stream` interface cannot be part of the Go interface.

These methods are:

- `map(Function<? super T,? extends R> mapper)`
- `<R> Stream<R> flatMap(Function<? super T,? extends Stream<? extends R>> mapper)`
- `<R> R collect(Supplier<R> supplier, BiConsumer<R,? super T> accumulator, BiConsumer<R,R> combiner)`
- `<R,A> R collect(Collector<? super T,A,R> collector)`
- `<U> U reduce(U identity, BiFunction<U,? super T,U> accumulator, BinaryOperator<U> combiner)`

The reason for that is these methods operator not only with the type of the Stream (`T`), but with one or two more generic types (`R`, `U`, `A`).
Go does not allow attaching generic parameters to an interface methods, so something like this is not valid Go code:

```go
type Stream[T any] interface {
    Map[R any](mapper func(T) R) // ❌ compile-time error: interface method must have no type parameters
}
```

This means that we cannot have these methods on the interface type.

The solution I came up with is to extract these methods as package methods of the `stream` package and make the stream the first argument:

```go
package stream

func Map[T any, R any](stream Stream[T], mapper func(T) R) Stream[R]
```

This will allow us to implement the same functionality in a similar way, with the only drawback that in the implementation of `Map` (and the other functions in this group) we will not be able to use any of the internal of the current stream implementation, but would have to only use the interface methods.
I think that should be ok.

### Methods that cannot be implemented due to constraints

Generics in Go have something called a constraint.
That is the minimum type that can be passed to the generic function/struct.

The most broad constraint is `any`, which is an alias for `interface{}`.
This constraint means that we can use every type with this generic function/struct, but it also limit what we can do with the value.

For example, we can do:

```go
func Do[T any](t T) T{
    return t
}
```

but we cannot do:

```go
func Do[T any](t1, t2 T) T {
     return t1 + t2 // ❌ compile-time error: invalid operation: operator + not defined on t1 (variable of type T constrained by any)
}
```

that is because Go does not know whether the `+` operation will be defined on the type that we use with this generic function.

If we want to be able to do something with the values we need to use more restrictive constraint.

The Go package [`golang.org/x/exp/constraints`](http://golang.org/x/exp/constraints) defines useful constraints like `Integer`, `Float`, etc.
We can use these if we want to do arithmetic operations with our values.

We can use any interface as a constraint.

As constraint for my `Stream` interface I picked `any` because I want to be used with as many types with possible.
However, that means that some methods cannot be implemented.
These are the `Sorted()` method and `Distinct()` methods.
In Java they can be implemented for any type, because Java type inherits from `Object` and it has `equals` methods that can be used to compare the values.
In Go, that is simple not possible.
That is why, for my initial implementation I have left these methods non-implemented and if called they will `panic`.
For sorting there is the `SortedWithComparator` function that required the consumer pass a comparator, which will be used for the sorting.

### Static methods

The Java `Stream` interface has some static methods attached to him.
These include `Stream.of` , `Stream.generate`, `Stream.iterate`, etc.
Go does not have static methods, but does have package methods not attached to the type, so we can use that for these methods.
That way the usage of these methods in Java and Go will look similar:

### No Optional

Since Java is notorious for its [`NullPointerException`](https://docs.oracle.com/javase/7/docs/api/java/lang/NullPointerException.html) in Java 8 the `Optional<T>` type was introduced.
This is a generic type that holds a value of type `T` OR `null` and it provides useful methods for working with the value.

I decided not to implement this type and instead to work with raw Go pointers, because in Go not everything is a pointer and it's not that easy to get a nil-derefence error.

All methods from the Java interface that return `Optional<T>` will return `*T` in my Go interface.

```java
var s = Stream.of(1, 2, 3)
```

```go
import "github.com/asankov/go-streams/stream"

var s = stream.Of(1, 2, 3)
```

## Initial implementation

I wanted to make the initial implementation as simple as possible.

I decided that the way to do that is to have a generic struct with a slice of generic elements.
These will be the elements of the stream.

```go
type SliceStream[T any] struct {
    elements []T
}
```

The type constraint for the generic type `T` is `any` because we want to allow this struct to be used with any type (more on the limitation that comes from this decision later).

The `elements` slice is a private property of the struct.
We do not want anyone to mess with the elements from the outside.
Instead, we want the consumers of this struct to interact with it via the Stream API (also, the implementation can change later, and we can replace the slice with something different).

Once we have the struct and interface defined, we can proceed to implement the methods.

A lot of the methods were quite simple and don’t need any explanation.
You can see all the code [here](https://github.com/asankov/go-streams).
Each method is documented, and it also points to the Java alternative.

Most of the methods like `ForEach`, `AnyMatch`, etc.
just iterate over the slice of elements and do the respective action for each element.

## Using the Stream

Now that we have the Stream implemented let's write some fancy code.

We are going to implement the same example I wrote in Java in the beginning of this post.

To constuct a stream use the `Of` or `OfSingle` methods of the `stream` package.
This will return an instance of `SliceStream` with the data we provided.
(Since `SliceStream` is the only existent implementation of `Stream` so far, in the future these methods could return a different implementation.)

```go
import "github.com/asankov/go-streams/stream"

s := stream.Of(1, 2, 3, 4, 5)
    Map(s, func(i int) int { return i * 2}).
    ForEach(fmt.Println)
```

This code creates a `Stream` with the values `[1, 2, 3, 4, 5]`.

In the then `Map`s each value by multiplying it by 2.
The values are now `[2, 4, 6, 8, 10]`

In the end, for each element of the stream it calls `fmt.Println`.

After running this code, we are going to see this output in the console:

```console
2
4
6
8
10
```

Of course, there are many more functions in the package, so you can download it and experiment with it.
To do so, run:

```console
go get github.com/asankov/go-streams
```

and get started!

## Unit-testing the code

Along with the first slice-based implementation I also wrote a unit-test suite that covers >90% of the code.

Most of the tests are in this [file](https://github.com/asankov/go-streams/blob/main/stream/slice_stream_test.go) with more test files in the same directory.

## Leftovers and next steps

There are still some leftovers I would like to resolve at some point.

### Lack of parallel operations

For example, right now the `Parallel` function of the `SliceStream` does not do anything, because the slice stream operations cannot be executed in parallel.
That is because, the slice is not a thread-safe data structure.
In order to implement thread-safe parallel operations I would need to use something like a channel to hold the data.
That should not be that hard and I plan to implement it in the near future.

Non-parallel execution of the operations also means that the `combiner` function in `Collect` and `ReduceWithIdentityAndCombiner` is not used for anything.
I also plan to correct that in the next implementation.

### Missing Iterator and Spliterator

Also, I have not implemented the `Iterator` and `Spliterator` methods, because these including implementing additional data-structures.
Again, I plan to do that next.

### Lack of terminal operations

In Java, a `Stream` can be read only once.
If you have a `Stream` and call a method like `forEach` it will do the operation you called `forEach` with and the `Stream` will be consumed.
Trying to call `forEach` a second time will throw an Exception that the `Stream` has already been consumed.

```java
var stream = Stream.of(1, 2, 3, 4, 5)
stream.forEach(System.out::println) // this line will print all values to the console

stream.forEach(System.out::println) // ❌ java.lang.IllegalStateException: stream has already been operated upon or closed
```

This is because `forEach` is something called terminal operation which consumes the `Stream`, which is no longer usable at that point.

I have not added this in my implementation (so far).

### Lack of lazy evaluation

Another really good thing about `Streams` is that the operations you perform are lazily-evaluated.

That means that if you perform something like `Map` without actually consuming the value (for example with `ForEach` or `FindAny`) the Map operation will not be evaluated.
It will be evaluated only when we try to consume it.

```java
var stream = Stream.of(1, 2, 3, 4, 5)

stream = stream.map(i -> i * 2) // this is not yet evaluated

stream.forEach(System.out::println) // the map operation will only be evaluated once we get to here
```

This brings some performance benefits, because it means that if you accidentally forget to consume the stream all the operations you did with it before will be actually no-ops and won't waste any CPU time.

This is another thing that is missing from my implementation.

## Summary

Go 1.18 introduced a big change in the language [adding support for type-parameters](https://go.dev/blog/intro-generics).

This made it more easy to implement generic data-structures like Streams.

Particularly for Stream, this does not feel like the most Go-like way of working with data.

Indeed, functions are first-class citizens in Go and functional-like programming has always been possible in Go.
But they way functions are passed around in Go is much more verbose that the way to do it in Java:

```go
s.Map(func(i int) string { return "(" + i + ")" })
```

is much more verbose and clunky than:

```java
s.map(i -> "(" + i + ")")
```

because of the necessary `func` and `return` keyword, and need to specify both the arguments and return types (even though they can be inferred.)

Even though, I had a good fun implementing this and finally did something practical with generics (which I was eager to come, having been used to them in my Java time) I don't think that such data structure will be used by many Go programmers (me included) because of the things listen above.

Nevertheless, I still intent to fix all left-overs I outlined in the previous paragraph and have even more fun doing it, so stay tuned for Part 2.

Until then, Merry Christmas and a Happy New Year! 🎅

Enjoyed the post? If you don't want to miss the next one, you can follow me on [Twitter](https://twitter.com/a_sankov) or [LinkedIn](https://www.linkedin.com/in/asankov/).
