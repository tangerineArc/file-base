# FileBase

FileBase is a minimalist, self-hosted file storage service. It lets users securely log in, create folders, upload files, and access/download them from anywhere.

## Features

- Authenticated users can upload and download files
- Users can create, rename, and delete folders for file organization
- View file metadata (name, size, mimetype, upload time)
- Anonymous posting where non-members can read stories, but only members can see who posted them
- Members can create titled posts with timestamps and content
- Shareable public links for folders with expiration support (e.g. valid for 1d, 10d, etc.)
- No authentication required for file downloads via publicly shared links
- Distinct icons for different filetypes

## Tech Stack

- **JavaScript** - core programming language
- **Node** - backend runtime
- **Express** - web server framework
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - relational database engine
- **Multer** - file upload middleware
- **Supabase** - cloud storage for files
- **Passport** - auth strategy provider
- **bcrypt** - hash and compare passwords
- **Express Validator** - data validation library
- **EJS** - templating engine for views
- **CSS** - UI styling

## Repo Structure

Below is a list of the project directories and files:

- `auth-config/` - contains config files for auth
  - `session-config.js` - prisma session store setup
  - `strategy.js` - passport local-strategy setup
  - `transformers.js` - cookie serializer and deserializer
- `controllers/` - contains auth- and folders-controllers
- `middlewares/`
  - `authenticators.js` - authorization middlewares for route protection
  - `file-uploader.js` - multer config and middleware
  - `prevent-back.js` - cache and navigation control middlewares
- `prism-config/prima-client.js` - instantiate prisma client
- `prisma/schema.prisma` - database schema definition
- `public/`
  - `scripts/` - JS files
  - `styles/` - CSS files
- `routes/` - contains auth- and folders-routers
- `supabse-config/storage-client.js` - instantiate Supabase storage client
- `utils/`
  - `data-formatter.js` - formatting functions for date and time
  - `icon-provider.js` - icons map with mimetype
  - `data-formatter.js` - generate nested folder-structure
- `validators/` - contains data validation middlewares
- `views/` - contains EJS page templates
- `app.js` - server setup and entrypoint

## Snapshots

[![file-base-1.png](https://i.postimg.cc/fyJcqBws/file-base-1.png)](https://postimg.cc/ZvzvCPBs)
[![file-base-2.png](https://i.postimg.cc/YCpNL1Vt/file-base-2.png)](https://postimg.cc/hf5QH7cY)
