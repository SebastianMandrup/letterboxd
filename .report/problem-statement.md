### Synopsis

This project aims to develop a development environment for a Letterboxd-style social media platform based around a movie-review domain. The focus of this project is not the application itself, its code line by line, but rather the infrastructure, methods, workflows, and automation built around the project to test, do version control, and deploy it.

The report begins by introducing the motivation behind a robust development environment and formulating a problem statement that addesses both practical challenges and reflective questions about software quality, workflows, and our choice of tools.

The methodology section outlines the conceptual tools guiding the project, such as version control as a method, requirement specifications, risk analysis, ticket systems, build automation, and process isolation.

The analysis section breaks the project down into requirements, risks, user stories, constraints, forming the basis for later design decisions, it includes comparative studies of branching models, CI/CD strategies, and containerization approaches. 

In the design section, the system architecture is presented, a dockerized setup of an nginx web server as a proxy, a noje.js application server, and a mysql database. The section justifies key design decisions and discusses alternatives.

The implementation section demonstrates how these design decisions were realized using github, docker, github actions, automated testing and linting, and continuous deployment to a VPS by pulling our docker image. Pipeline configurations, Dockerfiles, and branch workflows are explained and linked to the earlier analysis.

The report concludes by answering the problem statement explicitely and reflecting on the effectiveness of the chosen methods, their value to the development environment and finally how it could be improved or extended in furture iterations. 

### Problem Statement

As developers working on a full stack application, such as our example of a letterboxd clone, we often face challenges in maintaining code quality and consistency. Without a proper development environment we risk slow iteration cycles and can't deploy updates reliably. In previous projects I have often relied on manual processes in the deployment process, in contrast this project aims to design and implement a modern and automated development environment that supports its developers. 

This project aims to solve this by implementing a dockerized web application consisting of a web server, application server, and a database server. THe environment surrounding it will provide version control workflows, software quality assuarance, and a CI/CD pipeline. The goal is to improve reliability and software quality throughout the application's lifecycle. 

This project seeks to explore:
- which practices contribute the most to software quality?
- how these methods improve maintainability?
- what the trade-offs are between different development workflows?
- how automation and containerization reduce risk and their limitations?

The problem statement can be summarized as follows:
"How can a development environment be designed and implemented to ensure software quality, maintainability, and reliable delivery for a letterboxd-style web application?"

And furthermore:
"Which methods and architectural decisions most effectively support these goals?"