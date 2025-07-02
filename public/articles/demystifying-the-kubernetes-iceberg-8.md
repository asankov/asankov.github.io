---
title: "Demystifying the Kubernetes Iceberg: Part 8"
linkTitle: "Demystifying the Kubernetes Iceberg: Part 8"
date: 2022-07-11
description: Kubernetes is like an iceberg. You learn the basics, only to see there is a lot more to learn. The more you learn, the more you see there is to know. This series of articles explains all the concepts listed in the "Kubernetes Iceberg" diagram by Flant.
categories:
  - Kubernetes
aliases:
  - /k8s-p8
---

This is the eighth article of the "Demystifying the Kubernetes Iceberg" series.
My goal for this series is to explain all concepts mentioned in the "Kubernetes Iceberg" diagram by [Flant](https://flant.com/).

This is the iceberg:

![The Kubernetes Iceberg meme](/images/kubernetes-iceberg.png)

In this article, we will look at Tier 8 of the iceberg.
This is the last tier of the iceberg, and it's pretty tiny.
It lists just three concepts.

You can find the other articles here:

- [Part 1](/blog/2022/05/15/demystifying-the-kubernetes-iceberg-part-1/)
- [Part 2](/blog/2022/05/22/demystifying-the-kubernetes-iceberg-part-2/)
- [Part 3](/blog/2022/05/22/demystifying-the-kubernetes-iceberg-part-3/)
- [Part 4](/blog/2022/06/05/demystifying-the-kubernetes-iceberg-part-4/)
- [Part 5](/blog/2022/06/12/demystifying-the-kubernetes-iceberg-part-5/)
- [Part 6](/blog/2022/06/27/demystifying-the-kubernetes-iceberg-part-6/)
- [Part 7](/blog/2022/07/04/demystifying-the-kubernetes-iceberg-part-7/)

This is the last article of this series.

## Tier 8

### Patching control-plane components

A Kubernetes cluster consists of multiple control-plane components that power up the cluster.

When you are upgrading your Kubernetes cluster to a new version, you are upgrading all of these components to the respective version.

However, sometimes you might want to patch just a single component (for example, the `scheduler`).

This can be done in multiple ways.

If you have installed your cluster via `kubeadm`, you can also use `kubeadm` for upgrade and [patching](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches).

Another option, although not a recommended one, would be to manually go to your cluster (for example, via `ssh`) and patch all instances of this component by hand.

### KEPs

[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/README.md) stands for Kubernetes Enhancement Proposal.

It is how the Kubernetes community/team handles discussion for new features or major changes in Kubernetes.

Anyone that wishes to propose one should write a KEP, which will be reviewed and discussed within the community.

### Directly interacting with etcd

[`etcd`](https://etcd.io/) is a distributed key-value store.
By default, Kubernetes uses etcd as the place where all data is persisted.
For example, when we create a Pod resource, that gets persisted into etcd.

It is a good practice to never directly interact with your `etcd` database and let only the API server do that.

However, if you really want to do it, you absolutely can.

This can be done in multiple [ways](https://etcd.io/docs/v3.5/tutorials/how-to-access-etcd/).

#### etcdctl

One is to use the `etcdctl` CLI client.

This command writes the value `"Hello world!"` to the `foo' key:

```shell
etcdctl --endpoints=$ENDPOINTS put foo "Hello, World!"
```

`$ENDPOINTS` is the `etcd` address(es).

After you have written the value, you can retrieve it by:

```shell
$ etcdctl --endpoints=$ENDPOINTS get foo
Hello, world!
```

#### Client libraries

Another way is to use a client library to write a program that interacts with `etcd`.

A complete list of `etcd` client libraries can be found [here](https://etcd.io/docs/v3.5/integrations/#libraries).

## Summary

This is all for part eight and this series.

Thank you to all my readers for sharing this journey with me.
I had great fun writing these articles and learned a lot.
I hope you did too.

If you don't want to miss my articles, you can follow me on [Twitter](https://twitter.com/a_sankov) or [LinkedIn](https://www.linkedin.com/in/asankov/).
