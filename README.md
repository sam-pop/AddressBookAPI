# AddressBookAPI

RESTful addressbook API w/ Node.js, express.js and elasticsearch.

## API Definition

**GET** /contact?pageSize={}&page={}&query={}

This endpoint provides a listing of all contacts.

- _pageSize_ - the number of results allowed back in each page.

- _page_ - offset by page number to get multiple pages

- _query_ - search term for elasticsearch string query

**POST** /contact

This endpoint creates the contact. _name should be unique_.

**GET** /contact/{name}

This endpoint returns the contact by a unique name.

**PUT** /contact/{name}

This endpoint updates the contact by a unique name.

**DELETE** /contact/{name}

This endpoint deletes the contact by a unique name.

## Enviorment Variables

Below is a list of the environment variables that are used across the project (using _process.env_)

```
# API server port
PORT=3001

# elasticsearch
INDEX=addressbook
TYPE_DOCUMENT=contact
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_HOST=localhost

# API DEFAULT VALUES
PAGE_SIZE=100
PAGE=1
```

### Note

.env file was uploaded for environment reference (usually will be included in .gitignore)
