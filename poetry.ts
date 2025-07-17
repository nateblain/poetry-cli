import inquirer from 'inquirer';

type Poem = {
  title: string;
  author: string;
  lines: string[];
  linecount: number;
};

const BASE_URL = 'https://poetrydb.org/';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

const logError = (errorMessage: string) => {
  console.error(`${RED}Error: ${errorMessage}${RESET}`);
  void main();
};

const logInfo = (message: string) => {
  console.log(`${BLUE}${message}${RESET}`);
};

const logSuccess = (message: string) => {
  console.log(`${GREEN}${message}`);
};

const fetchPoems = async (author?: string, title?: string): Promise<Poem[]> => {
  let pathDelimitedQueryKeys = '';
  let pathDelimitedQueryValues = '';
  let url = `${BASE_URL}`;

  if (author && title) {
    pathDelimitedQueryKeys = 'author,title';
    pathDelimitedQueryValues = `/${encodeURIComponent(author)};${encodeURIComponent(title)}`;
  } else if (author) {
    pathDelimitedQueryKeys = 'author';
    pathDelimitedQueryValues += `/${encodeURIComponent(author)}`;
  } else if (title) {
    pathDelimitedQueryKeys = 'title';
    pathDelimitedQueryValues += `/${encodeURIComponent(title)}`;
  }
  const finalUrl = `${url}${pathDelimitedQueryKeys}${pathDelimitedQueryValues}`;

  const response = await fetch(finalUrl);

  if (response.status !== 200) {
    throw new Error(
      `Failed to fetch data from PoetryDB. Request failed with status ${response.status}`,
    );
  }

  const result = await response.json();

  if (result.status === 404) {
    throw new Error(`No poems found for author: ${author} and title: ${title}`);
  }

  return result;
};

const logPoems = (poems: Poem[]) => {
  if (poems.length === 0) {
    void main();
    return;
  }

  poems.forEach((poem, index) => {
    logSuccess(`\nPoem #${index + 1}`);
    logSuccess(`Title: ${poem.title}`);
    logSuccess(`Author: ${poem.author}`);
    logSuccess(`Lines:\n${poem.lines.join('\n')}${RESET}`);
  });
  void main();
};

const getMessage = (type: 'author' | 'title') => {
  const text = type === 'author' ? 'author name' : 'poem title';
  return `Enter ${text} (do not use quotes and leave blank if not searching by ${text}):`;
};

const promptForPoemDetails = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'author',
      message: getMessage('author'),
    },
    {
      type: 'input',
      name: 'title',
      message: getMessage('title'),
    },
  ]);
};

const main = async () => {
  const answers = await promptForPoemDetails();
  const { author, title } = answers;

  if (!author && !title) {
    logError(`Error: Must provide at least an author or a title.`);
  }

  try {
    if (author && title) {
      logInfo(`\nFetching poems by author: ${author}`);
      const authorPoems = await fetchPoems(author, title);
      logPoems(authorPoems);
    } else if (author) {
      logInfo(`\nFetching poems by author: ${author}`);
      const authorPoems = await fetchPoems(author);
      logPoems(authorPoems);
    } else if (title) {
      logInfo(`\nFetching poem by title: ${title}`);
      const titlePoems = await fetchPoems(undefined, title);
      logPoems(titlePoems);
    }
  } catch (err: any) {
    logError(err.message);
  }
};

void main();
