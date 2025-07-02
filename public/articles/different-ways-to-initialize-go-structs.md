---
title: "Different Ways to Initialize Go structs"
linkTitle: "Different Ways to Initialize Go structs"
date: 2022-01-29
description: In this article, we'll take a look at what options Go is giving us to initialize our structs, what are their limitations and how to overcome them.
categories:
  - Go
aliases:
  - /go-structs
---

Many languages like Java, C#, etc. have `constructors` that help you instantiate an object and its properties.

Go does not have ‘constructors’ in the pure sense of the word.
Let's see what Go has instead.

## Build-in options

Out-of-the-box Go gives us 2 ways to initialize structs - struct literals and the `new` build-in function.
Let’s see what these look like for a simple struct named `Person`:

```go
package people

type Person struct {
  age  int
  name string
}

// struct literal
person := &Person{
  age:  25,
  name: "Anton",
}

// new build-in
person := new(Person) // person is of type *Person
person.age = 25
person.name = "Anton"
```

However, in this scenario the `Person` fields are un-exported, thus they cannot be used outside of the `people` package. We can easily mitigate this by exporting them:

```go
// people/person.go
package people

type Person struct {
  Name string
  Age  int
}

// main.go
package main

import "asankov.dev/people"

// struct literal
person := &people.Person{
  Name: "Anton",
  Age:  25,
}

// new build-in
person := new(people.Person) // p is of type *people.Person
person.Name = "Anton"
person.Age = 25
```

But both of these options contain a big trade-off - now all the fields of the person can be viewed and changed by anyone.
Also, we have no validation.
For example, in this scenario, we can easily set the `Age` property to a negative value.

So what can we do if we don’t want to export the fields or enforce additional validation?

## Constructor function

As I said in the beginning, Go does not have constructors.
However, that does not mean we cannot define one ourselves.
Let’s see how a user-defined constructor can look like:

### With positional arguments

We can define a constructor function where the struct fields are positional arguments of the function:

```go
package people

func NewPerson(name string, age int) *Person {
  if age < 0 {
    panic("NewPerson: age cannot be a negative number")
  }
  return &Person{name: name, age: age}
}
```

This provides us 2 benefits:

1. We have validation for the `age` field. If someone tried to create a `Person` with a negative age, they will get a panic with a descriptive error of what they did wrong (we could have also returned an error, but this does not matter for the topic at hand). In the same manner, we could add validation for the `name` field (for example, that it’s not empty).
2. The `Person` internals are decoupled from the initialization logic. For example, we can add an `isUnderage` field to the struct and compute that based on `age` inside of the `NewPerson` function. The consumer of the function won’t have to be bothered with the logic behind this field, because we are taking care of it.

But it also has some downsides. If our `Person` had many `string` fields (for example - multiple names or addresses) this function would have looked like that:

```go
func NewPerson(firstName, lastName, addressLine1, addressLine2 string, age int) *Person
```

and having a function with multiple parameters of the same type is a recipe for disaster.
In this case, the danger is that the consumer of this function can easily misplace any of the parameters (for example, replace the first and last names) and they would have no compile-time check for that.

```go
// is it?
p := NewPerson("Anton", "Sankov", "Bulgaria", "Sofia", 25)
// or?
p := NewPerson("Anton", "Sankov", "Sofia", "Bulgaria", 25)
// or?
p := NewPerson("Anton", "Bulgaria", "Sofia", "Sofia str, number 25", 25)
```

Another, even bigger issue than that is backward compatibility.
Let’s say that we need to add additional fields to our `Person` struct. For example, `salary` (money rules the world, don’t they).
We can easily add it:

```go
package people

type Person struct {
  age    int
  name   string
  salary float64
}

// change
// func NewPerson(name string, age int) *Person {
// to:
func NewPerson(name string, age int, salary float64) *Person {
  if age < 0 || salary < 0 {
    panic("NewPerson: age and salary cannot be negative numbers")
  }
  return &Person{name: name, age: age, salary: salary}
}
```

However, this is a breaking change to the `NewPerson` method. If this were a library, all of the consumers would get compilation errors when they upgrade to the new version. This is definitely not ideal and could have a side-effect of your consumers screaming at you on Twitter.

Is there a way to make this without breaking change?
Yes, of course.
To do this we need to restructure our `NewPerson` function.
Let’s see what are our options.

### With Options struct

We can define `PersonOptions` struct that mirrors the `Person` but with exported field and pass this to `NewPerson`.
Let’s see how this looks like:

