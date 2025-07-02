---
title: "Securing Kubernetes with Open Policy Agent"
linkTitle: "Securing Kubernetes with Open Policy Agent"
date: 2022-04-21
description: Build-in Kubernetes security is not enough for most organizations to enforce granular rules and policies to the workloads running in their clusters. That is why projects like OPA and Gatekeeper exist to help you achieve a higher level of Kubernetes security
categories:
  - Kubernetes
  - Open Policy Agent
  - Gatekeeper
  - Security
aliases:
  - /k8s-sec-opa
---

Over the past 8 years, Kubernetes became the de-facto standard for deploying and managing containerized applications.
This requires that the platform on which we build our apps (Kubernetes) be just as secure as our applications.

Kubernetes gives you some security out-of-the-box and it also gives you methods for extending that yourself.
Let's see what these are.

## Build-in Kubernetes Security (RBAC)

What you get out of the box with Kubernetes is an [RBAC (Role-Based Action Control)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) mechanism, which allows you to define roles that can perform certain actions on the Kubernetes resources.
For example, you can define a `Developer` role that can `Get/List Deployments` and a `DevOps` role that can additionally `Create/Update Deployments`.

## Why RBAC is not enough

Usually, that is not enough for most Kubernetes users.
The reason is that most organizations that use Kubernetes want to enforce more granular rules on their resources.
For example, they want to enforce that only images from trusted repositories are used as the base for Deployments, or that all workloads have proper resource limits.
This is not possible via RBAC.

## Beyond RBAC

That is why Kubernetes has a pluggable mechanism for deploying additional validation for your resources.
These are called [validating webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/) which allow you to register a webhook that will be called by Kubernetes to check whether a given resource can be created/updated.

How this works is - you register a webhook that Kubernetes will call when objects are being interacted via (e.g. `CREATE` or `UPDATE` operation).
Kubernetes will send a request to the webhook, passing the object in the request body and it will expect to receive a response that should tell Kubernetes whether or not this resource should be created/updated.

UPCOMING: An article that describes in more detail how validating webhooks work and how to write your own.

