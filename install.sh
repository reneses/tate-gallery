#!/usr/bin/env bash

echo 'Downloading Tate collection from Github...'
#git clone https://github.com/tategallery/collection.git tate-gallery-tmp

echo 'Cleaning the downloaded files...'
rm -rf tate-gallery
mkdir tate-gallery
mv tate-gallery-tmp/artists tate-gallery/artists
mv tate-gallery-tmp/artworks tate-gallery/artworks
rm -rf tate-gallery-tmp

echo 'Importing to the DB...'
node import.js

echo 'Cleaning files...'
rm -rf tate-gallery

echo 'Instalation completed!'