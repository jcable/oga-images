Heroku PHP app do prototype an image uploader.

Requirements:

Images must be scaled to less than 2 Mbytes.
Metadata must be added with each image.
Metadata common to a batch should be entered only once.
Caption and Description must be entered separately for each image.
Images might need to be rotated before upload.

The server side application is just a demo - it saves the image in the root directory and creates an html file with the metadata and a scaled image which links to the main image.