You can write your own admission webhook from scratch or use [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) which allows you to deploy custom policies, written in [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/) and evaluated by [Open Policy Agent](https://www.openpolicyagent.org/).

## Open Policy Agent

[Open Policy Agent](https://www.openpolicyagent.org/) is a general-purpose policy agent that evaluates JSON input against rules, written in Rego, and returns a JSON output based on the evaluation.

## Rego

Rego is a declarative query language that can be used to write policies about the data coming into the system.

A simple Rego rule that checks if the conference name of the input document is "BSides":

```rego
package bsides

default allow = false

allow = true {
    input.conference.name = "BSides"
}
```

If you want to play with the examples in the Rego playground, use the links in the `Link` column.

| Input                                      | Output             | Playground link                                       |
| ------------------------------------------ | ------------------ | ----------------------------------------------------- |
| `{"conference":{"name": "BSides"}}`        | `{"allow": true}`  | [Link](https://play.openpolicyagent.org/p/OqvsvG5BU7) |
| `{"conference":{"name": "SomethingElse"}}` | `{"allow": false}` | [Link](https://play.openpolicyagent.org/p/SzGf67ckQg) |

A bit more complex rule that checks if the conference name is "BSides" and the conference venue is "UNWE" and if not outputs a message:

```rego
package bsides

violations[{"msg": msg}] {
    input.conference.name != "BSides"
    input.conference.venue != "UNWE"
    msg = sprintf("name and venue are wrong - [%s, %s]", [input.conference.name, input.conference.venue])
}
```

However, the message is only shown if both checks are true, e.g. it will not output anything if only one of the values is wrong:

| Input                                                                | Output                                                                                   | Correct | Playground link                                       |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `{"conference":{"name": "BSides", "venue": "UNWE"}}`                 | `{"violations": []}`                                                                     | ✅      | [Link](https://play.openpolicyagent.org/p/wY3h6EN6Dj) |
| `{"conference":{"name": "SomethingElse", "venue": "SomethingElse"}}` | `{"violations": [{"msg": "name and venue are wrong - [SomethingElse, SomethingElse]"}]}` | ✅      | [Link](https://play.openpolicyagent.org/p/JeV5Yg2mlw) |
| `{"conference":{"name": "SomethingElse", "venue": "UNWE"}}`          | `{"violations": []}`                                                                     | ❌      | [Link](https://play.openpolicyagent.org/p/ZPS6QPZZD7) |
| `{"conference":{"name": "BSides", "venue": "SomethingElse"}}`        | `{"violations": []}`                                                                     | ❌      | [Link](https://play.openpolicyagent.org/p/Xo4jlfyFii) |

In this case, this is not what we want, we want to have an error message if at least one of the two values is wrong.

However, Rego rules work by just chaining the expressions in an `AND` statement.

That is why, if we want to achieve this result, we need to tweak the rule a bit:

```rego
package bsides

violations[{"msg": msg}] {
    input.conference.name != "BSides"
    msg := "name is wrong"
}

violations[{"msg": msg}] {
    input.conference.venue != "UNWE"
    msg := "venue is wrong"
}
```

| Input                                                              | Output                                                                  | Correct | Playground link                                       |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| `{"conference":{"name": "BSides", "venue": "UNWE"}}`               | `{"violations": []}`                                                    | ✅      | [Link](https://play.openpolicyagent.org/p/WMxPOAnMqR) |
| `{"conference":{"name": "SomethingElse", venue: "SomethingElse"}}` | `{"violations": [{"msg": "name is wrong"}, {"msg": "venue is wrong"}]}` | ✅      | [Link](https://play.openpolicyagent.org/p/bOYYXRjkhY) |
| `{"conference":{"name": "SomethingElse", venue: "UNWE"}}`          | `{"violations": [{"msg": "name is wrong"}]}`                            | ✅      | [Link](https://play.openpolicyagent.org/p/iVHjvE6C4c) |
| `{"conference":{"name": "BSides", venue: "SomethingElse"}}`        | `{"violations": [{"msg": "venue is wrong"}]}`                           | ✅      | [Link](https://play.openpolicyagent.org/p/UB8NwmJ5e4) |

This covers rules all possibilities and we have at least one error message if some of the values are wrong.

**NOTE:** This is not a bug or a deficiency in Rego, this is just how Rego rules work and something we should be aware of when using the language.

## Gatekeeper

As said, Open Policy Agent is a general-purpose policy engine that has nothing to do with Kubernetes.

To use it with Kubernetes, we need an adapter that will be the bridge between OPA and Kubernetes.

That adapter is called [Gatekeeper](https://github.com/open-policy-agent/gatekeeper).
It serves as the bridge between Kubernetes and OPA.
It implements a Validating Webhook, allowing it to be called by Kubernetes to determine whether a resource can be created/updated.
Also, it provided the object data to the Rego policy so that when we are writing our policies we can expect to get the whole object data provided by Gatekeeper.

It also allows storing the policies as Custom Kubernetes objects (CRDs).
That way, our policies, and rules become first-class citizens of our Kubernetes cluster.

More about what CRDs are you can read here - <https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/>.

### ConstraintTemplates

`ConstraintTemplates` are Kubernetes objects - Custom Resource Definitions (CRDs) that are installed with Gatekeeper.

They wrap a Rego policy and define input parameters for the policy.
This allows for a `ConstraintTemplates` to be reused with different parameters.

A sample `ConstraintTemplate` looks like this:

```yaml
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
      validation:
        # Schema for the `parameters` field
        openAPIV3Schema:
          type: object
          properties:
            labels:
              type: array
              items:
                type: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels

        violation[{"msg": msg, "details": {"missing_labels": missing}}] {
          provided := {label | input.review.object.metadata.labels[label]}
          required := {label | label := input.parameters.labels[_]}
          missing := required - provided
          count(missing) > 0
          msg := sprintf("you must provide labels: %v", [missing])
        }
```

This `ConstraintTemplate` wraps a Rego policy that checks whether a given Kubernetes resource has a set of required labels.

The exact set is contained in the `input.parameters.labels` field.
The reason that we store the required labels in this parameter instead of hard-coding them into the policy is that this way we can reuse the `ConstraintTemplate` with another set of required labels.

We will see where this parameter comes from soon.

### Constraint

After you apply the `ConstraintTemplate` from above, Gatekeeper will register a new CRD into your cluster.

The name of that CRD is in the `spec.crd.spec.names.kind` field of the `ConstraintTemplate`.
In our case, it's `K8sRequiredLabels`.

To start enforcing this policy we will need to create an instance of this CRD, in which we will specify when to invoke the rule and what are the required labels.

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: deployments-must-have-gk
spec:
  match:
    kinds:
      - apiGroups: ["*"]
        kinds: [“Deployments"]
  parameters:
    labels: ["gatekeeper"]
```

This resource specifies that this policy must be invoked when `Deployments` are being interacted with.

It also specifies that the required labels are `["gatekeeper"]`.

Now, if we try to create a deployment, Gatekeeper will use OPA to check whether the deployment has the required labels.
If not, Gatekeeper will deny the creation of this resource, and Kubernetes will respect this decision, returning an error to the user.

### Getting our hands dirty

Let's see all of this in practice.

**NOTE:** All of the resources I create below can be found in [this GitHub repo](https://github.com/asankov/securing-kubernetes-with-open-policy-agent).
To follow the demo you can clone the repo and use the Kubernetes spec files or just reference them via their GitHub links.
Both ways are shown in the examples.

#### Installing Gatekeeper

First, we need to install Gatekeeper into our cluster.

To do that apply this Kubernetes resource:

```sh
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/release-3.7/deploy/gatekeeper.yaml
```

**NOTE:** This link is taken for the official docs at <https://open-policy-agent.github.io/gatekeeper/website/docs/install/>.
If it gets outdated and it does not work, consult the actual docs.

#### Creating a ConstraintTemplates

Apply the `ConstraintTemplate` YAML:

```sh
kubectl apply -f k8s/constraint-template.yaml
```

or if you haven't cloned the repo:

```sh
kubectl apply -f https://raw.githubusercontent.com/asankov/securing-kubernetes-with-open-policy-agent/main/k8s/constraint-template.yaml
```

This should create the `ConstraintTemplate` and also register the `K8sRequiredLabels` CRD.

Check that by running:

```sh
$ kubectl get constrainttemplates.templates.gatekeeper.sh
NAME                AGE
k8srequiredlabels   119s
```

and

```sh
$ kubectl get crds
NAME                                                    CREATED AT
...
k8srequiredlabels.constraints.gatekeeper.sh             2022-04-09T20:49:22Z
...
```

You should see the `k8srequiredlabels` constraint template and CRD in the output of these commands.

#### Creating a Constraint

To start enforcing this `ConstraintTemplate` create the actual `Constraint`:

```sh
kubectl apply -f k8s/constraint.yaml
```

or if you haven't cloned the repo:

```sh
kubectl apply -f https://raw.githubusercontent.com/asankov/securing-kubernetes-with-open-policy-agent/main/k8s/constraint.yaml
```

This should create the `K8sRequiredLabels` resource.

Check that by running:

```sh
$ kubectl get k8srequiredlabels.constraints.gatekeeper.sh
NAME                       AGE
deployments-must-have-gk   8s
```

You should see the `deployments-must-have-gk` constraint output.

#### Creating a non-compliant resource

The moment of truth!
We have created our `ConstraintTemplate` and our `Constraint` so our security should be in place.
Let's try to create a Deployment that does not comply with this rule and see what happens.

```sh
kubectl apply -f k8s/non-compliant-deployment.yaml
```

or

```sh
kubectl apply -f https://raw.githubusercontent.com/asankov/securing-kubernetes-with-open-policy-agent/main/k8s/non-compliant-deployment.yaml
```

In both cases the result should be:

```sh
$ kubectl apply -f k8s/non-compliant-deployment.yaml
Error from server ([deployments-must-have-gk] you must provide labels: {"gatekeeper"}): error when creating "non-compliant-deployment.yaml": admission webhook "validation.gatekeeper.sh" denied the request: [deployments-must-have-gk] you must provide labels: {"gatekeeper"}
```

Our deployment cannot be created, because it does not comply with our rule.

What happened in more detail was:

- we invoked `kubectl` to try to create the deployment
- `kubectl` parsed the `non-compliant-deployment.yaml` file, serialized it into JSON, and send a POST request to the Kube API server
- the Kube API server parsed the request
- it checked whether we have the necessary RBAC permission to perform this operation (we do)
- it called all validating webhooks registered for this type of operation (`action:CREATE`, `resource:Deployment`)
- one of these validating webhooks is `gatekeeper-validating-webhook-configuration` (the one coming from Gatekeeper)
- once Kubernetes called Gatekeeper, Gatekeeper checked what constraint it had for this operation (`action:CREATE`, `resource:Deployment`)
- the only and only constraint was `deployments-must-have-gk` (which has `k8srequiredlabels` for constraint template)
- Gatekeeper called OPA with the policy from `k8srequiredlabels` constraint template, passing as input the deployment being created and the parameters from the `deployments-must-have-gk` constraint
- OPA evaluated the policy and the input, giving as output `violations` array with one item
- Gatekeeper got the output from OPA, determined that this resource cannot be created, and returned a response to the Kube API server that this operation is not allowed
- the Kube API server aborted the operation and returned an error
- `kubectl` outputs the error on the screen

#### Fixing the violation

The output is clear on where we are wrong and what we need to correct to create this resource.
Let's do that.

We have the same deployment with the additional labels in [`compliant-deployment.yaml`](k8s/compliant-deployment.yaml).

Let's apply this file:

```sh
kubectl apply -f k8s/compliant-deployment.yaml
```

or

```sh
kubectl apply -f https://raw.githubusercontent.com/asankov/securing-kubernetes-with-open-policy-agent/main/k8s/compliant-deployment.yaml
```

In both cases the result should be:

```sh
$ kubectl apply -f k8s/compliant-deployment.yaml
deployment.apps/non-compliant created
```

## Summary

Build-in Kubernetes security is not good enough for organizations that want to enforce granular policies on their resources.

That is why Kubernetes has a pluggable mechanism for deploying additional validation for your resources.

This gets even easier when you add Open Policy Agent and Gatekeeper.

Gatekeeper provides all the plumbing, regarding the communication between Kubernetes and OPA. OPA provides a powerful policy agent that will evaluate your resources against rules written in the Rego language.

If you liked this article, you can follow me on [Twitter](https://twitter.com/a_sankov) and [LinkedIn](https://www.linkedin.com/in/asankov/) for more content like this.
