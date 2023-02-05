---
title: CV
linkTitle: CV
menu:
  main:
    weight: 40
layout: cv
type: cv

name: Anton Sankov
bio: Senior Software Engineer, currently dedicated to the Cloud Native Security space.
mail: asankov96@gmail.com
github: asankov
companies:
  - name: VMware Carbon Black
    location: Sofia, Bulgaria (remote team)
    positions:
    - position: Senior Member of Technical Staff
      dates: January 2022 - Present
    - position: Member of Technical Staff
      dates: June 2020 - January 2022
    info: |
      <div> At VMware I worked on the Carbon Black Cloud Container Security product, which provides end-to-end Kubernetes Security (supply-chain to runtime).
      During my time there I worked on all 3 parts of the Container Security Portfolio:
      </div>
      <ul>
        <li> <span class="bold">Hardening</span>: detecting misconfigurations in Kubernetes resources and enforcing policies for them </li>
        <li> <span class="bold">Image Scanning</span>: scanning container images, integrated with Hardening, ability to block images from being deploy depending on the number of vulnerabilities </li>
        <li> <span class="bold">Runtime</span>: runtime monitoring and protection, detecting anomalies in network activity during the runtime lifecycle of the app </li>
      </ul>
    responsibilities:
    - write clean and maintainable code, do code reviews, onboard new team members
    - communicate with internal and external stakeholders (PM, UX, QA, customers)
    - communicate with other teams regarding work on shared components
    - write technical documents (RFCs/JEDIs/TASAs, Engineering Analysis, customer-facing product documentation)
    - present the work of our team on BU-wide meetings and demos, and also external events
    - participate in the hiring process - interview people for my and other teams, helped grow the BU in Sofia from 4 to >100 people
    - participate in <a href="https://www.vmware.com/content/microsites/talentboost/home.html" target="_blank">Talent Boost</a> - VMware Academy for students
    - all of that work was done in a remote team across Bulgaria, Israel, India and USA
    tech: Go, gRPC, Kubernetes, Helm, MongoDB, Terraform, Kafka
    list:
      - micro-services written in Go and deployed into Kubernetes
      - Helm charts for both internal services and customer facing (for deploying client-side components)
      - client-side components running in the customers' clusters - a Kubernetes operator for installing the product, validating and admission webhook and others
      - CLI for scanning container images and validating resources - shipped as both a binary and a container
  - name: Docker Inc./ Mirantis Inc.
    location: Sofia, Bulgaria (remote team)
    positions:
    - position: Software Engineer
      dates: August 2019 - June 2020
    info: |
      At Docker I worked on a few products, part of the Docker Enterprise (Docker EE) stack. In November 2019 that part of the company was acquired by Mirantis and I was included in the acquisition. Due to the dynamic nature of the events that were happening during my time there I switched a few teams and worked on a few different products while in the company:
      <ul>
        <li> SaaS multi-cluster management product - part of Docker EE stack. Scrapped after the acquisition.</li>
        <li> Integrating <a href="https://istio.io/latest/docs/tasks/traffic-management/ingress/" target="_blank">Istio Ingress</a> into <a href="https://www.mirantis.com/software/mirantis-kubernetes-engine/" target="_blank">UCP (Universal Control Plane)</a> - Kubernetes/Swarm distro, part of Docker EE </li>
        <li> <a href="https://docs.mirantis.com/mke/3.5/launchpad.html" target="_blank">Launchpad</a> - CLI tool for installing Docker EE products </li>
      </ul>

    responsibilities:
    - write clean and maintainable code, do code reviews, onboard new team members
    - communicate with internal and external stakeholders (PM, UX, QA)
    - write technical documents (RFCs/JEDIs/TASAs, Engineering Analysis, customer-facing product documentation)
    - "present the work of our team in company-wide meetings and demos"
    tech: Go, gRPC, Docker, Kubernetes, PostgreSQL
  - name: Paysafe
    location: Sofia, Bulgaria
    positions:
    - position: Software Engineer
      dates: May 2018 - August 2019
    info: At Paysafe I worked on integrating crypto-currency trading into the company's two digital wallets - Skrill and Neteller.
    responsibilities:
    - write clean and maintainable code, do code reviews, onboard new team members
    - do full-stack work - both back-end and front-end
    - communicate with internal and external stakeholders (PM, UX, Legal, Compliance, Accounting)
    - participate in the hiring process - interview people for my team, helped grow the team from 4 to 20 people
    - present the work of our team in company-wide meetings and demos
    tech: Java SE/EE, Spring (Boot) - Netflix Stack, SQL, Angular 2+
  - name: SAP Labs Bulgaria
    location: Sofia, Bulgaria
    positions:
    - position: Software Engineering Intern
      dates: June 2017 - December 2017
    info: At my first actual job in IT I worked on the provisioning framework of SAP Cloud Platform.
    responsibilities:
    - started the internship with a month of learning and building my own project
    - after that, I joined the team and worked full-time on the team's priorities
    - write clean and maintainable code, do code reviews (but mostly be on the receiving side of the code reviews)
    - do full-stack work - both back-end and front-end
    - learn how to work in a team
    tech: Java EE, SAP Cloud Platform, SAP UI5

