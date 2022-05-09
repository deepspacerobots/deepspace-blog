# Deep Space Robots
[![Netlify Status](https://api.netlify.com/api/v1/badges/9874ad27-bbf4-44a8-9409-d7efd473b343/deploy-status)](https://app.netlify.com/sites/deepspacerobots/deploys)

This is a static site build powered by eleventy. The compiled site is in `/_site`, don't touch these files.  Everything else is fair game.  The base pages are the `.html` files in the project root.


## Installation
Install the dev environment build tools:
`npm i`

## Development

`npm run start`
This starts a browsersync session and hot-reloads the site in-browser when you edit a source file.

### Assets
In the project root, you'll find a dir `/assets` these files are copied into `/_site` whenever source file is changed.  Responsive images are generated on-the-fly, and we want to keep them separate from the source images.  

### Style
SCSS files are in `/assets/scss`

### Images
Put any images you need in `/assets/img/`.  Use them in the templates via the shortcode: `{% image 'filename.jpg', 'alt text describing the image' %}`
