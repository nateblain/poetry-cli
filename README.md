# Poetry App

## Overview
The poetry cli allows us to fetch poetry data from the PoetryDB API. It provides a simple interface to search by author and/or poem title.

## Installation
Prerequisites:
- Have Node.js and npm installed. 
- Note: Node.js v24.4.1 and npm v11.4.2 were used when developing this application. Most more recent versions of Node should work with the project but installing these versions may avoid any issues.

To install the Poetry App, clone the repository and run the install command from the root directory of the project:
```bash
git clone git@github.com:nateblain/poetry-cli.git
```

```bash
npm install poetry-cli
```

## Usage
To use the Poetry App, you can run the following command in your terminal from the root directory of the project:

```bash
npx ts-node poetry.ts
```

You will then be prompted to optionally enter an author name and/or a poem title.