conferences:
  - name: VMware Explore 2022
    date: November 2022
    location: Barcelona, Spain
    talks:
    - type: Panel
      name: Day in The Life of a Cross Functional Security War Room
      summary: |
        A War Room simulation where different security people are investigating a hacker attack against their company using VMware products.
        My role was the SOC engineer who is using Carbon Black Container Security to investigate the attack on the company's Kubernetes workloads.
      links:
        notes: https://blogs.vmware.com/explore/2022/10/27/day-0-the-security-mindset-changing-the-way-you-think-about-enterprise-security/
  - name: KubeHuddle 2022
    date: October 2022
    location: Edinburgh, Scotland
    talks:
    - name: Securing Kubernetes with Open Policy Agent
      summary: |
        This talk explains why admission control in Kubernetes clusters is important, and what bad things can happen due to workload misconfiguration.
        Then it guides the audience on how to implement proper admission control using two open-source projects - <a href="https://www.openpolicyagent.org/" target="_blank">Open Policy Agent</a> and <a href="https://github.com/open-policy-agent/gatekeeper" target="_blank">Gatekeeper</a>.
      links:
        youtube: https://www.youtube.com/live/DcOYB4cUM9U?feature=share&t=12186
        notes: https://github.com/asankov/securing-kubernetes-with-open-policy-agent/tree/main/2022/kubehuddle-edinburgh
        slides: https://github.com/asankov/securing-kubernetes-with-open-policy-agent/blob/main/2022/kubehuddle-edinburgh/presentation.pdf
  - name: OSCAL 2022
    date: June 2022
    location: Tirana, Albania
    talks:
    - name: Securing Kubernetes with Open Policy Agent
      summary: |
        This talk explains why admission control in Kubernetes clusters is important, and what bad things can happen due to workload misconfiguration.
        Then it guides the audience on how to implement proper admission control using two open-source projects - <a href="https://www.openpolicyagent.org/" target="_blank">Open Policy Agent</a> and <a href="https://github.com/open-policy-agent/gatekeeper" target="_blank">Gatekeeper</a>.
      links:
        notes: https://github.com/asankov/securing-kubernetes-with-open-policy-agent/tree/main/2022/oscal-tirana
        slides: https://github.com/asankov/securing-kubernetes-with-open-policy-agent/blob/main/2022/oscal-tirana/presentation.pdf
    - name: Go 101
      type: Workshop
      with: Boris Stoyanov
      summary: |
        Workshop for people that want to learn Go. No prior experience in the language is required, but experience with another programming language is.
        The workshop is three-hours long, it starts with defining a functions, variables, etc. and ends with writing complex structs and attaching some sort of behavior to them.
      links:
        notes: https://github.com/asankov/go-101-workshop
  - name: BSides Sofia 2022
    date: April 2022
    location: Sofia, Bulgaria
    talks:
    - name: Securing Kubernetes with Open Policy Agent
      summary: |
        This talk explains why admission control in Kubernetes clusters is important, and what bad things can happen due to workload misconfiguration.
        Then it guides the audience on how to implement proper admission control using two open-source projects - <a href="https://www.openpolicyagent.org/" target="_blank">Open Policy Agent</a> and <a href="https://github.com/open-policy-agent/gatekeeper" target="_blank">Gatekeeper</a>.
      links:
        youtube: https://www.youtube.com/watch?v=JewdgJASVxI
        notes: https://github.com/asankov/securing-kubernetes-with-open-policy-agent/tree/main/2022/bsides-sofia
        slides: https://github.com/asankov/securing-kubernetes-with-open-policy-agent/blob/main/2022/bsides-sofia/presentation.pdf
  - name: ISTA 2021
    date: November 2021
    location: Virtual
    talks:
    - name: "Kubernetes Extensibility: Next Phases of Kubernetes"
      summary: |
        This talk showcases Kubernetes Extensibility constructs like Operators, CRDs, validating webhooks, etc. and shows how they can be leveraged to use Kubernetes as a development platform.
      links:
        youtube: https://www.youtube.com/watch?v=yim8NnYjODY
        notes: https://github.com/asankov/kubernetes-extensibility
        slides: https://github.com/asankov/kubernetes-extensibility/blob/main/slides.pptx
  - name: HackConf 2021
    date: October 2021
    location: Virtual
    talks:
    - name: Go 101
      type: Workshop
      with: Boris Stoyanov
      summary: |
        Workshop for people that want to learn Go. No prior experience in the language is required, but experience with another programming language is.
        The workshop is three-hours long, it starts with defining a functions, variables, etc. and ends with writing complex structs and attaching some sort of behavior to them.
      links:
        notes: https://github.com/asankov/go-101-workshop
  - name: DevConf.CZ 2020
    date: January 2020
    location: Brno, Czech Republic
    talks:
    - name: Building The Twelve-Factor App
      summary: |
        This talks explains <a href="https://12factor.net/" target="_blank">The Twelve-Factor App methodology</a> and why it is still relevant today in the world of Kubernetes, containers and microservices.
      links:
        youtube: https://www.youtube.com/watch?v=xyeXx2qtfLI
        slides: https://asankov.dev/twelve-factor-app/#/
  - name: OpenExpo Europe 2019
    date: June 2019
    location: Madrid, Spain
    talks:
    - name: Building The Twelve-Factor App
      summary: |
        This talks explains <a href="https://12factor.net/" target="_blank">The Twelve-Factor App methodology</a> and why it is still relevant today in the world of Kubernetes, containers and microservices.
---