```go
package people

type Person struct {
  age    int
  name   string
  salary float64
}

type PersonOptions struct {
  Age    int
  Name   string
  Salary float64
}

func NewPerson(opts *PersonOptions) *Person {
  if opts == nil || opts.Age < 0 || opts.Salary < 0 {
    panic("NewPerson: age and salary cannot be negative numbers")
  }
  return &Person{name: opts.Name, age: opts.Age, salary: opts.Salary}
}
```

This allows us to introduce new fields to `Person` as much as we like without breaking the contract of `NewPerson`.

However, there is another trade-off here: If we add a new field to `Person`(and respectively `PersonOptions`) we cannot easily enforce that all consumers of `NewPerson` will set the new properties.

Of course, we can fail `NewPerson` if any of the new fields are missing, but this is actually a breaking change, not much better than the one in the first example (and even worse, because it will only be caught at runtime).

Another downside here is that it's not obvious which fields from the `PersonOptions` structs are required and which are optional.
The clearest way to communicate this to the consumers is via docstrings, which is not as obvious as just looking at the method signature (because who reads the docs, right).

Possible mitigation to this problem is if we define the required field in `PersonOptions` as value types and the optional ones as refs.
For example:

```go
type PersonOptions struct {
  // Age and Name are required
  Age    int
  Name   string

  // Salary is optional
  Salary *float64
}
```

This way the consumer can set the optional fields to `nil` and not bother with default values.
It is also a bit more clear what is required and what is not.

### Variadic function constructor

Alternative to that is to make our constructor a variadic function that accepts an arbitrary number of mutating functions.
Then, the implementation of the method will run all the functions one by one on an instance of the struct which will be returned by the constructor.
This means, we also need to provide a set of functions that will mutate the fields.

If you did not understand anything from this explanation, don’t worry.
Here’s how the code looks like:

```go
package people

type PersonOptionFunc func(*Person)

func WithName(name string) PersonOptionFunc {
  return func(p *Person) {
    p.name = name
  }
}

func WithAge(age int) PersonOptionFunc {
  return func(p *Person) {
    p.age = age
  }
}

func NewPerson(opts ...PersonOptionFunc) *Person {
  p := &Person{}
  for _, opt := range opts {
    opt(p)
  }
  return p
}

// usage:
p := people.NewPerson(people.WithName("Anton"), people.WithAge(25))

fmt.Println(p) // {name: "Anton", age: 25}
```

The downside here is that the amount of `WithXXX` functions are not obvious, and the consumers of the package would either have to search them in the package documentation or depend on their IDE autocomplete to show them the possible options.

In my opinion, it does not give you any benefits over the `Options` struct, but bring the downside that the options are not obvious.

### Middle ground

A middle ground between constructor with required positional arguments and optional arguments would be to have the required fields for a given struct as positional arguments so that the consumer MUST pass them, and have everything else as optional parameters, which may be skipped.

```go
func NewPerson(name string, options *PersonOptions) *Person {
  p := &Person{name: name}
  if options == nil {
    return p
  }
  if options.Age != 0 /* OR options.Age != nil */ {
    p.age = options.Age /* OR p.age = *options.Age */
  }
  if options.Salary != 0 /* OR options.Salary != nil */  {
    p.salary = options.Salary /* OR p.salary = *options.Salary */
  }
  return p
}

// usage:
p := NewPerson("Anton", &people.PersonOptions{Age: 25})

fmt.Println(p) // {name: "Anton", age: 25}
```

## Summary

There are 2 build-in ways to initialize a Go struct.
Both are quite limited and more often than not they are not enough.
That is why people came up with more sophisticated solutions (based on the built-in ones).

## Takeaways

So what is the best option?
Well, there isn’t one.
All described approaches have their pros and cons.
They depend on your use case and the way your code is meant to be used.
As with everything in computer science, there is not a single correct solution or a silver bullet.
It’s all a matter of the tradeoffs you are willing to make.

If you are writing a library that will be used by hundreds of other projects, backwards-incompatible changes will not be appreciated by your consumers, so you need to choose the more flexible options.
If you’re working locally in a single codebase, signature changes can be beneficial, because they will enforce that all usages of the methods are adapted.

If you got to the end of the article, I just want you to know that I recently started this blog,
and this is the first article in it.
If it was useful for you, you learned something new, or you think it can be improved feel free to ping me on [Twitter](https://twitter.com/a_sankov), [LinkedIn](https://linkedin.com/in/asankov) or [email](mailto:asankov96+initgo@gmail.com).
I would appreciate the feedback.
