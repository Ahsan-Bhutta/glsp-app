# Eclipse GLSP Examples

This repository contains code examples that demonstrate how to build diagram editors with the Graphical Language Server Platform (GLSP).
The examples are focused on the integration of GLSP editors with the cloud-based Eclipse Theia IDE using the GLSP Theia integration and the Java based [GLSP Server].

Each example is self-contained and provides both, an example diagram client (`glsp-client` directory) and its corresponding GLSP server (`glsp-server` directory).

## Prerequisites

The following libraries/frameworks need to be installed on your system:

-   [Node.js](https://nodejs.org/en/) `>=16.11.0`
-   [Yarn](https://classic.yarnpkg.com/en/docs/install#debian-stable) `>=1.7.0 < 2.x.x`
-   [Java](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) `>=17`
-   [Maven](https://maven.apache.org/) `>=3.6.0`

The examples are heavily interwoven with Eclipse Theia, so please also check the [prerequisites of Theia](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

The web-based/client part of the examples has been developed using [Visual Studio Code](https://code.visualstudio.com/) and the server/java part has been developed with the [Eclipse IDE](https://www.eclipse.org/ide/).
However, it's of course also possible to use any other IDE or text editor.

## Examples

-   [Project Templates](project-templates): The best starting point for your own diagram editor project.
    The project templates are available for several combinations of tool platform integrations (Theia, VS Code), source models (JSON, EMF) and servers (Node, Java). Please visit the [GLSP documentation](https://www.eclipse.org/glsp/documentation/gettingstarted/) for more information.

-   [Workflow Example](workflow): A consistent example provided by all GLSP components.
    It implements a simple flow chart diagram editor with different types of nodes and edges.

## Building the examples & project templates

To build all examples & project templates simply execute the following in the repository root:

```bash
yarn build
```

In addition, it is also possible to build each example or template individually:

```bash
yarn build:workflow
yarn build:node-json-vscode

```

## Running & Debugging the examples

Each example and project template contains a dedicated README with detailed instructions on how to run und debug them.

## Integration with other platforms

The general GLSP Client code is separated from the Theia specific glue code and located in a dedicated package with `-glsp` prefix (e.g. `workflow-glsp`).
This package can be easily reused when the package should be integrated with any other platform.

For a reference implementation of a example specific glue code package please checkout the `project templates`.
