#!/usr/bin/env bash

git clone https://github.com/tategallery/collection.git tate-gallery-tmp

rm -rf tate-gallery
mkdir tate-gallery
mv tate-gallery-tmp/artists tate-gallery/artists
mv tate-gallery-tmp/artworks tate-gallery/artworks
rm -rf tate-gallery-tmp

echo 'Instalation completed!'
